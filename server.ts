import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load env variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'the_colaco_hut_luxury_secret_key_2026';

// Database Services
import { 
  adminService,
  reservationService,
  menuService,
  galleryService,
  blogService,
  subscriberService,
  messageService,
  jobService,
  eventService,
  testimonialService,
  dashboardService,
  managerService
} from './src/services/dbService';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable basic security in code
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Database presence middleware
const dbCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({
      error: 'Database connection missing',
      details: 'This feature requires a configured database. Please set the DATABASE_URL environment variable in the Secrets tab.'
    });
    return;
  }
  next();
};

// Authentication Middlewares
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. Token missing.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired signature.' });
  }
}

function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden. Requires ${roles.join(' or ')} privilege.` });
      return;
    }
    next();
  };
}

// ---------------------- AUTH ENDPOINTS ----------------------

function parseUserAgent(ua: string | undefined) {
  if (!ua) return { browser: 'Unknown Browser', device: 'Unknown Device' };
  let browser = 'Other';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';

  let device = 'Desktop';
  if (ua.includes('Mobi') || ua.includes('Android') || ua.includes('iPhone')) {
    device = 'Mobile';
  } else if (ua.includes('iPad') || ua.includes('Tablet')) {
    device = 'Tablet';
  }
  return { browser, device };
}

app.post('/api/auth/login', dbCheck, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const admin = await adminService.getByEmail(email);
    if (!admin) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    if (admin.status === 'Suspended') {
      res.status(403).json({ error: 'Your account has been suspended by the administrator.' });
      return;
    }

    if (admin.status === 'Inactive') {
      res.status(403).json({ error: 'Your account is currently inactive. Contact Owner.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    // Update login statistics
    const updatedCount = (admin.loginCount || 0) + 1;
    await managerService.update(admin.id, {
      lastLogin: new Date(),
      loginCount: updatedCount
    });

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      admin.id,
      admin.name,
      'Login',
      `User ${admin.name} (${admin.email}) logged in successfully.`,
      ip,
      browser,
      device
    );

    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

app.get('/api/auth/me', authenticateJWT, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});


// ---------------------- RESERVATION ENDPOINTS ----------------------

const reservationSchema = z.object({
  guests: z.string(),
  date: z.string(),
  time: z.string(),
  occasion: z.string(),
  seating: z.enum(['indoor', 'outdoor']),
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  specialRequests: z.string().optional()
});

// Create Reservation (Public API)
app.post('/api/reservations', dbCheck, async (req: Request, res: Response) => {
  try {
    const parsedData = reservationSchema.parse(req.body);
    const newReservation = await reservationService.create(parsedData);

    res.status(201).json({
      success: true,
      message: 'Reservation submitted successfully',
      bookingCode: newReservation.id,
      reservation: newReservation
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.issues });
    } else {
      console.error('Error recording reservation:', error);
      res.status(500).json({ error: 'Failed to record reservation' });
    }
  }
});

// List Reservations (Admin API)
app.get('/api/reservations', dbCheck, authenticateJWT, async (req: AuthRequest, res: Response) => {
  const { date, status, search } = req.query;
  try {
    const results = await reservationService.getFiltered({
      date: date as string,
      status: status as string,
      search: search as string
    });
    res.json(results);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Update Reservation Status (Admin API)
app.put('/api/reservations/:id', dbCheck, authenticateJWT, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['Pending', 'Confirmed', 'Cancelled', 'Seated', 'Completed'].includes(status)) {
    res.status(400).json({ error: 'Invalid reservation status value.' });
    return;
  }

  try {
    const reservation = await reservationService.updateStatus(id, status);
    if (!reservation) {
      res.status(404).json({ error: 'Reservation not found.' });
      return;
    }

    res.json({ success: true, message: `Reservation status updated to ${status}.`, reservation });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ error: 'Failed to update reservation.' });
  }
});

// Delete Reservation (Admin/Manager API)
app.delete('/api/reservations/:id', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await reservationService.delete(id);
    res.json({ success: true, message: 'Reservation removed successfully.' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation.' });
  }
});


// ---------------------- MENU MANAGEMENT ENDPOINTS ----------------------

// Get Menu Items (Public API)
app.get('/api/menu', dbCheck, async (req: Request, res: Response) => {
  try {
    const menu = await menuService.getAll();
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// Add Menu Item (Admin/Manager API)
app.post('/api/menu', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const item = req.body;
  if (!item.name || !item.category || !item.price) {
    res.status(400).json({ error: 'Missing core fields: name, category, price.' });
    return;
  }

  try {
    const newItem = await menuService.add({
      name: item.name,
      category: item.category,
      price: Number(item.price),
      description: item.description || '',
      recommended: !!item.recommended,
      bestSeller: !!item.bestSeller,
      seasonal: !!item.seasonal,
      spicyLevel: item.spicyLevel !== undefined ? Number(item.spicyLevel) : 0
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Failed to add menu item.' });
  }
});

// Edit Menu Item (Admin/Manager API)
app.put('/api/menu/:id', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const updated = await menuService.update(id, {
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      spicyLevel: req.body.spicyLevel !== undefined ? Number(req.body.spicyLevel) : undefined
    });

    if (!updated) {
      res.status(404).json({ error: 'Item not found.' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// Delete Menu Item (Admin/Manager API)
app.delete('/api/menu/:id', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await menuService.delete(id);
    res.json({ success: true, message: 'Item deleted.' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});


// ---------------------- NEWSLETTER ENDPOINTS ----------------------

app.post('/api/newsletter/subscribe', dbCheck, async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  try {
    await subscriberService.subscribe(email.toLowerCase());
    res.json({ success: true, message: 'Thank you for subscribing to Colaco luxury updates.' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

app.get('/api/newsletter/subscribers', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await subscriberService.getAll();
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});


// ---------------------- CONTACT FORM ENDPOINTS ----------------------

app.post('/api/contact', dbCheck, async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message content are required.' });
    return;
  }

  try {
    const newMessage = await messageService.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    res.json({ success: true, message: 'Your message has been safely delivered to our Guest Relations Director.', data: newMessage });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to submit contact message.' });
  }
});

app.get('/api/contact', dbCheck, authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await messageService.getAll();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

app.put('/api/contact/:id/reply', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    res.status(400).json({ error: 'Reply text is required.' });
    return;
  }

  try {
    const msg = await messageService.reply(id, replyText);
    if (!msg) {
      res.status(404).json({ error: 'Message not found.' });
      return;
    }

    res.json({ success: true, message: 'Reply submitted successfully.', messageData: msg });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to submit reply.' });
  }
});


// ---------------------- CAREERS & JOBS ENDPOINTS ----------------------

app.get('/api/jobs', dbCheck, async (req: Request, res: Response) => {
  try {
    const jobs = await jobService.getAll();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch job openings.' });
  }
});

app.post('/api/jobs', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  const { title, department, type, experienceRequired, description, requirements, salaryRange } = req.body;
  if (!title || !department || !type || !description) {
    res.status(400).json({ error: 'Missing essential job specifications.' });
    return;
  }

  try {
    const newJob = await jobService.add({
      title,
      department,
      type,
      experienceRequired: experienceRequired || 'No experience specified',
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      salaryRange: salaryRange || 'Undisclosed'
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error adding job opening:', error);
    res.status(500).json({ error: 'Failed to create job opening.' });
  }
});

app.post('/api/jobs/:id/apply', dbCheck, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, experience, coverLetter, resumeUrl } = req.body;

  if (!name || !email || !phone || !experience) {
    res.status(400).json({ error: 'Please provide name, email, phone, and experience highlights.' });
    return;
  }

  try {
    const application = await jobService.apply({
      jobId: id,
      jobTitle: req.body.jobTitle || 'Career Position',
      name,
      email,
      phone,
      experience,
      coverLetter,
      resumeUrl: resumeUrl || ''
    });

    res.status(201).json({
      success: true,
      message: 'Application recorded. Our Operations Director will review your portfolio within 72 hours.',
      application
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

app.get('/api/jobs/applications', dbCheck, authenticateJWT, requireRole(['Admin', 'Manager']), async (req: AuthRequest, res: Response) => {
  try {
    const applications = await jobService.getApplications();
    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});


// ---------------------- GALLERY, EVENTS, TESTIMONIALS, BLOGS ----------------------

app.get('/api/gallery', dbCheck, async (req: Request, res: Response) => {
  try {
    const gallery = await galleryService.getAll();
    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery.' });
  }
});

app.get('/api/events', dbCheck, async (req: Request, res: Response) => {
  try {
    const events = await eventService.getAll();
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

app.get('/api/testimonials', dbCheck, async (req: Request, res: Response) => {
  try {
    const testimonials = await testimonialService.getAll();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials.' });
  }
});

app.get('/api/blogs', dbCheck, async (req: Request, res: Response) => {
  try {
    const blogs = await blogService.getAll();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});


// ---------------------- MANAGER MANAGEMENT ENDPOINTS ----------------------

const createManagerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email format."),
  phone: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters."),
  department: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  status: z.enum(['Active', 'Inactive', 'Suspended']).default('Active'),
  notes: z.string().optional().nullable()
});

const updateManagerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  status: z.enum(['Active', 'Inactive', 'Suspended']).optional(),
  notes: z.string().optional().nullable()
});

// Get manager stats (Admin Only)
app.get('/api/managers/stats', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const stats = await managerService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching manager stats:', error);
    res.status(500).json({ error: 'Failed to fetch manager stats.' });
  }
});

// Get filtered managers (Admin Only)
app.get('/api/managers', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { search, status, department, sortBy, order, page, limit } = req.query;
    const filters = {
      search: search as string,
      status: status as string,
      department: department as string,
      sortBy: sortBy as string,
      order: (order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10
    };
    const result = await managerService.getFiltered(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching managers:', error);
    res.status(500).json({ error: 'Failed to fetch managers.' });
  }
});

// Get single manager (Admin Only)
app.get('/api/managers/:id', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const manager = await managerService.getById(req.params.id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found.' });
      return;
    }
    res.json(manager);
  } catch (error) {
    console.error('Error fetching manager details:', error);
    res.status(500).json({ error: 'Failed to fetch manager details.' });
  }
});

// Create new manager (Admin Only)
app.post('/api/managers', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createManagerSchema.parse(req.body);

    // Unique email check across all admins/managers
    const existing = await adminService.getByEmail(parsed.email);
    if (existing) {
      res.status(400).json({ error: 'Email is already registered.' });
      return;
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);

    const newManager = await managerService.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || undefined,
      username: parsed.username || undefined,
      passwordHash,
      department: parsed.department || undefined,
      profileImage: parsed.profileImage || undefined,
      status: parsed.status,
      notes: parsed.notes || undefined,
      createdBy: req.user?.id
    });

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      req.user?.id || 'unknown',
      req.user?.name,
      'Manager Created',
      `Created manager ${newManager.name} (${newManager.email}) in ${newManager.department || 'N/A'} department.`,
      ip,
      browser,
      device
    );

    res.status(201).json({
      success: true,
      message: 'Manager successfully created.',
      manager: newManager
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0]?.message || 'Validation failed', details: error.issues });
    } else {
      console.error('Error creating manager:', error);
      res.status(500).json({ error: 'Failed to create manager.' });
    }
  }
});

// Update manager (Admin Only)
app.put('/api/managers/:id', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateManagerSchema.parse(req.body);

    // Verify it is a Manager, not an Admin or non-existent
    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager account not found or cannot edit this account role.' });
      return;
    }

    // Email unique check
    if (parsed.email && parsed.email !== manager.email) {
      const existing = await adminService.getByEmail(parsed.email);
      if (existing) {
        res.status(400).json({ error: 'Email is already registered by another account.' });
        return;
      }
    }

    const updated = await managerService.update(id, {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      username: parsed.username,
      department: parsed.department,
      profileImage: parsed.profileImage,
      status: parsed.status,
      notes: parsed.notes,
      updatedBy: req.user?.id
    });

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      req.user?.id || 'unknown',
      req.user?.name,
      'Manager Updated',
      `Updated manager ${updated.name} properties. Status is now ${updated.status}.`,
      ip,
      browser,
      device
    );

    res.json({
      success: true,
      message: 'Manager updated successfully.',
      manager: updated
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues[0]?.message || 'Validation failed', details: error.issues });
    } else {
      console.error('Error updating manager:', error);
      res.status(500).json({ error: 'Failed to update manager.' });
    }
  }
});

// Delete manager (Admin Only)
app.delete('/api/managers/:id', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      res.status(400).json({ error: 'Cannot delete your own currently logged-in Admin/Owner account.' });
      return;
    }

    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager account not found.' });
      return;
    }

    await managerService.delete(id);

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      req.user?.id || 'unknown',
      req.user?.name,
      'Manager Deleted',
      `Permanently deleted manager account ${manager.name} (${manager.email}).`,
      ip,
      browser,
      device
    );

    res.json({ success: true, message: 'Manager deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting manager:', error);
    res.status(500).json({ error: error.message || 'Failed to delete manager.' });
  }
});

// Reset manager password (Admin Only)
app.put('/api/managers/:id/reset-password', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await managerService.resetPassword(id, passwordHash);

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      req.user?.id || 'unknown',
      req.user?.name,
      'Password Reset',
      `Securely reset password for manager ${manager.name} (${manager.email}).`,
      ip,
      browser,
      device
    );

    res.json({ success: true, message: 'Manager password reset completed successfully.' });
  } catch (error) {
    console.error('Error resetting manager password:', error);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// Update manager status directly (Admin Only)
app.put('/api/managers/:id/status', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be Active, Inactive, or Suspended.' });
      return;
    }

    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found.' });
      return;
    }

    const updated = await managerService.update(id, { status });

    // Logging
    const ip = req.ip || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const { browser, device } = parseUserAgent(ua);
    await managerService.logAction(
      req.user?.id || 'unknown',
      req.user?.name,
      'Status Changed',
      `Changed status of manager ${manager.name} to ${status}.`,
      ip,
      browser,
      device
    );

    res.json({ success: true, message: 'Manager status updated successfully.', manager: updated });
  } catch (error) {
    console.error('Error updating manager status:', error);
    res.status(500).json({ error: 'Failed to update status.' });
  }
});

// Get manager activity logs (Admin Only)
app.get('/api/managers/:id/activity', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found.' });
      return;
    }
    const logs = await managerService.getActivityLogs(id);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching manager activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs.' });
  }
});

// Get manager login history (Admin Only)
app.get('/api/managers/:id/login-history', dbCheck, authenticateJWT, requireRole(['Admin']), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const manager = await managerService.getById(id);
    if (!manager) {
      res.status(404).json({ error: 'Manager not found.' });
      return;
    }
    const history = await managerService.getLoginHistory(id);
    res.json(history);
  } catch (error) {
    console.error('Error fetching manager login history:', error);
    res.status(500).json({ error: 'Failed to fetch login history.' });
  }
});


// ---------------------- ADMIN STATS DASHBOARD ----------------------

app.get('/api/dashboard/stats', dbCheck, authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics.' });
  }
});


// ---------------------- STATIC ASSETS & VITE SERVING ----------------------
async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: {
          middlewareMode: true,
        },
        appType: "spa",
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");

      app.use(express.static(distPath));

      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==================================");
      console.log("🚀 The Colaco Hut Server Started");
      console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
      console.log(`🚪 Port        : ${PORT}`);
      console.log("==================================");
    });
  } catch (err) {
    console.error("Server failed to start");
    console.error(err);
    process.exit(1);
  }
}

startServer();