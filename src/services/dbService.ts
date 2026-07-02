import { getPrisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  phone?: string | null;
  username?: string | null;
  department?: string | null;
  profileImage?: string | null;
  status?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  lastLogin?: Date | null;
  loginCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Reservation {
  id: string;
  guests: string;
  date: string;
  time: string;
  occasion: string;
  seating: string;
  name: string;
  phone: string;
  email: string;
  specialRequests?: string | null;
  status: string;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  recommended: boolean;
  bestSeller: boolean;
  seasonal: boolean;
  spicyLevel: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  replyText?: string | null;
  createdAt: Date;
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: string;
  experienceRequired: string;
  description: string;
  requirements: string[];
  salaryRange?: string | null;
  active: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  appliedAt: Date;
  status: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  pricePerPerson: number;
  imageUrl?: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  source: string;
}

// ------------------ SERVICE IMPLEMENTATION ------------------

export const adminService = {
  async getByEmail(email: string): Promise<AdminUser | null> {
    const prisma = getPrisma();
    return prisma.admin.findUnique({
      where: { email }
    });
  },

  async getById(id: string): Promise<AdminUser | null> {
    const prisma = getPrisma();
    return prisma.admin.findUnique({
      where: { id }
    });
  }
};

export const reservationService = {
  async create(data: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Promise<Reservation> {
    const prisma = getPrisma();
    // Generate code e.g. CH-REV-123
    const id = `CH-REV-${Math.floor(100 + Math.random() * 900)}`;
    return prisma.reservation.create({
      data: {
        id,
        ...data,
        status: 'Pending'
      }
    });
  },

  async getFiltered(filters: { date?: string; status?: string; search?: string }): Promise<Reservation[]> {
    const prisma = getPrisma();
    const { date, status, search } = filters;

    const whereClause: any = {};

    if (date) {
      whereClause.date = date;
    }
    if (status) {
      whereClause.status = {
        equals: status,
      };
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { id: { contains: search } }
      ];
    }

    return prisma.reservation.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
  },

  async updateStatus(id: string, status: string): Promise<Reservation | null> {
    const prisma = getPrisma();
    return prisma.reservation.update({
      where: { id },
      data: { status }
    });
  },

  async delete(id: string): Promise<boolean> {
    const prisma = getPrisma();
    await prisma.reservation.delete({
      where: { id }
    });
    return true;
  }
};

export const menuService = {
  async getAll(): Promise<MenuItem[]> {
    const prisma = getPrisma();
    return prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
  },

  async add(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const prisma = getPrisma();
    return prisma.menuItem.create({
      data: {
        id: `menu-${uuidv4().substring(0, 8)}`,
        ...item
      }
    });
  },

  async update(id: string, item: Partial<MenuItem>): Promise<MenuItem | null> {
    const prisma = getPrisma();
    return prisma.menuItem.update({
      where: { id },
      data: item
    });
  },

  async delete(id: string): Promise<boolean> {
    const prisma = getPrisma();
    await prisma.menuItem.delete({
      where: { id }
    });
    return true;
  }
};

export const galleryService = {
  async getAll(): Promise<GalleryItem[]> {
    const prisma = getPrisma();
    return prisma.galleryItem.findMany();
  },

  async add(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const prisma = getPrisma();
    return prisma.galleryItem.create({
      data: {
        id: `gallery-${uuidv4().substring(0, 8)}`,
        ...item
      }
    });
  }
};

export const blogService = {
  async getAll(): Promise<BlogPost[]> {
    const prisma = getPrisma();
    return prisma.blogPost.findMany({
      orderBy: { date: 'desc' }
    });
  }
};

export const subscriberService = {
  async subscribe(email: string): Promise<Subscriber> {
    const prisma = getPrisma();
    return prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: {
        id: `sub-${uuidv4().substring(0, 8)}`,
        email
      }
    });
  },

  async getAll(): Promise<Subscriber[]> {
    const prisma = getPrisma();
    return prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    });
  }
};

export const messageService = {
  async create(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt' | 'replyText'>): Promise<ContactMessage> {
    const prisma = getPrisma();
    return prisma.contactMessage.create({
      data: {
        id: `msg-${uuidv4().substring(0, 8)}`,
        ...data,
        status: 'Unread'
      }
    });
  },

  async getAll(): Promise<ContactMessage[]> {
    const prisma = getPrisma();
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async reply(id: string, replyText: string): Promise<ContactMessage | null> {
    const prisma = getPrisma();
    return prisma.contactMessage.update({
      where: { id },
      data: {
        replyText,
        status: 'Replied'
      }
    });
  }
};

export const jobService = {
  async getAll(): Promise<JobPosition[]> {
    const prisma = getPrisma();
    const prismaJobs = await prisma.jobPosition.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });

    return prismaJobs.map(job => ({
      ...job,
      requirements: Array.isArray(job.requirements) 
        ? (job.requirements as string[]) 
        : JSON.parse(job.requirements as string)
    }));
  },

  async add(job: Omit<JobPosition, 'id' | 'active'>): Promise<JobPosition> {
    const prisma = getPrisma();
    const id = `job-${uuidv4().substring(0, 8)}`;
    const created = await prisma.jobPosition.create({
      data: {
        id,
        title: job.title,
        department: job.department,
        type: job.type,
        experienceRequired: job.experienceRequired,
        description: job.description,
        requirements: JSON.stringify(job.requirements),
        salaryRange: job.salaryRange,
        active: true
      }
    });

    return {
      ...created,
      requirements: job.requirements
    };
  },

  async apply(appData: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>): Promise<JobApplication> {
    const prisma = getPrisma();
    const id = `app-${uuidv4().substring(0, 8)}`;
    return prisma.jobApplication.create({
      data: {
        id,
        ...appData,
        status: 'Pending'
      }
    });
  },

  async getApplications(): Promise<JobApplication[]> {
    const prisma = getPrisma();
    return prisma.jobApplication.findMany({
      orderBy: { appliedAt: 'desc' }
    });
  }
};

