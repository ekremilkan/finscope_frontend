// Campaign Data Structure and Utilities
// API response mapping, data transformation, and mock data fallbacks

// Campaign interface definitions
export const CAMPAIGN_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING_DELETION: 'pending_deletion'
};

export const CAMPAIGN_CATEGORIES = {
  EDUCATION: 'education',
  TECHNOLOGY: 'technology',
  HEALTH: 'health',
  FINANCE: 'finance',
  RESEARCH: 'research',
  ANALYSIS: 'analysis',
  SECURITY: 'security'
};

export const CAMPAIGN_DIFFICULTIES = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

// Campaign data transformation utilities
export const transformApiCampaign = (apiCampaign) => {
  return {
    id: apiCampaign._id,
    title: apiCampaign.title,
    description: apiCampaign.description,
    reward: apiCampaign.reward,
    participants: apiCampaign.participants || 0,
    maxParticipants: apiCampaign.maxParticipants,
    status: apiCampaign.status,
    category: apiCampaign.category,
    difficulty: apiCampaign.difficulty,
    startDate: apiCampaign.startDate,
    endDate: apiCampaign.endDate,
    questions: apiCampaign.questions,
    questionIds: apiCampaign.questionIds || [],
    images: apiCampaign.images || [],
    videoLink: apiCampaign.videoLink,
    tags: apiCampaign.tags || [],
    createdUserId: apiCampaign.createdUserId,
    isActive: apiCampaign.isActive,
    createdAt: apiCampaign.createdAt,
    updatedAt: apiCampaign.updatedAt,
    // Mock data for missing backend features
    currentParticipants: apiCampaign.currentParticipants || 0,
    userJoined: apiCampaign.userJoined || false,
    userCompleted: apiCampaign.userCompleted || false,
    userScore: apiCampaign.userScore || null,
    userTimeSpent: apiCampaign.userTimeSpent || null,
    completionTime: apiCampaign.completionTime || null,
    userProgress: apiCampaign.userProgress || null
  };
};

// Question data transformation utilities
export const transformApiQuestion = (apiQuestion) => {
  return {
    id: apiQuestion._id,
    question: apiQuestion.questionText,
    options: apiQuestion.options.map(option => option.text),
    correctAnswer: apiQuestion.options.findIndex(option => option.isTrue),
    explanation: apiQuestion.explanation || `Explanation for question ${apiQuestion.order || 1}`,
    order: apiQuestion.order || 1
  };
};

// Campaign status utilities
export const getCampaignStatusColor = (status) => {
  switch (status) {
    case CAMPAIGN_STATUS.ACTIVE:
      return '#10b981'; // COLORS.SUCCESS
    case CAMPAIGN_STATUS.UPCOMING:
      return '#f59e0b'; // COLORS.WARNING
    case CAMPAIGN_STATUS.EXPIRED:
      return '#ef4444'; // COLORS.ERROR
    case CAMPAIGN_STATUS.PENDING_DELETION:
      return '#64748b'; // COLORS.TEXT_DISABLED
    default:
      return '#94a3b8'; // COLORS.TEXT_SECONDARY
  }
};

export const getCampaignStatusText = (status) => {
  switch (status) {
    case CAMPAIGN_STATUS.ACTIVE:
      return 'Active';
    case CAMPAIGN_STATUS.UPCOMING:
      return 'Upcoming';
    case CAMPAIGN_STATUS.EXPIRED:
      return 'Expired';
    case CAMPAIGN_STATUS.PENDING_DELETION:
      return 'Pending Deletion';
    default:
      return 'Unknown';
  }
};

// Campaign difficulty utilities
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case CAMPAIGN_DIFFICULTIES.BEGINNER:
      return '#10b981'; // COLORS.SUCCESS
    case CAMPAIGN_DIFFICULTIES.INTERMEDIATE:
      return '#f59e0b'; // COLORS.WARNING
    case CAMPAIGN_DIFFICULTIES.ADVANCED:
      return '#ef4444'; // COLORS.ERROR
    default:
      return '#64748b'; // COLORS.TEXT_DISABLED
  }
};

// Campaign progress utilities
export const getProgressPercentage = (participants, maxParticipants) => {
  if (!maxParticipants || maxParticipants === 0) return 0;
  return Math.round((participants / maxParticipants) * 100);
};

export const getTimeRemaining = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  
  if (diff <= 0) return 0;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return { days, hours };
};

// Campaign validation utilities
export const validateCampaign = (campaign) => {
  const errors = [];
  
  if (!campaign.title) errors.push('Title is required');
  if (!campaign.description) errors.push('Description is required');
  if (!campaign.reward || campaign.reward <= 0) errors.push('Valid reward is required');
  if (!campaign.maxParticipants || campaign.maxParticipants <= 0) errors.push('Valid max participants is required');
  if (!campaign.startDate) errors.push('Start date is required');
  if (!campaign.endDate) errors.push('End date is required');
  if (!campaign.category) errors.push('Category is required');
  if (!campaign.difficulty) errors.push('Difficulty is required');
  
  return errors;
};

// Campaign filtering utilities
export const filterCampaigns = (campaigns, filters = {}) => {
  let filtered = [...campaigns];
  
  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(campaign => campaign.status === filters.status);
  }
  
  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(campaign => campaign.category === filters.category);
  }
  
  // Difficulty filter
  if (filters.difficulty && filters.difficulty !== 'all') {
    filtered = filtered.filter(campaign => campaign.difficulty === filters.difficulty);
  }
  
  // Search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(campaign => 
      campaign.title.toLowerCase().includes(searchTerm) ||
      campaign.description.toLowerCase().includes(searchTerm) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // User joined filter
  if (filters.userJoined !== undefined) {
    filtered = filtered.filter(campaign => campaign.userJoined === filters.userJoined);
  }
  
  // User completed filter
  if (filters.userCompleted !== undefined) {
    filtered = filtered.filter(campaign => campaign.userCompleted === filters.userCompleted);
  }
  
  return filtered;
};

