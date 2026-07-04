import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Mail, Shield, BarChart3, Calendar, MessageSquare, 
  BookOpen, MailOpen, LogOut, CheckCircle, XCircle, Trash2, Plus, 
  Edit3, RefreshCw, Briefcase, ChevronRight, UserCheck, Tag, Info,
  Eye, Clock, Activity, Phone, FileText, Globe, Radio, Sparkles, AlertTriangle,
  ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuItem } from '../types';
import GourmetAnalytics from './GourmetAnalytics';

// ===========================
// Portfolio Demo Mode
// Set this to false to reconnect to your real backend API
// ===========================
const PORTFOLIO_MODE = true;

export default function AdminSection() {
  const [token, setToken] = useState<string>(localStorage.getItem('admin_token') || '');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'reservations' | 'messages' | 'menu' | 'newsletter' | 'careers' | 'managers'>('stats');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDemoAccess, setShowDemoAccess] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Stats & listings state
  const [stats, setStats] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Forms for adding/editing menu
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'starters',
    price: '',
    description: '',
    recommended: false,
    bestSeller: false,
    seasonal: false,
    spicyLevel: 0
  });

  // Reply message form
  const [replyMessageId, setReplyMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Filter and search state for reservations
  const [resFilterStatus, setResFilterStatus] = useState('');
  const [resSearch, setResSearch] = useState('');

  // Manager management state
  const [managersData, setManagersData] = useState<any>({ items: [], totalCount: 0, totalPages: 1, page: 1 });
  const [managerStats, setManagerStats] = useState<any>(null);
  const [managerSearch, setManagerSearch] = useState('');
  const [managerStatusFilter, setManagerStatusFilter] = useState('All');
  const [managerSortBy, setManagerSortBy] = useState('name');
  const [managerSortOrder, setManagerSortOrder] = useState<'asc' | 'desc'>('asc');
  const [managerPage, setManagerPage] = useState(1);

  // Profile view detailed state
  const [selectedProfileManager, setSelectedProfileManager] = useState<any>(null);
  const [profileActivityLogs, setProfileActivityLogs] = useState<any[]>([]);
  const [profileLoginHistory, setProfileLoginHistory] = useState<any[]>([]);
  const [profileLogsLoading, setProfileLogsLoading] = useState(false);
  const [activeProfileSubTab, setActiveProfileSubTab] = useState<'info' | 'activity' | 'logins'>('info');

  // Modals & form displays
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [editingManager, setEditingManager] = useState<any>(null);
  const [resettingPasswordManagerId, setResettingPasswordManagerId] = useState<string | null>(null);

  // Form states
  const [managerFormData, setManagerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    department: 'Management',
    profileImage: '',
    status: 'Active',
    notes: ''
  });
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [managerFormError, setManagerFormError] = useState('');

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoginError('');
    setIsLoggingIn(true);

    // ===========================
    // Portfolio Demo Mode
    // ===========================
    if (PORTFOLIO_MODE) {
      setTimeout(() => {
        if (email === 'admin@colacohut.com' && password === 'ColacoHutAdmin2026!') {
          const demoUser = {
            id: '1',
            name: 'Joshua Fernandes',
            email,
            role: 'Admin'
          };
          localStorage.setItem('admin_token', 'demo-token');
          setToken('demo-token');
          setUser(demoUser);
        } else if (email === 'clara@colacohut.com' && password === 'ClaraManager2026!') {
          const demoUser = {
            id: '2',
            name: "Clara D'Souza",
            email,
            role: 'Manager'
          };
          localStorage.setItem('admin_token', 'demo-token');
          setToken('demo-token');
          setUser(demoUser);
        } else {
          setLoginError('Invalid credentials');
        }
        setIsLoggingIn(false);
      }, 800);

      return;
    }

    // ===========================
    // Real Backend
    // ===========================
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Server connection issue. Please make sure server is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setUser(null);
  };

  // Fetch all administrative data from APIs
  const fetchAllAdminData = async () => {
    if (!token) return;
    setIsLoadingData(true);

    // ===========================
    // Portfolio Demo Mode
    // ===========================
    if (PORTFOLIO_MODE) {
      setStats({
        pendingReservations: 12,
        upcomingReservationsCount: 28,
        unreadMessages: 6,
        subscribersCount: 548,
        recentApplicationsCount: 15
      });

      setReservations([
        {
          id: 'R001',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '9876543210',
          guests: 4,
          date: '2026-07-15',
          time: '7:30 PM',
          seating: 'indoor',
          occasion: 'Birthday',
          status: 'Pending',
          specialRequests: 'Window seat'
        },
        {
          id: 'R002',
          name: 'Priya Nair',
          email: 'priya@example.com',
          phone: '9812345670',
          guests: 2,
          date: '2026-07-16',
          time: '8:00 PM',
          seating: 'outdoor',
          occasion: 'Anniversary',
          status: 'Confirmed',
          specialRequests: ''
        }
      ]);

      setMessages([
        {
          id: 'M001',
          name: 'Emily Brown',
          email: 'emily@example.com',
          phone: '9999999999',
          subject: 'Reservation',
          message: 'Can I reserve a table for tonight?',
          status: 'Unread'
        },
        {
          id: 'M002',
          name: 'Rahul Verma',
          email: 'rahul@example.com',
          phone: '9123456780',
          subject: 'Private Event',
          message: 'Do you host private dinners for 20 guests?',
          status: 'Replied',
          replyText: 'Yes, we do! Our events team will reach out shortly.'
        }
      ]);

      setMenuItems([
        {
          id: '1',
          name: 'Goan Prawn Curry',
          category: 'goan',
          price: 850,
          description: 'Traditional Goan curry.',
          recommended: true,
          bestSeller: true,
          seasonal: false,
          spicyLevel: 2
        },
        {
          id: '2',
          name: 'Piri Piri Chicken',
          category: 'portuguese',
          price: 720,
          description: 'Fiery Portuguese-style grilled chicken.',
          recommended: false,
          bestSeller: false,
          seasonal: true,
          spicyLevel: 3
        }
      ] as MenuItem[]);

      setSubscribers([
        { id: '1', email: 'guest@example.com', subscribedAt: new Date().toISOString() },
        { id: '2', email: 'foodie@example.com', subscribedAt: new Date().toISOString() }
      ]);

      setApplications([
        {
          id: '1',
          name: 'Alex Fernandes',
          email: 'alex@example.com',
          phone: '9876543210',
          jobTitle: 'Chef',
          experience: '5 Years',
          coverLetter: 'Looking forward to joining.',
          resumeUrl: '#',
          status: 'Pending'
        }
      ]);

      setIsLoadingData(false);
      return;
    }

    // ===========================
    // Real Backend
    // ===========================
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Stats
      const statsRes = await fetch('/api/dashboard/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Reservations with query filters
      const qParams = new URLSearchParams();
      if (resFilterStatus) qParams.append('status', resFilterStatus);
      if (resSearch) qParams.append('search', resSearch);
      const resRes = await fetch(`/api/reservations?${qParams.toString()}`, { headers });
      if (resRes.ok) setReservations(await resRes.json());

      // Messages
      const msgRes = await fetch('/api/contact', { headers });
      if (msgRes.ok) setMessages(await msgRes.json());

      // Menu
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) setMenuItems(await menuRes.json());

      // Newsletter
      const subRes = await fetch('/api/newsletter/subscribers', { headers });
      if (subRes.ok) setSubscribers(await subRes.json());

      // Applications
      const appRes = await fetch('/api/jobs/applications', { headers });
      if (appRes.ok) setApplications(await appRes.json());

    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Verify token on mount or on change
  useEffect(() => {
    if (!token) return;

    if (PORTFOLIO_MODE) {
      return;
    }

    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error('Session expired');
    })
    .then(data => {
      setUser(data.user);
    })
    .catch(() => {
      handleLogout();
    });
  }, [token]);

  // Load statistical data on tab or filter change
  useEffect(() => {
    if (token) {
      fetchAllAdminData();
    }
  }, [token, activeTab, resFilterStatus, resSearch]);

  // Handle Reservation status updates
  const handleUpdateResStatus = async (id: string, newStatus: string) => {
    if (PORTFOLIO_MODE) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      return;
    }
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Refresh local view
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update reservation');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Reservation deletion
  const handleDeleteRes = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to remove this fine-dining record?')) return;

    if (PORTFOLIO_MODE) {
      setReservations(prev => prev.filter(r => r.id !== id));
      return;
    }

    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete reservation');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Menu form submission (Create or Edit)
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (PORTFOLIO_MODE) {
      if (editingMenuItem) {
        setMenuItems(prev => prev.map(m => m.id === editingMenuItem.id ? {
          ...m,
          ...menuFormData,
          price: Number(menuFormData.price),
          spicyLevel: Number(menuFormData.spicyLevel)
        } as MenuItem : m));
      } else {
        setMenuItems(prev => [...prev, {
          ...menuFormData,
          id: String(Date.now()),
          price: Number(menuFormData.price),
          spicyLevel: Number(menuFormData.spicyLevel)
        } as MenuItem]);
      }
      setShowMenuForm(false);
      setEditingMenuItem(null);
      setMenuFormData({
        name: '',
        category: 'starters',
        price: '',
        description: '',
        recommended: false,
        bestSeller: false,
        seasonal: false,
        spicyLevel: 0
      });
      return;
    }

    try {
      const url = editingMenuItem ? `/api/menu/${editingMenuItem.id}` : '/api/menu';
      const method = editingMenuItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...menuFormData,
          price: Number(menuFormData.price),
          spicyLevel: Number(menuFormData.spicyLevel)
        })
      });

      if (res.ok) {
        setShowMenuForm(false);
        setEditingMenuItem(null);
        setMenuFormData({
          name: '',
          category: 'starters',
          price: '',
          description: '',
          recommended: false,
          bestSeller: false,
          seasonal: false,
          spicyLevel: 0
        });
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update menu item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Edit menu form
  const handleStartEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormData({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description,
      recommended: !!item.recommended,
      bestSeller: !!item.bestSeller,
      seasonal: !!item.seasonal,
      spicyLevel: item.spicyLevel || 0
    });
    setShowMenuForm(true);
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (id: string) => {
    if (!window.confirm('Delete this dish from the digital catalog?')) return;

    if (PORTFOLIO_MODE) {
      setMenuItems(prev => prev.filter(m => m.id !== id));
      return;
    }

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete menu item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit contact message reply
  const handleSubmitMessageReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessageId || !replyText) return;

    setIsSubmittingReply(true);

    if (PORTFOLIO_MODE) {
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === replyMessageId ? { ...m, replyText, status: 'Replied' } : m));
        setReplyMessageId(null);
        setReplyText('');
        setIsSubmittingReply(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch(`/api/contact/${replyMessageId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyText })
      });

      if (res.ok) {
        setReplyMessageId(null);
        setReplyText('');
        fetchAllAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit reply');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // ------------------ MANAGER MANAGEMENT HELPERS ------------------

  const fetchManagers = async () => {
    if (!token || user?.role !== 'Admin') return;

    // ===========================
    // Portfolio Demo Mode
    // ===========================
    if (PORTFOLIO_MODE) {
      const demoManagers = [
        {
          id: '2',
          name: "Clara D'Souza",
          email: 'clara@colacohut.com',
          phone: '9876500000',
          username: 'clarad',
          department: 'Management',
          status: 'Active',
          loginCount: 14,
          lastLogin: new Date().toISOString(),
          notes: 'Reliable weekday lead. Handles VIP bookings personally.',
          profileImage: '',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString()
        },
        {
          id: '3',
          name: 'Marco Pinto',
          email: 'marco@colacohut.com',
          phone: '9822233344',
          username: 'marcop',
          department: 'Culinary',
          status: 'Active',
          loginCount: 9,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          notes: '',
          profileImage: '',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
        },
        {
          id: '4',
          name: 'Anita Rebello',
          email: 'anita@colacohut.com',
          phone: '9812309876',
          username: 'anitar',
          department: 'Guest Relations',
          status: 'Inactive',
          loginCount: 3,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
          notes: 'On extended leave.',
          profileImage: '',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
        }
      ];

      // Apply search / status filter / sort locally so the controls still feel real
      let filtered = demoManagers.filter(m => {
        const matchesSearch = !managerSearch ||
          m.name.toLowerCase().includes(managerSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(managerSearch.toLowerCase()) ||
          (m.department || '').toLowerCase().includes(managerSearch.toLowerCase());
        const matchesStatus = managerStatusFilter === 'All' || m.status === managerStatusFilter;
        return matchesSearch && matchesStatus;
      });

      filtered = filtered.sort((a: any, b: any) => {
        let cmp = 0;
        if (managerSortBy === 'name') cmp = a.name.localeCompare(b.name);
        else if (managerSortBy === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return managerSortOrder === 'asc' ? cmp : -cmp;
      });

      setManagerStats({
        total: demoManagers.length,
        active: demoManagers.filter(m => m.status === 'Active').length,
        inactive: demoManagers.filter(m => m.status === 'Inactive').length,
        suspended: demoManagers.filter(m => m.status === 'Suspended').length,
        online: 1,
        loggedInToday: 2,
        recentlyAdded: demoManagers.slice(0, 3)
      });

      setManagersData({
        items: filtered,
        totalCount: filtered.length,
        totalPages: 1,
        page: 1
      });
      return;
    }

    // ===========================
    // Real Backend
    // ===========================
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch stats
      const statsRes = await fetch('/api/managers/stats', { headers });
      if (statsRes.ok) {
        setManagerStats(await statsRes.json());
      }

      // Fetch filtered list
      const qParams = new URLSearchParams();
      if (managerSearch) qParams.append('search', managerSearch);
      if (managerStatusFilter && managerStatusFilter !== 'All') {
        qParams.append('status', managerStatusFilter);
      }
      qParams.append('sortBy', managerSortBy);
      qParams.append('order', managerSortOrder);
      qParams.append('page', String(managerPage));
      qParams.append('limit', '5');

      const listRes = await fetch(`/api/managers?${qParams.toString()}`, { headers });
      if (listRes.ok) {
        setManagersData(await listRes.json());
      }
    } catch (err) {
      console.error('Error loading manager data:', err);
    }
  };

  // Load manager data on dependency change
  useEffect(() => {
    if (token && activeTab === 'managers' && user?.role === 'Admin') {
      fetchManagers();
    }
  }, [token, activeTab, managerSearch, managerStatusFilter, managerSortBy, managerSortOrder, managerPage, user]);

  const handleManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManagerFormError('');

    if (!managerFormData.name || !managerFormData.email) {
      setManagerFormError('Full Name and Email are required.');
      return;
    }

    if (!editingManager) {
      if (!managerFormData.password) {
        setManagerFormError('Password is required for new accounts.');
        return;
      }
      if (managerFormData.password !== managerFormData.confirmPassword) {
        setManagerFormError('Passwords do not match.');
        return;
      }
      if (managerFormData.password.length < 6) {
        setManagerFormError('Password must be at least 6 characters.');
        return;
      }
    }

    if (PORTFOLIO_MODE) {
      setShowManagerForm(false);
      setEditingManager(null);
      setManagerFormData({
        name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
        department: 'Management',
        profileImage: '',
        status: 'Active',
        notes: ''
      });
      // Simulated success — in demo mode changes aren't persisted to a backend
      alert('Demo mode: manager profile changes are simulated and not saved to a real database.');
      return;
    }

    try {
      const url = editingManager ? `/api/managers/${editingManager.id}` : '/api/managers';
      const method = editingManager ? 'PUT' : 'POST';

      const payload: any = {
        name: managerFormData.name,
        email: managerFormData.email,
        phone: managerFormData.phone || null,
        username: managerFormData.username || null,
        department: managerFormData.department || null,
        profileImage: managerFormData.profileImage || null,
        status: managerFormData.status,
        notes: managerFormData.notes || null
      };

      if (!editingManager) {
        payload.password = managerFormData.password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setShowManagerForm(false);
        setEditingManager(null);
        setManagerFormData({
          name: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          confirmPassword: '',
          department: 'Management',
          profileImage: '',
          status: 'Active',
          notes: ''
        });
        fetchManagers();
      } else {
        setManagerFormError(data.error || 'Failed to save manager profile.');
      }
    } catch (err) {
      console.error(err);
      setManagerFormError('Network error connecting to credential catalog.');
    }
  };

  const handleStartAddManager = () => {
    setEditingManager(null);
    setManagerFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      department: 'Management',
      profileImage: '',
      status: 'Active',
      notes: ''
    });
    setManagerFormError('');
    setShowManagerForm(true);
  };

  const handleStartEditManager = (mgr: any) => {
    setEditingManager(mgr);
    setManagerFormData({
      name: mgr.name || '',
      email: mgr.email || '',
      phone: mgr.phone || '',
      username: mgr.username || '',
      password: '',
      confirmPassword: '',
      department: mgr.department || 'Management',
      profileImage: mgr.profileImage || '',
      status: mgr.status || 'Active',
      notes: mgr.notes || ''
    });
    setManagerFormError('');
    setShowManagerForm(true);
  };

  const handleUpdateManagerStatus = async (id: string, newStatus: string) => {
    if (PORTFOLIO_MODE) {
      setManagersData((prev: any) => ({
        ...prev,
        items: prev.items.map((m: any) => m.id === id ? { ...m, status: newStatus } : m)
      }));
      if (selectedProfileManager && selectedProfileManager.id === id) {
        setSelectedProfileManager((prev: any) => ({ ...prev, status: newStatus }));
      }
      return;
    }

    try {
      const res = await fetch(`/api/managers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchManagers();
        if (selectedProfileManager && selectedProfileManager.id === id) {
          setSelectedProfileManager((prev: any) => ({ ...prev, status: newStatus }));
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewProfile = async (mgr: any) => {
    setSelectedProfileManager(mgr);
    setActiveProfileSubTab('info');
    setProfileActivityLogs([]);
    setProfileLoginHistory([]);
    setProfileLogsLoading(true);

    if (PORTFOLIO_MODE) {
      setTimeout(() => {
        setProfileActivityLogs([
          {
            id: 'a1',
            action: 'RESERVATION_UPDATED',
            details: 'Marked reservation R001 as Confirmed',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            ipAddress: '192.168.1.24',
            browser: 'Chrome',
            device: 'Desktop'
          },
          {
            id: 'a2',
            action: 'MENU_ITEM_ADDED',
            details: 'Added "Piri Piri Chicken" to Portuguese Classics',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
            ipAddress: '192.168.1.24',
            browser: 'Chrome',
            device: 'Desktop'
          }
        ]);
        setProfileLoginHistory([
          {
            id: 'l1',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            ipAddress: '192.168.1.24',
            browser: 'Chrome',
            device: 'Desktop'
          },
          {
            id: 'l2',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29).toISOString(),
            ipAddress: '192.168.1.24',
            browser: 'Safari',
            device: 'Mobile'
          }
        ]);
        setProfileLogsLoading(false);
      }, 500);
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [activityRes, loginRes] = await Promise.all([
        fetch(`/api/managers/${mgr.id}/activity`, { headers }),
        fetch(`/api/managers/${mgr.id}/login-history`, { headers })
      ]);

      if (activityRes.ok) {
        setProfileActivityLogs(await activityRes.json());
      }
      if (loginRes.ok) {
        setProfileLoginHistory(await loginRes.json());
      }
    } catch (err) {
      console.error('Error fetching manager profile activity details:', err);
    } finally {
      setProfileLogsLoading(false);
    }
  };

  const handleDeleteManager = async (id: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently revoke this Manager access and delete this profile? This action is irreversible.')) return;

    if (PORTFOLIO_MODE) {
      setManagersData((prev: any) => ({
        ...prev,
        items: prev.items.filter((m: any) => m.id !== id),
        totalCount: Math.max(0, prev.totalCount - 1)
      }));
      return;
    }

    try {
      const res = await fetch(`/api/managers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchManagers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete manager.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordValue || resetPasswordValue.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (resetPasswordValue !== resetPasswordConfirm) {
      alert('Passwords do not match.');
      return;
    }

    if (PORTFOLIO_MODE) {
      setShowResetPasswordModal(false);
      setResettingPasswordManagerId(null);
      setResetPasswordValue('');
      setResetPasswordConfirm('');
      alert('Demo mode: password reset simulated (not persisted to a real database).');
      return;
    }

    try {
      const res = await fetch(`/api/managers/${resettingPasswordManagerId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: resetPasswordValue })
      });

      if (res.ok) {
        setShowResetPasswordModal(false);
        setResettingPasswordManagerId(null);
        setResetPasswordValue('');
        setResetPasswordConfirm('');
        alert('Manager password securely updated in luxury registry.');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-charcoal text-white py-16 px-6 md:px-12 max-w-7xl mx-auto min-h-[70vh]">
      {!token ? (
        /* Login view */
        <div className="max-w-md mx-auto bg-charcoal-light border border-gold/20 p-8 md:p-12 shadow-2xl relative rounded-none">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold" />

          <div className="text-center space-y-3 mb-10">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/30">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-wider">Staff Credential Desk</h2>
            <p className="font-sans text-[10px] text-gold uppercase tracking-[0.2em] font-medium">Administration Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> EMAIL ADDRESS
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> PASSWORD
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-white/20 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs font-sans font-light">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all cursor-pointer rounded-none disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Console'}
            </button>
          </form>

          {/* Portfolio Demo Access Collapsible Section */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => setShowDemoAccess(!showDemoAccess)}
              className="w-full flex items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-gold" />
                <span className="font-serif text-xs text-gold uppercase tracking-widest font-medium group-hover:text-white transition-colors">
                  Portfolio Demo Access
                </span>
              </div>
              {showDemoAccess ? (
                <ChevronUp className="w-3.5 h-3.5 text-gold group-hover:text-white transition-colors" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-gold group-hover:text-white transition-colors" />
              )}
            </button>

            <AnimatePresence>
              {showDemoAccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-4 pt-2"
                >
                  <p className="font-sans text-[10px] text-white/50 leading-relaxed">
                    This application utilizes secure database authentication. For demonstration purposes, you may review the platform using the following accounts:
                  </p>

                  <div className="space-y-3 bg-white/[0.02] border border-white/5 p-3 font-sans">
                    {/* Owner credentials */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gold font-medium uppercase tracking-wider">Owner (Admin)</span>
                        <span className="text-[8px] text-white/30 italic">Click field to copy</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 text-xs">
                        <div 
                          onClick={() => handleCopy('admin@colacohut.com', 'admin_email')}
                          className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1.5 rounded-none cursor-pointer transition-colors"
                        >
                          <span className="text-white/70 font-mono text-[11px]">admin@colacohut.com</span>
                          {copiedType === 'admin_email' ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                        <div 
                          onClick={() => handleCopy('ColacoHutAdmin2026!', 'admin_pass')}
                          className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1.5 rounded-none cursor-pointer transition-colors">
                          <span className="text-white/70 font-mono text-[11px]">ColacoHutAdmin2026!</span>
                          {copiedType === 'admin_pass' ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 my-2" />

                    {/* Manager credentials */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gold font-medium uppercase tracking-wider">Manager</span>
                      <div className="grid grid-cols-1 gap-1.5 text-xs">
                        <div 
                          onClick={() => handleCopy('clara@colacohut.com', 'mgr_email')}
                          className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1.5 rounded-none cursor-pointer transition-colors"
                        >
                          <span className="text-white/70 font-mono text-[11px]">clara@colacohut.com</span>
                          {copiedType === 'mgr_email' ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                        <div 
                          onClick={() => handleCopy('ClaraManager2026!', 'mgr_pass')}
                          className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1.5 rounded-none cursor-pointer transition-colors"
                        >
                          <span className="text-white/70 font-mono text-[11px]">ClaraManager2026!</span>
                          {copiedType === 'mgr_pass' ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-[9px] text-gold/60 italic leading-relaxed text-center">
                    For privacy and to simulate a real production environment, credentials are not auto-filled. Please enter them manually.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard view */
        <div className="space-y-8">
          {/* Header block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gold/15">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <Shield className="w-4 h-4" />
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold">
                  {user?.role || 'Staff'} Access Level
                </span>
              </div>
              <h2 className="font-serif text-3xl uppercase tracking-wider mt-1">
                Colaco Hut <span className="italic text-gold font-normal">Command Center</span>
              </h2>
              <p className="font-sans text-xs text-white/60 mt-1">
                Logged in as <span className="text-white font-medium">{user?.name}</span> ({user?.email})
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchAllAdminData}
                className="p-3 border border-white/10 text-white/70 hover:border-gold hover:text-gold transition-colors cursor-pointer rounded-none"
                title="Refresh database records"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-3 border border-red-500/20 text-red-400 hover:bg-red-500/10 font-sans text-[10px] uppercase tracking-widest transition-all rounded-none flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>

          {/* Quick tab controls */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 overflow-x-auto">
            {[
              { id: 'stats', label: 'Overview', icon: BarChart3 },
              { id: 'reservations', label: 'Reservations', icon: Calendar },
              { id: 'messages', label: 'Guest Messages', icon: MessageSquare },
              { id: 'menu', label: 'Digital Menu', icon: BookOpen },
              { id: 'newsletter', label: 'Subscribers', icon: MailOpen },
              { id: 'careers', label: 'Job Applications', icon: Briefcase },
              ...(user?.role === 'Admin' ? [{ id: 'managers', label: 'Manager Management', icon: UserCheck }] : [])
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3.5 text-xs font-sans uppercase tracking-wider flex items-center gap-2 cursor-pointer border transition-all rounded-none ${
                    activeTab === tab.id
                      ? 'bg-gold/10 border-gold text-gold font-bold'
                      : 'border-transparent text-white/60 hover:text-white hover:border-white/10'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content renderer */}
          <div className="pt-4">
            {isLoadingData && (
              <div className="text-center py-20 text-white/50 font-sans text-xs flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-gold" />
                <span>Loading latest security database state...</span>
              </div>
            )}

            {!isLoadingData && activeTab === 'stats' && (
              /* TAB: OVERVIEW */
              <div className="space-y-10">
                {/* Visual Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { title: 'PENDING RESERVATIONS', value: stats?.pendingReservations ?? 0, desc: 'Needs manual triage', icon: Calendar, color: 'text-gold' },
                    { title: 'UPCOMING CONFIRMED', value: stats?.upcomingReservationsCount ?? 0, desc: 'Seating secured', icon: CheckCircle, color: 'text-green-400' },
                    { title: 'UNREAD GUEST INQUIRIES', value: stats?.unreadMessages ?? 0, desc: 'Awaiting hospitality reply', icon: MessageSquare, color: 'text-blue-400' },
                    { title: 'ACTIVE SUBSCRIBERS', value: stats?.subscribersCount ?? 0, desc: 'Wine & shore briefing list', icon: MailOpen, color: 'text-purple-400' },
                    { title: 'JOB APPLICATIONS', value: stats?.recentApplicationsCount ?? 0, desc: 'Portfolio screening', icon: Briefcase, color: 'text-orange-400' }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-charcoal-light border border-white/10 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">{stat.title}</span>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-serif text-3xl font-light">{stat.value}</h4>
                          <p className="font-sans text-[9px] text-white/40 leading-relaxed">{stat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left subcolumn: Quick triage bookings */}
                  <div className="lg:col-span-7 bg-charcoal-light border border-white/10 p-8 space-y-6">
                    <h3 className="font-serif text-xl uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gold" /> Unchecked Reservations
                    </h3>
                    <div className="divide-y divide-white/10">
                      {reservations.filter(r => r.status === 'Pending').slice(0, 4).length === 0 ? (
                        <p className="text-white/40 font-sans text-xs py-6">All coastal dining suite bookings successfully triaged.</p>
                      ) : (
                        reservations.filter(r => r.status === 'Pending').slice(0, 4).map((res) => (
                          <div key={res.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div>
                              <p className="font-serif text-sm text-white font-medium">{res.name}</p>
                              <p className="font-sans text-[10px] text-gold uppercase tracking-wider mt-0.5">{res.guests} • {res.date} at {res.time} • {res.seating === 'indoor' ? 'Indoor' : 'Outdoor'}</p>
                              {res.specialRequests && <p className="font-sans text-[10px] text-white/50 italic mt-1 font-light">"{res.specialRequests}"</p>}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button 
                                onClick={() => handleUpdateResStatus(res.id, 'Confirmed')}
                                className="px-3 py-1.5 bg-green-500/20 text-green-400 font-sans text-[9px] uppercase tracking-widest hover:bg-green-500/30 transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button 
                                onClick={() => handleUpdateResStatus(res.id, 'Cancelled')}
                                className="px-3 py-1.5 bg-red-500/20 text-red-400 font-sans text-[9px] uppercase tracking-widest hover:bg-red-500/30 transition-colors cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right subcolumn: Unread mail notifications */}
                  <div className="lg:col-span-5 bg-charcoal-light border border-white/10 p-8 space-y-6">
                    <h3 className="font-serif text-xl uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gold" /> Latest Enquiries
                    </h3>
                    <div className="divide-y divide-white/10">
                      {messages.slice(0, 3).length === 0 ? (
                        <p className="text-white/40 font-sans text-xs py-6">Inboxes are currently pristine and empty.</p>
                      ) : (
                        messages.slice(0, 3).map((msg) => (
                          <div key={msg.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-sans">
                              <span className="font-medium text-white">{msg.name}</span>
                              <span className={`px-2 py-0.5 uppercase tracking-widest border font-bold ${
                                msg.status === 'Unread' 
                                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                                  : 'bg-green-500/10 border-green-500/20 text-green-400'
                              }`}>{msg.status}</span>
                            </div>
                            <h5 className="font-serif text-xs text-gold uppercase tracking-wider">{msg.subject}</h5>
                            <p className="font-sans text-[11px] text-white/60 line-clamp-2 leading-relaxed font-light">"{msg.message}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Gourmet Analytics & Motion Graphs */}
                <div className="pt-6 border-t border-white/10">
                  <GourmetAnalytics />
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'reservations' && (
              /* TAB: RESERVATIONS */
              <div className="space-y-6">
                {/* Controls and searching */}
                <div className="bg-charcoal-light border border-white/10 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <input 
                      type="text" 
                      placeholder="Search name, phone, or code..." 
                      value={resSearch}
                      onChange={(e) => setResSearch(e.target.value)}
                      className="bg-charcoal border border-white/10 px-4 py-2 text-xs font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-gold w-full md:w-64"
                    />
                    <select
                      value={resFilterStatus}
                      onChange={(e) => setResFilterStatus(e.target.value)}
                      className="bg-charcoal border border-white/10 px-4 py-2 text-xs font-sans text-white focus:outline-none focus:border-gold"
                    >
                      <option value="">All Reservation Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Seated">Seated</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="text-[10px] font-sans text-gold uppercase tracking-widest font-semibold">
                    Showing {reservations.length} total bookings
                  </div>
                </div>

                {/* Main reservations table */}
                <div className="bg-charcoal-light border border-white/10 overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[9px] text-gold uppercase tracking-widest font-bold">
                        <th className="p-4">CODE</th>
                        <th className="p-4">GUEST DETAILS</th>
                        <th className="p-4">DATE &amp; TIME</th>
                        <th className="p-4">SEATING / OCCASION</th>
                        <th className="p-4 text-center">STATUS</th>
                        <th className="p-4 text-right">CONTROLS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center p-10 text-white/40">No reservation records found for this query.</td>
                        </tr>
                      ) : (
                        reservations.map((res) => (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-serif text-gold font-bold">{res.id}</td>
                            <td className="p-4 space-y-1">
                              <p className="font-medium text-white">{res.name}</p>
                              <p className="text-[10px] text-white/50">{res.email} • {res.phone}</p>
                              {res.specialRequests && (
                                <p className="text-[10px] text-gold/80 italic mt-1 max-w-xs line-clamp-1">"{res.specialRequests}"</p>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-medium">{res.date}</p>
                              <p className="text-[10px] text-white/50">{res.time}</p>
                            </td>
                            <td className="p-4">
                              <p className="capitalize text-white">{res.seating === 'indoor' ? 'Velvet Indoor' : 'Outdoor Breeze'}</p>
                              <p className="text-[10px] text-white/50 uppercase tracking-widest">{res.occasion}</p>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-1 text-[9px] uppercase tracking-wider border font-bold ${
                                res.status === 'Confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                res.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                res.status === 'Seated' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                res.status === 'Completed' ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
                                'bg-gold/10 border-gold/25 text-gold'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              <select
                                value={res.status}
                                onChange={(e) => handleUpdateResStatus(res.id, e.target.value)}
                                className="bg-charcoal border border-white/15 px-2 py-1 text-[10px] font-sans text-white focus:outline-none focus:border-gold mr-2"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Seated">Seated</option>
                                <option value="Completed">Completed</option>
                              </select>
                              {['Admin', 'Manager'].includes(user?.role) && (
                                <button 
                                  onClick={() => handleDeleteRes(res.id)}
                                  className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer inline-flex items-center"
                                  title="Remove reservation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'messages' && (
              /* TAB: MESSAGES */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Message List */}
                <div className="lg:col-span-7 bg-charcoal-light border border-white/10 p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <h3 className="font-serif text-xl uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
                    <MessageSquare className="w-5 h-5 text-gold" /> Guest Letters
                  </h3>

                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center py-10 text-white/40 font-sans text-xs">No direct guest letters have been logged yet.</p>
                    ) : (
                      messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          onClick={() => {
                            setReplyMessageId(msg.id);
                            setReplyText(msg.replyText || '');
                          }}
                          className={`p-5 border cursor-pointer transition-all ${
                            replyMessageId === msg.id 
                              ? 'border-gold bg-gold/5' 
                              : 'border-white/10 hover:border-white/20 bg-charcoal'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-serif text-sm text-white">{msg.name}</h4>
                              <p className="font-sans text-[10px] text-white/50">{msg.email} • {msg.phone || 'No phone'}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[8px] uppercase tracking-widest border font-bold ${
                              msg.status === 'Unread' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                              msg.status === 'Replied' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              'bg-gray-500/10 border-gray-500/20 text-white/60'
                            }`}>{msg.status}</span>
                          </div>

                          <div className="mt-3">
                            <h5 className="font-serif text-[11px] text-gold uppercase tracking-wider">{msg.subject}</h5>
                            <p className="font-sans text-xs text-white/70 mt-1 leading-relaxed font-light">"{msg.message}"</p>
                          </div>

                          {msg.replyText && (
                            <div className="mt-3 pt-3 border-t border-gold/10 bg-gold/5 p-3">
                              <p className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold flex items-center gap-1">
                                <UserCheck className="w-3 h-3" /> OFFICIAL RESPONSE SENT:
                              </p>
                              <p className="font-sans text-xs text-white/80 mt-1 italic font-light">"{msg.replyText}"</p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Side: Reply Panel */}
                <div className="lg:col-span-5 bg-charcoal-light border border-white/10 p-8">
                  {replyMessageId ? (
                    (() => {
                      const msg = messages.find(m => m.id === replyMessageId);
                      if (!msg) return null;
                      return (
                        <div className="space-y-6">
                          <div className="pb-3 border-b border-white/10">
                            <span className="font-sans text-[8px] text-gold uppercase tracking-widest block font-bold">REPLY CONSOLE</span>
                            <h3 className="font-serif text-lg text-white mt-1">Replying to {msg.name}</h3>
                          </div>

                          <div className="bg-charcoal p-4 border border-white/15">
                            <p className="font-sans text-[10px] text-white/40 uppercase tracking-wider">GUEST LETTER:</p>
                            <p className="font-sans text-xs text-white/85 mt-1 leading-relaxed italic font-light">"{msg.message}"</p>
                          </div>

                          <form onSubmit={handleSubmitMessageReply} className="space-y-4">
                            <div className="space-y-2">
                              <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">YOUR RESPONSE EMAIL BODY</label>
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Dear Guest, we thank you for reaching out..."
                                rows={6}
                                className="w-full bg-charcoal border border-white/15 p-3 text-xs font-sans text-white placeholder:text-white/20 focus:outline-none focus:border-gold rounded-none resize-none"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmittingReply}
                              className="w-full py-3.5 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold hover:bg-white transition-all cursor-pointer rounded-none disabled:opacity-50"
                            >
                              {isSubmittingReply ? 'Dispatching...' : 'Dispatch Reply (Simulated)'}
                            </button>
                          </form>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-20 text-white/30 space-y-3 font-sans">
                      <MessageSquare className="w-8 h-8 mx-auto text-white/15" />
                      <p className="text-xs">Select a guest inquiry letter from the left board to open the official replies terminal.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'menu' && (
              /* TAB: MENU CATALOG */
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-charcoal-light border border-white/10 p-6">
                  <div>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-white">Digital Culinary Catalog</h3>
                    <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-0.5">{menuItems.length} active dishes and vintages</p>
                  </div>
                  {['Admin', 'Manager'].includes(user?.role) && (
                    <button 
                      onClick={() => {
                        setEditingMenuItem(null);
                        setMenuFormData({
                          name: '',
                          category: 'starters',
                          price: '',
                          description: '',
                          recommended: false,
                          bestSeller: false,
                          seasonal: false,
                          spicyLevel: 0
                        });
                        setShowMenuForm(!showMenuForm);
                      }}
                      className="px-5 py-3 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all rounded-none flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Dish
                    </button>
                  )}
                </div>

                {showMenuForm && (
                  /* Interactive Add/Edit menu item form */
                  <div className="bg-charcoal-light border border-gold/30 p-8 relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold" />
                    <h4 className="font-serif text-base uppercase tracking-wider text-gold mb-6">
                      {editingMenuItem ? 'Modify Digital Dish' : 'Publish New Dish Spec'}
                    </h4>

                    <form onSubmit={handleMenuSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">DISH NAME</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Eg: Claypot Seafood Curry"
                            value={menuFormData.name}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">CATEGORY SECTION</label>
                          <select
                            value={menuFormData.category}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans capitalize"
                          >
                            <option value="starters">Starters</option>
                            <option value="seafood">Seafood Signatures</option>
                            <option value="goan">Goan Specialties</option>
                            <option value="portuguese">Portuguese Classics</option>
                            <option value="desserts">Desserts</option>
                            <option value="cellar">Cellar &amp; Spirits</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">PRICE (INR ₹)</label>
                          <input 
                            type="number" 
                            required
                            placeholder="Eg: 1250"
                            value={menuFormData.price}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, price: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">RECIPE / PRESENTATION DESCRIPTION</label>
                        <textarea 
                          rows={2}
                          placeholder="Provide the taste, terroir context, or serving method of this fine dish..."
                          value={menuFormData.description}
                          onChange={(e) => setMenuFormData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-charcoal border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-gold font-sans resize-none rounded-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold block">SPICY HEAT LEVEL</label>
                          <select
                            value={menuFormData.spicyLevel}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, spicyLevel: Number(e.target.value) }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          >
                            <option value={0}>0 - No Spice</option>
                            <option value={1}>1 - Mild</option>
                            <option value={2}>2 - Medium Hot</option>
                            <option value={3}>3 - Fiery Red</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox" 
                            id="recommended"
                            checked={menuFormData.recommended}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, recommended: e.target.checked }))}
                            className="w-4 h-4 accent-gold"
                          />
                          <label htmlFor="recommended" className="font-sans text-[10px] text-white/80 uppercase tracking-widest cursor-pointer select-none">CHEF RECOMMENDED</label>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox" 
                            id="bestSeller"
                            checked={menuFormData.bestSeller}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, bestSeller: e.target.checked }))}
                            className="w-4 h-4 accent-gold"
                          />
                          <label htmlFor="bestSeller" className="font-sans text-[10px] text-white/80 uppercase tracking-widest cursor-pointer select-none">BEST SELLER</label>
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input 
                            type="checkbox" 
                            id="seasonal"
                            checked={menuFormData.seasonal}
                            onChange={(e) => setMenuFormData(prev => ({ ...prev, seasonal: e.target.checked }))}
                            className="w-4 h-4 accent-gold"
                          />
                          <label htmlFor="seasonal" className="font-sans text-[10px] text-white/80 uppercase tracking-widest cursor-pointer select-none">SEASONAL SPECIAL</label>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button 
                          type="button"
                          onClick={() => {
                            setShowMenuForm(false);
                            setEditingMenuItem(null);
                          }}
                          className="px-6 py-2.5 border border-white/15 text-white/70 hover:bg-white/5 font-sans text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-2.5 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all rounded-none cursor-pointer"
                        >
                          {editingMenuItem ? 'Save Changes' : 'Publish Dish'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Categories listings block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['starters', 'seafood', 'goan', 'portuguese', 'desserts', 'cellar'].map((cat) => {
                    const items = menuItems.filter(m => m.category === cat);
                    return (
                      <div key={cat} className="bg-charcoal-light border border-white/10 p-6 space-y-4">
                        <h4 className="font-serif text-sm uppercase tracking-widest text-gold border-b border-white/10 pb-2 capitalize">
                          {cat === 'portuguese' ? 'Portuguese Classics' : 
                           cat === 'goan' ? 'Goan Specialties' :
                           cat === 'cellar' ? 'Cellar & Wine Reserve' : cat} ({items.length})
                        </h4>

                        <div className="divide-y divide-white/5 max-h-64 overflow-y-auto pr-2">
                          {items.length === 0 ? (
                            <p className="py-4 text-white/30 text-xs font-sans italic">No active dishes cataloged in this sector.</p>
                          ) : (
                            items.map(item => (
                              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-serif text-xs text-white font-medium">{item.name}</span>
                                    {item.recommended && <span className="bg-gold/15 text-gold text-[7px] px-1 font-bold border border-gold/30">CHEF</span>}
                                    {item.bestSeller && <span className="bg-green-500/10 text-green-400 text-[7px] px-1 font-bold border border-green-500/20">BEST</span>}
                                  </div>
                                  <p className="font-sans text-[10px] text-white/50 leading-relaxed line-clamp-1">{item.description}</p>
                                </div>

                                <div className="flex items-center gap-4 shrink-0 font-sans text-xs">
                                  <span className="font-serif text-white font-semibold">₹{item.price}</span>
                                  {['Admin', 'Manager'].includes(user?.role) && (
                                    <div className="flex gap-1.5">
                                      <button 
                                        onClick={() => handleStartEditMenu(item)}
                                        className="p-1 hover:text-gold transition-colors text-white/50 cursor-pointer"
                                        title="Edit dish specs"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteMenuItem(item.id)}
                                        className="p-1 hover:text-red-400 transition-colors text-white/50 cursor-pointer"
                                        title="Delete from catalog"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'newsletter' && (
              /* TAB: NEWSLETTER SUBSCRIBERS */
              <div className="bg-charcoal-light border border-white/10 p-8 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-white">Wine &amp; Shore Briefing Ledger</h3>
                    <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-0.5">{subscribers.length} registered luxury contacts</p>
                  </div>
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + ["ID,Email,SubscribedAt"].concat(subscribers.map(s => `${s.id},${s.email},${s.subscribedAt}`)).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "colaco_hut_subscribers.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-5 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold transition-all rounded-none cursor-pointer"
                  >
                    Export Subscribers CSV
                  </button>
                </div>

                <div className="divide-y divide-white/5">
                  {subscribers.length === 0 ? (
                    <p className="text-center py-10 text-white/40 font-sans text-xs">No active newsletter registrations recorded yet.</p>
                  ) : (
                    subscribers.map((sub, index) => (
                      <div key={sub.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center font-sans text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-white/20 text-[10px] font-mono">#{index + 1}</span>
                          <div>
                            <p className="text-white font-medium">{sub.email}</p>
                            <p className="text-[10px] text-white/40">Subscribed on {new Date(sub.subscribedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Active Recipient</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'careers' && (
              /* TAB: JOB APPLICATIONS */
              <div className="bg-charcoal-light border border-white/10 p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-lg uppercase tracking-wider text-white">Culinary &amp; Service Candidates Ledger</h3>
                  <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-0.5">{applications.length} active applications waiting for review</p>
                </div>

                <div className="divide-y divide-white/10">
                  {applications.length === 0 ? (
                    <p className="text-center py-10 text-white/40 font-sans text-xs">No job application resumes have been submitted yet.</p>
                  ) : (
                    applications.map((app) => (
                      <div key={app.id} className="py-5 first:pt-0 last:pb-0 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-serif text-base text-white">{app.name}</h4>
                            <p className="font-sans text-xs text-gold uppercase tracking-widest mt-0.5">Applied for: {app.jobTitle}</p>
                            <p className="font-sans text-[10px] text-white/50">{app.email} • {app.phone}</p>
                          </div>
                          <span className="px-2.5 py-0.5 text-[8px] uppercase tracking-widest border border-gold/30 bg-gold/10 text-gold font-bold">
                            {app.status}
                          </span>
                        </div>

                        <div className="bg-charcoal p-4 border border-white/5 text-xs font-sans space-y-3">
                          <div>
                            <span className="block text-[8px] text-white/40 uppercase tracking-widest font-bold">EXPERIENCE OVERVIEW:</span>
                            <p className="text-white/80 mt-1 leading-relaxed font-light">{app.experience}</p>
                          </div>
                          {app.coverLetter && (
                            <div>
                              <span className="block text-[8px] text-white/40 uppercase tracking-widest font-bold">COVER LETTER:</span>
                              <p className="text-white/60 mt-1 leading-relaxed italic font-light">"{app.coverLetter}"</p>
                            </div>
                          )}
                          {app.resumeUrl && (
                            <div>
                              <span className="block text-[8px] text-white/40 uppercase tracking-widest font-bold">DIGITAL PORTFOLIO / RESUME LINK:</span>
                              <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline mt-1 block leading-relaxed break-all font-light">{app.resumeUrl}</a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {!isLoadingData && activeTab === 'managers' && user?.role === 'Admin' && (
              /* TAB: MANAGER MANAGEMENT */
              <div className="space-y-8">
                {/* Manager Statistical Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">TOTAL REGISTRY</span>
                      <User className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light">{managerStats?.total ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Staff accounts</p>
                    </div>
                  </div>

                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">ACTIVE</span>
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light text-green-400">{managerStats?.active ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Privileges live</p>
                    </div>
                  </div>

                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">ON HOLD</span>
                      <XCircle className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light text-orange-400">{managerStats?.inactive ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Deactivated</p>
                    </div>
                  </div>

                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">SUSPENDED</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light text-red-400">{managerStats?.suspended ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Access revoked</p>
                    </div>
                  </div>

                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">ONLINE NOW</span>
                      <div className="relative flex h-2 w-2 mt-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light text-green-300">{managerStats?.online ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Console sessions</p>
                    </div>
                  </div>

                  <div className="bg-charcoal-light border border-white/10 p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans text-[8px] text-white/50 uppercase tracking-widest">LOGS TODAY</span>
                      <Clock className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-serif text-2xl font-light text-gold">{managerStats?.loggedInToday ?? 0}</h4>
                      <p className="font-sans text-[8px] text-white/40 leading-relaxed">Shift checkins</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard Interactive Graphs & Analytics Block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Monthly Console Logins (Line Chart / Bar Chart representation in elegant inline SVG) */}
                  <div className="lg:col-span-4 bg-charcoal-light border border-white/10 p-6 space-y-4 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/30" />
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="font-serif text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Shift Login Volume
                      </h4>
                      <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">MONTHLY</span>
                    </div>
                    <div className="h-44 flex flex-col justify-between">
                      {/* Beautiful responsive inline SVG bar/line chart */}
                      <div className="relative h-32 w-full flex items-end justify-between px-2 pt-4">
                        {/* Grid lines */}
                        <div className="absolute inset-x-0 top-1/4 border-b border-white/5 pointer-events-none" />
                        <div className="absolute inset-x-0 top-2/4 border-b border-white/5 pointer-events-none" />
                        <div className="absolute inset-x-0 top-3/4 border-b border-white/5 pointer-events-none" />

                        {/* Live simulated / real statistical data bars for months */}
                        {[
                          { m: 'Jan', val: 12, pct: '30%' },
                          { m: 'Feb', val: 18, pct: '45%' },
                          { m: 'Mar', val: 26, pct: '65%' },
                          { m: 'Apr', val: 32, pct: '80%' },
                          { m: 'May', val: 28, pct: '70%' },
                          { m: 'Jun', val: 42, pct: '100%' }
                        ].map((bar, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 group relative z-10 w-8">
                            {/* Tooltip on hover */}
                            <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-gold text-charcoal font-sans font-bold text-[8px] px-1.5 py-0.5 rounded shadow-lg transition-all duration-200 pointer-events-none whitespace-nowrap">
                              {bar.val} Shift Logins
                            </div>
                            <div className="w-2.5 bg-gradient-to-t from-gold/40 to-gold rounded-t-sm transition-all duration-500 hover:bg-white" style={{ height: bar.pct }} />
                            <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest mt-1 font-semibold">{bar.m}</span>
                          </div>
                        ))}
                      </div>
                      <p className="font-sans text-[9px] text-white/40 text-center italic leading-relaxed">Manager shift sessions logged by month</p>
                    </div>
                  </div>

                  {/* Sector Distribution of Staff (Department-wise bar-progress charts) */}
                  <div className="lg:col-span-4 bg-charcoal-light border border-white/10 p-6 space-y-4 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/30" />
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="font-serif text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Sector Allocations
                      </h4>
                      <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">SECTORS</span>
                    </div>
                    <div className="h-44 flex flex-col justify-center space-y-3">
                      {(() => {
                        // Gather real sector distribution from managersData
                        const deptCounts: Record<string, number> = {
                          'Management': 0,
                          'Culinary': 0,
                          'Service': 0,
                          'Beverage': 0,
                          'Guest Relations': 0
                        };
                        
                        // Count depts based on managersData
                        if (managersData && managersData.items) {
                          managersData.items.forEach((m: any) => {
                            const dept = m.department || 'Management';
                            if (deptCounts[dept] !== undefined) {
                              deptCounts[dept]++;
                            } else {
                              deptCounts[dept] = 1;
                            }
                          });
                        }
                        
                        const maxCount = Math.max(...Object.values(deptCounts), 1);

                        return Object.entries(deptCounts).map(([dept, count]) => {
                          const pct = `${Math.round((count / maxCount) * 100)}%`;
                          return (
                            <div key={dept} className="space-y-1">
                              <div className="flex justify-between text-[9px] font-sans">
                                <span className="text-white/75 font-medium">{dept === 'Guest Relations' ? 'VIP Guest Relations' : dept}</span>
                                <span className="text-gold font-bold font-mono">{count} Staff</span>
                              </div>
                              <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden border border-white/5">
                                <div className="bg-gold h-full transition-all duration-500" style={{ width: count > 0 ? pct : '0%' }} />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Recently Added Managers Side Ledger list */}
                  <div className="lg:col-span-4 bg-charcoal-light border border-white/10 p-6 space-y-4 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/30" />
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <h4 className="font-serif text-xs uppercase tracking-wider text-gold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Registry Ledger Additions
                      </h4>
                      <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest">LATEST</span>
                    </div>
                    <div className="h-44 overflow-y-auto pr-1 divide-y divide-white/5 flex flex-col justify-start">
                      {(managerStats?.recentlyAdded?.length ?? 0) === 0 ? (
                        <p className="text-center py-12 text-white/30 text-xs italic">No recently joined managers cataloged.</p>
                      ) : (
                        managerStats.recentlyAdded.slice(0, 3).map((m: any) => (
                          <div key={m.id} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              {m.profileImage ? (
                                <img 
                                  src={m.profileImage} 
                                  alt={m.name} 
                                  className="w-7 h-7 object-cover border border-gold/20"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-7 h-7 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold font-serif text-[10px]">
                                  {m.name.substring(0, 1)}
                                </div>
                              )}
                              <div>
                                <p className="font-sans text-[11px] text-white font-medium line-clamp-1">{m.name}</p>
                                <p className="font-mono text-[9px] text-white/40">{m.department || 'Management'}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewProfile(m)}
                              className="px-2 py-1 border border-gold/20 hover:border-gold hover:bg-gold hover:text-charcoal text-[8px] font-sans uppercase tracking-widest font-bold transition-all cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-white/5 pt-4">
                  <div>
                    <h3 className="font-serif text-lg uppercase tracking-wider text-white">Staff Management Ledger</h3>
                    <p className="font-sans text-[10px] text-gold uppercase tracking-widest mt-0.5">Control manager roles, credentials, and track console activity</p>
                  </div>
                  {!showManagerForm && (
                    <button
                      onClick={handleStartAddManager}
                      className="px-5 py-3 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all rounded-none flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add New Manager
                    </button>
                  )}
                </div>

                {/* Inline Manager Form */}
                {showManagerForm && (
                  <div className="bg-charcoal-light border border-gold/30 p-8 relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold" />
                    <h4 className="font-serif text-base uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      {editingManager ? 'Modify Manager Credentials' : 'Register New Manager Account'}
                    </h4>

                    <form onSubmit={handleManagerSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">FULL NAME</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Eg: Clara Mendes"
                            value={managerFormData.name}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">EMAIL ADDRESS</label>
                          <input 
                            type="email" 
                            required
                            placeholder="clara@colacohut.com"
                            value={managerFormData.email}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">PHONE NUMBER (OPTIONAL)</label>
                          <input 
                            type="text" 
                            placeholder="+91 9876543210"
                            value={managerFormData.phone}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">USERNAME / ALIAS (OPTIONAL)</label>
                          <input 
                            type="text" 
                            placeholder="claramendes"
                            value={managerFormData.username}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">DEPARTMENT SECTOR</label>
                          <select
                            value={managerFormData.department}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          >
                            <option value="Management">Management Sector</option>
                            <option value="Culinary">Culinary &amp; Kitchen</option>
                            <option value="Service">Sommelier &amp; Service</option>
                            <option value="Beverage">Mixology &amp; Lounge</option>
                            <option value="Guest Relations">VIP Guest Relations</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">ACCOUNT STATUS</label>
                          <select
                            value={managerFormData.status}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          >
                            <option value="Active">Active / Privileges Granted</option>
                            <option value="Inactive">Inactive / Suspended Shift</option>
                            <option value="Suspended">Suspended / Ban Access</option>
                          </select>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold block mb-2">CHOOSE PRE-SET PORTRAIT AVATAR OR ENTER PORTRAIT IMAGE URL</label>
                          <div className="flex flex-wrap gap-4 items-center mb-3 bg-charcoal p-3 border border-white/5">
                            {[
                              { label: 'Sommelier', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
                              { label: 'Executive Chef', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
                              { label: 'Guest Relations', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
                              { label: 'Mixologist', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setManagerFormData(prev => ({ ...prev, profileImage: preset.url }))}
                                className={`flex items-center gap-2 p-1.5 border transition-all hover:bg-gold/5 ${
                                  managerFormData.profileImage === preset.url ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/60'
                                }`}
                              >
                                <img src={preset.url} alt={preset.label} className="w-6 h-6 object-cover rounded-full" referrerPolicy="no-referrer" />
                                <span className="text-[9px] font-sans uppercase tracking-widest">{preset.label}</span>
                              </button>
                            ))}
                            {managerFormData.profileImage && (
                              <button
                                type="button"
                                onClick={() => setManagerFormData(prev => ({ ...prev, profileImage: '' }))}
                                className="px-2 py-1 text-[8px] uppercase tracking-widest border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-none transition-colors ml-auto"
                              >
                                Clear Photo
                              </button>
                            )}
                          </div>
                          <input 
                            type="text" 
                            placeholder="Or paste custom premium photo URL here..."
                            value={managerFormData.profileImage}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, profileImage: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                          />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                          <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">ADMIN NOTES / ACCOUNT SPECIFICS</label>
                          <textarea 
                            rows={3}
                            placeholder="Specify background details, roster constraints, high-security clearance notes, or comments about this manager account..."
                            value={managerFormData.notes}
                            onChange={(e) => setManagerFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-charcoal border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-gold font-sans resize-none rounded-none"
                          />
                        </div>

                        {!editingManager && (
                          <>
                            <div className="space-y-2">
                              <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">PASSWORD</label>
                              <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                value={managerFormData.password}
                                onChange={(e) => setManagerFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">CONFIRM PASSWORD</label>
                              <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                value={managerFormData.confirmPassword}
                                onChange={(e) => setManagerFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {managerFormError && (
                        <p className="text-red-400 text-xs font-sans font-light">{managerFormError}</p>
                      )}

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button 
                          type="button"
                          onClick={() => {
                            setShowManagerForm(false);
                            setEditingManager(null);
                          }}
                          className="px-6 py-2.5 border border-white/15 text-white/70 hover:bg-white/5 font-sans text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="px-8 py-2.5 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all rounded-none cursor-pointer"
                        >
                          {editingManager ? 'Save Changes' : 'Activate Credentials'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search, Filter, Sort Controls */}
                <div className="bg-charcoal-light border border-white/5 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="w-full md:w-1/3 relative">
                    <input
                      type="text"
                      placeholder="Search name, email, department..."
                      value={managerSearch}
                      onChange={(e) => {
                        setManagerSearch(e.target.value);
                        setManagerPage(1);
                      }}
                      className="w-full bg-charcoal border border-white/10 px-4 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans pr-10"
                    />
                  </div>

                  {/* Filter & Sort dropdowns */}
                  <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[9px] text-white/40 uppercase tracking-wider font-bold">STATUS</span>
                      <select
                        value={managerStatusFilter}
                        onChange={(e) => {
                          setManagerStatusFilter(e.target.value);
                          setManagerPage(1);
                        }}
                        className="bg-charcoal border border-white/10 px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-gold font-sans"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive Only</option>
                        <option value="Suspended">Suspended Only</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[9px] text-white/40 uppercase tracking-wider font-bold">SORT BY</span>
                      <select
                        value={`${managerSortBy}-${managerSortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setManagerSortBy(field);
                          setManagerSortOrder(order as any);
                          setManagerPage(1);
                        }}
                        className="bg-charcoal border border-white/10 px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-gold font-sans"
                      >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="createdAt-desc">Recently Joined</option>
                        <option value="createdAt-asc">Oldest Account</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Managers Ledger Table */}
                <div className="bg-charcoal-light border border-white/10 overflow-hidden relative">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">Manager Profile</th>
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">Sector / Sector</th>
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">Contact / Account details</th>
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">Last Session</th>
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">Status Status</th>
                          <th className="p-4 font-sans text-[9px] text-gold uppercase tracking-widest font-semibold text-right">Console Management</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-sans text-xs">
                        {managersData.items.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-white/40 italic">
                              No managers match the search filters or are registered in the luxury system.
                            </td>
                          </tr>
                        ) : (
                          managersData.items.map((mgr: any) => (
                            <tr key={mgr.id} className="hover:bg-white/[0.01] transition-all group">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  {mgr.profileImage ? (
                                    <img 
                                      src={mgr.profileImage} 
                                      alt={mgr.name} 
                                      className="w-10 h-10 object-cover border border-gold/20 shadow-lg"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold font-serif text-sm shadow-md">
                                      {mgr.name.substring(0, 1)}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-white font-medium group-hover:text-gold transition-colors">{mgr.name}</p>
                                    <p className="text-[9px] text-white/40 font-mono mt-0.5">UID: {mgr.id.substring(0, 8)}...</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-0.5 text-[8px] bg-gold/5 border border-gold/20 text-gold uppercase tracking-wider font-semibold">
                                  {mgr.department || 'Management'}
                                </span>
                              </td>
                              <td className="p-4 space-y-0.5 max-w-xs">
                                <p className="text-white/80 font-medium truncate">{mgr.email}</p>
                                {mgr.phone && <p className="text-[10px] text-white/40">{mgr.phone}</p>}
                                {mgr.username && <p className="text-[10px] text-gold/60 font-mono">@{mgr.username}</p>}
                                {mgr.notes && <p className="text-[9px] text-white/30 italic truncate mt-1">"{mgr.notes}"</p>}
                              </td>
                              <td className="p-4">
                                <p className="text-white/70">
                                  {mgr.lastLogin ? new Date(mgr.lastLogin).toLocaleDateString() : 'Never'}
                                </p>
                                <p className="text-[10px] text-white/40 mt-0.5 font-mono">
                                  {mgr.lastLogin ? new Date(mgr.lastLogin).toLocaleTimeString() : ''}
                                  {mgr.loginCount !== undefined ? ` (${mgr.loginCount} logins)` : ''}
                                </p>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col gap-1.5">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold border max-w-max ${
                                    mgr.status === 'Active' 
                                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                      : mgr.status === 'Suspended'
                                      ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                      : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full ${mgr.status === 'Active' ? 'bg-green-400' : mgr.status === 'Suspended' ? 'bg-red-500' : 'bg-orange-400'}`} />
                                    {mgr.status || 'Active'}
                                  </span>

                                  {/* Quick Toggle Select Dropdown */}
                                  <select
                                    value={mgr.status || 'Active'}
                                    onChange={(e) => handleUpdateManagerStatus(mgr.id, e.target.value)}
                                    className="bg-charcoal border border-white/10 px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-sans text-white/60 focus:outline-none focus:border-gold max-w-max cursor-pointer"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                  </select>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleViewProfile(mgr)}
                                    className="p-1.5 border border-white/10 hover:border-gold hover:text-gold text-white/50 transition-colors cursor-pointer"
                                    title="View Detailed Profile & Logs"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setResettingPasswordManagerId(mgr.id);
                                      setResetPasswordValue('');
                                      setResetPasswordConfirm('');
                                      setShowResetPasswordModal(true);
                                    }}
                                    className="p-1.5 border border-white/10 hover:border-gold hover:text-gold text-white/50 transition-colors cursor-pointer"
                                    title="Reset Credentials Password"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleStartEditManager(mgr)}
                                    className="p-1.5 border border-white/10 hover:border-gold hover:text-gold text-white/50 transition-colors cursor-pointer"
                                    title="Edit Profile specifications"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteManager(mgr.id)}
                                    className="p-1.5 border border-white/10 hover:border-red-400 hover:text-red-400 text-white/50 transition-colors cursor-pointer"
                                    title="Revoke and Permanent Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination control footer */}
                  {managersData.totalPages > 1 && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
                      <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
                        Showing Page {managersData.page} of {managersData.totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setManagerPage(prev => Math.max(prev - 1, 1))}
                          disabled={managersData.page === 1}
                          className="px-4 py-2 border border-white/10 text-xs text-white hover:border-gold hover:text-gold cursor-pointer disabled:opacity-30 disabled:hover:text-white disabled:hover:border-white/10 rounded-none transition-all"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setManagerPage(prev => Math.min(prev + 1, managersData.totalPages))}
                          disabled={managersData.page === managersData.totalPages}
                          className="px-4 py-2 border border-white/10 text-xs text-white hover:border-gold hover:text-gold cursor-pointer disabled:opacity-30 disabled:hover:text-white disabled:hover:border-white/10 rounded-none transition-all"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* DETAILED MANAGER PROFILE DRAWER SIDE PANEL */}
                <AnimatePresence>
                  {selectedProfileManager && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                      {/* Backdrop */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProfileManager(null)}
                        className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
                      />

                      {/* Drawer Panel */}
                      <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-xl bg-charcoal-light border-l border-gold/30 h-full shadow-2xl flex flex-col z-10"
                      >
                        {/* Golden corner designs */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold pointer-events-none" />

                        {/* Drawer Header */}
                        <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-start">
                          <div className="flex gap-4 items-center">
                            {selectedProfileManager.profileImage ? (
                              <img 
                                src={selectedProfileManager.profileImage} 
                                alt={selectedProfileManager.name} 
                                className="w-16 h-16 object-cover border border-gold/40 shadow-xl"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold font-serif text-2xl shadow-xl">
                                {selectedProfileManager.name.substring(0, 1)}
                              </div>
                            )}
                            <div>
                              <h3 className="font-serif text-xl uppercase tracking-wider text-white">{selectedProfileManager.name}</h3>
                              <p className="font-sans text-[10px] text-gold uppercase tracking-[0.15em] font-semibold mt-1">
                                {selectedProfileManager.department || 'Management'} sector manager
                              </p>
                              {selectedProfileManager.username && (
                                <p className="font-mono text-xs text-white/45 mt-0.5">@{selectedProfileManager.username}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => setSelectedProfileManager(null)}
                              className="p-1 text-white/50 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer border border-white/10 px-2.5 py-1"
                            >
                              ✕ Close
                            </button>
                            <span className={`px-2.5 py-1 text-[8px] uppercase tracking-widest font-bold border ${
                              selectedProfileManager.status === 'Active' 
                                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                : selectedProfileManager.status === 'Suspended'
                                ? 'bg-red-500/10 border-red-500/20 text-red-500'
                                : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                            }`}>
                              {selectedProfileManager.status || 'Active'}
                            </span>
                          </div>
                        </div>

                        {/* Navigation Sub-Tabs inside Drawer */}
                        <div className="flex border-b border-white/10 bg-charcoal px-4">
                          {[
                            { id: 'info', label: 'Personal Specs', icon: FileText },
                            { id: 'activity', label: 'Console Activity Logs', icon: Activity },
                            { id: 'logins', label: 'Login Chronology', icon: Clock }
                          ].map((subTab) => {
                            const TabIcon = subTab.icon;
                            return (
                              <button
                                key={subTab.id}
                                onClick={() => setActiveProfileSubTab(subTab.id as any)}
                                className={`px-4 py-3 text-[9px] uppercase tracking-widest font-sans flex items-center gap-1.5 border-b-2 cursor-pointer transition-all ${
                                  activeProfileSubTab === subTab.id
                                    ? 'border-gold text-gold font-bold bg-gold/[0.02]'
                                    : 'border-transparent text-white/50 hover:text-white'
                                }`}
                              >
                                <TabIcon className="w-3.5 h-3.5" />
                                {subTab.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Drawer Body Scroll Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                          {activeProfileSubTab === 'info' && (
                            <div className="space-y-6">
                              {/* Grid profile information details */}
                              <div className="bg-charcoal p-6 border border-white/5 space-y-4">
                                <h4 className="font-serif text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">Technical Profile Specs</h4>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-sans">
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">EMAIL ADDRESS</span>
                                    <p className="text-white/90 font-medium font-mono">{selectedProfileManager.email}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">CONTACT PHONE</span>
                                    <p className="text-white/90 font-medium">{selectedProfileManager.phone || 'No phone cataloged'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">ASSIGNED SECTOR</span>
                                    <p className="text-white/90 font-medium">{selectedProfileManager.department || 'Management'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">REGISTRATION DATE</span>
                                    <p className="text-white/90 font-medium">
                                      {selectedProfileManager.createdAt ? new Date(selectedProfileManager.createdAt).toLocaleDateString() : 'Baseline Accounts'}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">TOTAL ACCESS COUNT</span>
                                    <p className="text-white/90 font-semibold font-mono">{selectedProfileManager.loginCount ?? 0} active sessions</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-white/40 uppercase tracking-wider block">ROLE STATUS</span>
                                    <p className="text-gold font-bold">STAFF CONSOLE MANAGER</p>
                                  </div>
                                </div>
                              </div>

                              {/* Admin Notes Box */}
                              <div className="bg-charcoal p-6 border border-white/5 space-y-3">
                                <h4 className="font-serif text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">Administrative Briefing Notes</h4>
                                <p className="font-sans text-xs text-white/75 leading-relaxed font-light italic">
                                  {selectedProfileManager.notes ? `"${selectedProfileManager.notes}"` : 'No custom administrative briefing notes recorded for this manager account.'}
                                </p>
                              </div>

                              {/* Managed Actions overview mockup */}
                              <div className="bg-charcoal p-6 border border-white/5 space-y-3">
                                <h4 className="font-serif text-xs uppercase tracking-widest text-gold border-b border-white/5 pb-2">Managed Hospitality Operations</h4>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="p-3 border border-white/5 bg-white/[0.01]">
                                    <p className="text-serif text-2xl font-light text-white">Live</p>
                                    <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Reservation Audits</p>
                                  </div>
                                  <div className="p-3 border border-white/5 bg-white/[0.01]">
                                    <p className="text-serif text-2xl font-light text-white">Full</p>
                                    <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Culinary Cataloging</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeProfileSubTab === 'activity' && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <h4 className="font-serif text-xs uppercase tracking-widest text-gold">Recent Console Operations</h4>
                                <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest font-mono">Last 50 events</span>
                              </div>

                              {profileLogsLoading ? (
                                <div className="text-center py-12 text-white/40 flex flex-col items-center gap-2">
                                  <RefreshCw className="w-5 h-5 animate-spin text-gold" />
                                  <span className="text-xs font-sans">Retreiving operations ledger...</span>
                                </div>
                              ) : profileActivityLogs.length === 0 ? (
                                <p className="text-center py-12 text-white/30 text-xs italic font-sans">No security or operational actions logged for this account yet.</p>
                              ) : (
                                <div className="space-y-4">
                                  {profileActivityLogs.map((log) => (
                                    <div key={log.id} className="p-4 bg-charcoal border border-white/5 space-y-2 text-xs font-sans">
                                      <div className="flex justify-between items-start">
                                        <span className="px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold text-[9px] uppercase tracking-widest font-bold">
                                          {log.action}
                                        </span>
                                        <span className="text-[10px] text-white/40 font-mono">
                                          {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-white/80 font-light leading-relaxed">"{log.details}"</p>
                                      
                                      {/* Logs client metadata block */}
                                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-white/30 font-mono border-t border-white/5 pt-2 mt-1">
                                        <span>IP: {log.ipAddress || 'unknown'}</span>
                                        {log.browser && <span>Browser: {log.browser}</span>}
                                        {log.device && <span>Device: {log.device}</span>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {activeProfileSubTab === 'logins' && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <h4 className="font-serif text-xs uppercase tracking-widest text-gold">Shift Login Timeline</h4>
                                <span className="font-sans text-[8px] text-white/40 uppercase tracking-widest font-mono">Authentication timeline</span>
                              </div>

                              {profileLogsLoading ? (
                                <div className="text-center py-12 text-white/40 flex flex-col items-center gap-2">
                                  <RefreshCw className="w-5 h-5 animate-spin text-gold" />
                                  <span className="text-xs font-sans">Retreiving timeline...</span>
                                </div>
                              ) : profileLoginHistory.length === 0 ? (
                                <p className="text-center py-12 text-white/30 text-xs italic font-sans">No login records found in the authentication archives.</p>
                              ) : (
                                <div className="space-y-3">
                                  {profileLoginHistory.map((login) => (
                                    <div key={login.id} className="p-3 bg-charcoal border border-white/5 flex justify-between items-center text-xs font-sans">
                                      <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                                        <div>
                                          <p className="text-white/90 font-medium">Console Login Authorized</p>
                                          <p className="text-[10px] text-white/40 font-mono mt-0.5">
                                            IP: {login.ipAddress || '127.0.0.1'} • {login.browser || 'Unknown Browser'} ({login.device || 'Desktop'})
                                          </p>
                                        </div>
                                      </div>
                                      <span className="font-mono text-[10px] text-gold/80">
                                        {new Date(login.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: RESET MANAGER PASSWORD */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4">
          <div className="bg-charcoal-light border border-gold/30 max-w-md w-full p-8 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold" />

            <h4 className="font-serif text-lg uppercase tracking-wider text-gold mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" /> Reset Manager Password
            </h4>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">NEW PASSWORD</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[9px] text-gold uppercase tracking-widest font-semibold">CONFIRM NEW PASSWORD</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={resetPasswordConfirm}
                  onChange={(e) => setResetPasswordConfirm(e.target.value)}
                  className="w-full bg-charcoal border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setResettingPasswordManagerId(null);
                    setResetPasswordValue('');
                    setResetPasswordConfirm('');
                  }}
                  className="px-6 py-2.5 border border-white/15 text-white/70 hover:bg-white/5 font-sans text-[10px] uppercase tracking-widest rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-gold text-charcoal font-sans text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all rounded-none cursor-pointer"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}