export const eventService = {
  async getAll(): Promise<EventItem[]> {
    const prisma = getPrisma();
    return prisma.eventItem.findMany({
      orderBy: { createdAt: 'asc' }
    });
  }
};

export const testimonialService = {
  async getAll(): Promise<Testimonial[]> {
    const prisma = getPrisma();
    return prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
};

export const dashboardService = {
  async getStats() {
    const prisma = getPrisma();
    
    const [
      pendingReservations,
      upcomingReservationsCount,
      unreadMessages,
      recentApplicationsCount,
      subscribersCount,
      totalMenuCount,
      latestReservations,
      latestMessages
    ] = await Promise.all([
      prisma.reservation.count({ where: { status: 'Pending' } }),
      prisma.reservation.count({ where: { status: 'Confirmed' } }),
      prisma.contactMessage.count({ where: { status: 'Unread' } }),
      prisma.jobApplication.count({ where: { status: 'Pending' } }),
      prisma.subscriber.count(),
      prisma.menuItem.count(),
      prisma.reservation.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ]);

    return {
      pendingReservations,
      upcomingReservationsCount,
      unreadMessages,
      recentApplicationsCount,
      subscribersCount,
      totalMenuCount,
      latestReservations,
      latestMessages
    };
  }
};

export const managerService = {
  async getStats() {
    const prisma = getPrisma();
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, active, inactive, suspended, online, loggedInToday, recentlyAdded] = await Promise.all([
      prisma.admin.count({ where: { role: 'Manager' } }),
      prisma.admin.count({ where: { role: 'Manager', status: 'Active' } }),
      prisma.admin.count({ where: { role: 'Manager', status: 'Inactive' } }),
      prisma.admin.count({ where: { role: 'Manager', status: 'Suspended' } }),
      prisma.admin.count({ where: { role: 'Manager', lastLogin: { gte: fifteenMinsAgo } } }),
      prisma.admin.count({ where: { role: 'Manager', lastLogin: { gte: startOfToday } } }),
      prisma.admin.findMany({
        where: { role: 'Manager' },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      total,
      active,
      inactive,
      suspended,
      online,
      loggedInToday,
      recentlyAdded
    };
  },

  async getFiltered(filters: { search?: string; status?: string; department?: string; sortBy?: string; order?: 'asc' | 'desc'; page?: number; limit?: number }) {
    const prisma = getPrisma();
    const { search, status, department, sortBy = 'name', order = 'asc', page = 1, limit = 10 } = filters;

    const whereClause: any = {
      role: 'Manager'
    };

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (department && department !== 'All') {
      whereClause.department = department;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { username: { contains: search } },
        { department: { contains: search } }
      ];
    }

    const orderByClause: any = {};
    if (sortBy === 'name') {
      orderByClause.name = order;
    } else if (sortBy === 'createdAt') {
      orderByClause.createdAt = order;
    } else if (sortBy === 'department') {
      orderByClause.department = order;
    } else if (sortBy === 'lastLogin') {
      orderByClause.lastLogin = order;
    } else if (sortBy === 'status') {
      orderByClause.status = order;
    } else {
      orderByClause.name = 'asc';
    }

    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      prisma.admin.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limit
      }),
      prisma.admin.count({
        where: whereClause
      })
    ]);

    return {
      items,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    };
  },

  async getById(id: string) {
    const prisma = getPrisma();
    return prisma.admin.findFirst({
      where: { id, role: 'Manager' }
    });
  },

  async create(data: { name: string; email: string; phone?: string; username?: string; passwordHash: string; department?: string; profileImage?: string; status: string; notes?: string; createdBy?: string }) {
    const prisma = getPrisma();
    return prisma.admin.create({
      data: {
        ...data,
        role: 'Manager'
      }
    });
  },

  async update(id: string, data: Partial<{ name: string; email: string; phone?: string; username?: string; department?: string; profileImage?: string; status: string; notes?: string; updatedBy?: string; lastLogin?: Date | null; loginCount?: number }>) {
    const prisma = getPrisma();
    return prisma.admin.update({
      where: { id },
      data
    });
  },

  async delete(id: string) {
    const prisma = getPrisma();
    const manager = await prisma.admin.findFirst({
      where: { id, role: 'Manager' }
    });
    if (!manager) {
      throw new Error('Manager not found or unauthorized to delete.');
    }
    await prisma.admin.delete({
      where: { id }
    });
    return true;
  },

  async resetPassword(id: string, passwordHash: string) {
    const prisma = getPrisma();
    return prisma.admin.update({
      where: { id },
      data: { passwordHash }
    });
  },

  async logAction(userId: string, userName: string | undefined, action: string, details: string, ipAddress?: string, browser?: string, device?: string) {
    const prisma = getPrisma();
    return prisma.managerLog.create({
      data: {
        userId,
        userName: userName || null,
        action,
        details,
        ipAddress: ipAddress || null,
        browser: browser || null,
        device: device || null
      }
    });
  },

  async getActivityLogs(userId: string) {
    const prisma = getPrisma();
    return prisma.managerLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  },

  async getLoginHistory(userId: string) {
    const prisma = getPrisma();
    return prisma.managerLog.findMany({
      where: { userId, action: 'Login' },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }
};

