export const filterUserCampaigns = (campaigns, searchQuery, selectedFilter) => {
  let filtered = campaigns;

  // Arama filtresi
  if (searchQuery) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Kategori filtresi
  if (selectedFilter !== 'all') {
    filtered = filtered.filter(campaign => campaign.category === selectedFilter);
  }

  // En yeni kampanyalar önce
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered;
};

export const handleJoinCampaign = (campaigns, setCampaigns, campaignId, navigation) => {
  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (campaign.userJoined) {
    // Quiz'e devam et
    navigation.navigate('QuizScreen', { 
      campaign: campaign,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      reward: campaign.reward
    });
  } else {
    // Kampanyaya katıl
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, userJoined: true, participants: c.participants + 1 }
        : c
    ));
  }
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Başlangıç': return '#10b981';
    case 'Orta': return '#f59e0b';
    case 'İleri': return '#ef4444';
    default: return '#94a3b8';
  }
};

export const getProgressPercentage = (participants, maxParticipants) => {
  return Math.round((participants / maxParticipants) * 100);
}; 