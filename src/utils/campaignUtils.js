export const filterCampaigns = (campaigns, searchQuery, selectedFilter) => {
  let filtered = campaigns;

  // Arama filtresi
  if (searchQuery) {
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Kategori/Status filtresi
  if (selectedFilter !== 'all') {
    if (['active', 'draft', 'completed'].includes(selectedFilter)) {
      filtered = filtered.filter(campaign => campaign.status === selectedFilter);
    } else {
      filtered = filtered.filter(campaign => campaign.category === selectedFilter);
    }
  }

  // En yeni kampanyalar önce
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
    case 'active': return 'Aktif';
    case 'draft': return 'Taslak';
    case 'completed': return 'Tamamlandı';
    default: return 'Bilinmiyor';
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