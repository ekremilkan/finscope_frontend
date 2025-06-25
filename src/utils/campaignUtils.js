export const filterCampaigns = (campaigns, searchQuery, selectedFilter) => {
  let filtered = campaigns;

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Category/Status filter
  if (selectedFilter !== 'all') {
    if (['active', 'draft', 'completed'].includes(selectedFilter)) {
      filtered = filtered.filter(campaign => campaign.status === selectedFilter);
    } else {
      filtered = filtered.filter(campaign => campaign.category === selectedFilter);
    }
  }

  // Newest campaigns first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered;
};

export const getProgressPercentage = (participants, maxParticipants) => {
  return Math.round((participants / maxParticipants) * 100);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return '#10b981';
    case 'draft': return '#f59e0b';
    case 'completed': return '#6366f1';
    default: return '#94a3b8';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'draft': return 'Draft';
    case 'completed': return 'Completed';
    default: return 'Unknown';
  }
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return '#10b981';
    case 'Intermediate': return '#f59e0b';
    case 'Advanced': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'completed': return 'Completed';
    case 'draft': return 'Draft';
    case 'paused': return 'Paused';
    default: return 'Unknown';
  }
}; 