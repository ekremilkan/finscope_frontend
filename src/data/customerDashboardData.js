export const CUSTOMER_DASHBOARD_DATA = {
  activeCampaigns: 2,
  totalSpend: 1450,
  reachedUsers: 147,
  roi: 340,
  performanceChange: 23
};

export const CUSTOMER_RECENT_CAMPAIGNS = [
  {
    id: 1,
    title: 'DeFiSwap Launch Campaign',
    participants: 47,
    successRate: 78,
    status: 'active',
    icon: '🎯'
  },
  {
    id: 2,
    title: 'Liquidity Mining Education',
    participants: 32,
    successRate: 100,
    status: 'completed',
    icon: '📚'
  }
];

export const CUSTOMER_BOTTOM_NAV_ITEMS = [
  { id: 'dashboard', title: 'Dashboard', icon: 'grid-outline' },
  { id: 'campaigns', title: 'Campaigns', icon: 'megaphone-outline' },
  { id: 'segments', title: 'Segments', icon: 'people-outline' },
  { id: 'reports', title: 'Reports', icon: 'analytics-outline' },
];

export const getKPICards = (dashboardData) => [
  {
    id: 1,
    title: 'Active Campaigns',
    value: dashboardData.activeCampaigns,
    unit: '',
    color: '#6366f1',
    icon: 'campaign'
  },
  {
    id: 2,
    title: 'Spending',
    value: dashboardData.totalSpend.toLocaleString(),
    unit: 'USDT',
    color: '#f59e0b',
    icon: 'payments'
  },
  {
    id: 3,
    title: 'Reached Users',
    value: dashboardData.reachedUsers,
    unit: '',
    color: '#10b981',
    icon: 'people'
  },
  {
    id: 4,
    title: 'ROI',
    value: dashboardData.roi,
    unit: '%',
    color: '#8b5cf6',
    icon: 'trending-up'
  }
]; 