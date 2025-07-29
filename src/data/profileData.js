export const PROFILE_DATA = {
  user: {
    name: 'Ali Yılmaz',
    email: 'ali@example.com',
    avatar: '👤',
    joinDate: '2024',
    status: 'Premium Member'
  },
  stats: {
    totalTransactions: 1247,
    totalSavings: '₺45,320',
    investmentReturn: '+12.5%',
    creditScore: 785
  }
};

export const PROFILE_MENU_ITEMS = [
  {
    id: 1,
    icon: '📊',
    title: 'User Statistics',
    subtitle: 'View your financial performance',
    route: 'UserStats',
    type: 'navigation'
  },
  {
    id: 2,
    icon: '🏆',
    title: 'Earn Rewards',
    subtitle: 'Manage your status and rewards',
    route: 'EarnRewards',
    type: 'navigation',
    badge: 'New'
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Theme Settings',
    subtitle: 'Customize the appearance',
    route: 'ThemeSettings',
    type: 'navigation'
  },
  {
    id: 4,
    icon: '🔔',
    title: 'Notification Settings',
    subtitle: 'Adjust your notification preferences',
    route: 'NotificationSettings',
    type: 'navigation'
  },
  {
    id: 5,
    icon: '📋',
    title: 'Terms of Service',
    subtitle: 'Read our service terms',
    route: 'TermsOfService',
    type: 'navigation'
  },
  {
    id: 6,
    icon: '🔒',
    title: 'Privacy Policy',
    subtitle: 'Our data protection policy',
    route: 'PrivacyPolicy',
    type: 'navigation'
  },
  {
    id: 7,
    icon: '💬',
    title: 'Contact Us',
    subtitle: 'Customer support',
    route: 'ContactUs',
    type: 'navigation'
  },
  {
    id: 8,
    icon: '🗑️',
    title: 'Delete Account',
    subtitle: 'Permanently delete your account',
    route: null,
    type: 'action',
    danger: true
  }
];

export const COLORS = {
  background: '#0a0f1c',
  cardBackground: 'rgba(30, 41, 59, 0.8)',
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  text: '#ffffff',
  textSecondary: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.2)'
};
