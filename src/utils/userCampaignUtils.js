export const filterUserCampaigns = (campaigns, searchQuery, selectedFilter) => {
  let filtered = campaigns;

  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Category filter
  if (selectedFilter !== 'all') {
    filtered = filtered.filter(campaign => campaign.category === selectedFilter);
  }

  // Newest campaigns first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered;
};

export const handleJoinCampaign = (campaigns, setCampaigns, campaignId, navigation) => {
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (campaign.userJoined) {
    // Continue to quiz
    navigation.navigate('QuizScreen', { 
      campaign: campaign,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      reward: campaign.reward
    });
  } else {
    // Join campaign
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, userJoined: true, participants: c.participants + 1 }
        : c
    ));
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

export const getProgressPercentage = (participants, maxParticipants) => {
  return Math.round((participants / maxParticipants) * 100);
}; 