// Campaign sorting utilities
export const sortCampaigns = (campaigns, sortBy = 'createdAt', sortOrder = 'desc') => {
  const sorted = [...campaigns];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'reward':
        aValue = a.reward;
        bValue = b.reward;
        break;
      case 'participants':
        aValue = a.participants;
        bValue = b.participants;
        break;
      case 'startDate':
        aValue = new Date(a.startDate);
        bValue = new Date(b.startDate);
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return sorted;
};

// Mock data for development/testing
export const MOCK_CAMPAIGNS = [
  {
    id: 'mock_1',
    title: 'Blockchain ve Kripto Para Eğitimi',
    description: 'Blockchain teknolojisi, kripto para birimleri ve DeFi uygulamaları hakkında kapsamlı eğitim. Bu kampanyada temel blockchain kavramlarından başlayarak ileri seviye konulara kadar her şeyi öğreneceksiniz.',
    reward: 150,
    participants: 45,
    maxParticipants: 200,
    status: CAMPAIGN_STATUS.ACTIVE,
    category: CAMPAIGN_CATEGORIES.EDUCATION,
    difficulty: CAMPAIGN_DIFFICULTIES.BEGINNER,
    startDate: '2024-12-20T00:00:00.000Z',
    endDate: '2024-12-25T23:59:59.000Z',
    questions: 5,
    questionIds: ['mock_q_1', 'mock_q_2'],
    images: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
      'https://images.unsplash.com/photo-1621416894560-3a23f3a1d8c5?w=800'
    ],
    videoLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'defi'],
    createdUserId: {
      _id: 'mock_user_1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    isActive: true,
    createdAt: '2024-12-20T10:00:00.000Z',
    updatedAt: '2024-12-20T10:00:00.000Z',
    currentParticipants: 45,
    userJoined: false,
    userCompleted: false,
    userScore: null,
    userTimeSpent: null,
    completionTime: null,
    userProgress: null
  },
  {
    id: 'mock_2',
    title: 'DeFi Protokolleri ve Yield Farming',
    description: 'DeFi ekosistemindeki protokolleri, yield farming stratejilerini ve risk yönetimini öğrenin. Pratik uygulamalar ve gerçek dünya örnekleri ile desteklenen kapsamlı bir eğitim.',
    reward: 200,
    participants: 78,
    maxParticipants: 150,
    status: CAMPAIGN_STATUS.ACTIVE,
    category: CAMPAIGN_CATEGORIES.FINANCE,
    difficulty: CAMPAIGN_DIFFICULTIES.INTERMEDIATE,
    startDate: '2024-12-18T00:00:00.000Z',
    endDate: '2024-12-28T23:59:59.000Z',
    questions: 8,
    questionIds: ['mock_q_3', 'mock_q_4'],
    images: [
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800'
    ],
    videoLink: 'https://www.youtube.com/watch?v=example2',
    tags: ['defi', 'yield-farming', 'liquidity', 'amm'],
    createdUserId: {
      _id: 'mock_user_2',
      name: 'DeFi Expert',
      email: 'defi@example.com'
    },
    isActive: true,
    createdAt: '2024-12-18T10:00:00.000Z',
    updatedAt: '2024-12-18T10:00:00.000Z',
    currentParticipants: 78,
    userJoined: true,
    userCompleted: false,
    userScore: null,
    userTimeSpent: 120,
    completionTime: null,
    userProgress: 2
  }
];

export const MOCK_QUESTIONS = [
  {
    id: 'mock_q_1',
    question: 'Blockchain teknolojisinin temel özelliği nedir?',
    options: [
      'Merkezi kontrol',
      'Değiştirilemezlik (Immutability)',
      'Hızlı işlem',
      'Düşük maliyet'
    ],
    correctAnswer: 1,
    explanation: 'Blockchain teknolojisinin en önemli özelliği değiştirilemezliktir. Bu sayede veriler güvenli ve şeffaf bir şekilde saklanır.',
    order: 1
  },
  {
    id: 'mock_q_2',
    question: 'Bitcoin hangi yılda oluşturulmuştur?',
    options: [
      '2007',
      '2008',
      '2009',
      '2010'
    ],
    correctAnswer: 2,
    explanation: 'Bitcoin 2009 yılında Satoshi Nakamoto tarafından oluşturulmuştur.',
    order: 2
  },
  {
    id: 'mock_q_3',
    question: 'DeFi nedir?',
    options: [
      'Digital Finance',
      'Decentralized Finance',
      'Distributed Finance',
      'Dynamic Finance'
    ],
    correctAnswer: 1,
    explanation: 'DeFi, Decentralized Finance (Merkezi Olmayan Finans) anlamına gelir.',
    order: 3
  },
  {
    id: 'mock_q_4',
    question: 'Yield Farming nedir?',
    options: [
      'Kripto para madenciliği',
      'Likidite sağlayarak kazanç elde etme',
      'Kripto para alım-satımı',
      'Blockchain geliştirme'
    ],
    correctAnswer: 1,
    explanation: 'Yield Farming, likidite havuzlarına token sağlayarak kazanç elde etme stratejisidir.',
    order: 4
  }
];

// Export default campaign data for backward compatibility
export const CAMPAIGN_DATA = MOCK_CAMPAIGNS; 