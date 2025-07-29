# Kampanya Modülü Görev Dosyası v1.0

## 📋 Proje Genel Bilgileri

**Proje:** Finscope Frontend - React Native  
**Modül:** Kampanya Sistemi  
**Backend API:** `http://localhost:5005/api/v1`  
**Authentication:** Bearer Token (JWT)

---

## 🎯 Ana Hedefler

1. **Kampanya Listesi Dinamikleştirme** - API'den veri çekme
2. **Kampanya Detay Sayfası Ekleme** - Bilgilendirme sayfası
3. **Quiz Sistemi İyileştirme** - Yanlış cevap cezası
4. **API Entegrasyonu** - Profesyonel veri yönetimi

---

## 📁 Modüler Yapı Planı

### 1. Data Layer (API Entegrasyonu)

#### 1.1 Campaign Service
```javascript
// src/services/campaignService.js
- getAllCampaigns() // GET /campaigns/all
- getCampaignById(id) // GET /campaigns/:id
- getCampaignQuestions(campaignId) // GET /questions/campaign/:campaignId
```

#### 1.2 Campaign Data Structure
```javascript
// src/data/campaignData.js
- Campaign interface tanımları
- Mock data (backend eksikliği için)
- Data transformation utilities
```

### 2. Utils Layer (Business Logic)

#### 2.1 Campaign Utils
```javascript
// src/utils/campaignUtils.js
- API error handling
- Data validation
- Campaign status management
- Filtering ve sorting logic
```

#### 2.2 Quiz Utils (Güncellenmiş)
```javascript
// src/utils/quizUtils.js
- Yanlış cevap cezası (20 saniye)
- Süre takibi iyileştirme
- Doğru cevaplayana kadar bekleme
- Quiz completion tracking
```

### 3. Components Layer

#### 3.1 Campaign Components
```javascript
// src/components/Campaign/
├── CampaignList.js          // Kampanya listesi
├── CampaignCard.js          // Kampanya kartı
├── CampaignDetail.js        // Kampanya detay sayfası
├── CampaignHeader.js        // Detay sayfası header
├── CampaignContent.js       // Detay içeriği (video, resim, açıklama)
└── CampaignActions.js       // Başla butonu vs.
```

#### 3.2 Quiz Components (Güncellenmiş)
```javascript
// src/components/Quiz/
├── QuizHeader.js            // Güncellenmiş (süre takibi)
├── QuizQuestion.js          // Mevcut
├── QuizOptions.js           // Güncellenmiş (ceza sistemi)
├── QuizProgress.js          // Mevcut
├── QuizNavigation.js        // Güncellenmiş
├── QuizResultModal.js       // Güncellenmiş (try again kaldırılacak)
└── QuizPenaltyModal.js      // YENİ - Ceza modalı
```

### 4. Screens Layer

#### 4.1 Campaign Screens
```javascript
// src/screens/Campaign/
├── CampaignListScreen.js    // Ana kampanya listesi
├── CampaignDetailScreen.js  // YENİ - Kampanya detay sayfası
└── QuizScreen.js           // Güncellenmiş quiz ekranı
```

---

## 🔧 Detaylı Görev Listesi

### Phase 1: API Entegrasyonu ve Data Layer ✅

#### 1.1 Campaign Service Oluşturma ✅
**Dosya:** `src/services/campaignService.js` ✅

**Görevler:**
- [x] API base URL konfigürasyonu
- [x] getAllCampaigns() fonksiyonu
- [x] getCampaignById(id) fonksiyonu
- [x] getCampaignQuestions(campaignId) fonksiyonu
- [x] Error handling ve retry logic
- [x] Loading state management
- [x] Cache mechanism (AsyncStorage)

**Mock Data (Backend Eksikliği İçin):**
```javascript
// Backend'de eksik olan alanlar için mock data
const MOCK_CAMPAIGN_DATA = {
  participants: 0, // Backend'de yok
  currentParticipants: 0, // Backend'de yok
  completionTime: null, // Backend'de yok
  userProgress: null, // Backend'de yok
  userJoined: false, // Backend'de yok
  userCompleted: false, // Backend'de yok
  userScore: null, // Backend'de yok
  userTimeSpent: null // Backend'de yok
};
```

#### 1.2 Campaign Data Structure ✅
**Dosya:** `src/data/campaignData.js` ✅

**Görevler:**
- [x] Campaign interface tanımları
- [x] API response mapping
- [x] Data transformation utilities
- [x] Mock data fallback
- [x] Type validation

### Phase 2: Campaign List Screen Güncelleme ✅

#### 2.1 Campaign List Screen ✅
**Dosya:** `src/screens/CampaignsScreen.js` ✅ (Mevcut dosya güncellendi)

**Görevler:**
- [x] API'den kampanya verilerini çekme
- [x] Loading state implementation
- [x] Error handling
- [x] Pull-to-refresh
- [x] Empty state handling
- [x] Search ve filter functionality
- [x] Navigation to detail screen
- [x] **Modüler yapı düzeltildi** - campaignService entegrasyonu
- [x] **toString hatası düzeltildi** - güvenli keyExtractor
- [x] **Mock data tamamen kaldırıldı** - Gerçek API entegrasyonu

#### 2.2 Campaign Card Component ✅
**Dosya:** `src/components/UserCampaign/UserCampaignCard.js` ✅ (Backend veri yapısına uygun hale getirildi)

**Görevler:**
- [x] API data structure'a uygun card design
- [x] Campaign status display
- [x] Progress bar (participants/maxParticipants)
- [x] Reward display
- [x] Difficulty badge
- [x] Tags display
- [x] Join/Continue button logic
- [x] Backend veri yapısına uygun güncelleme

#### 2.3 Campaign Service ✅
**Dosya:** `src/services/campaignService.js` ✅

**Güncellemeler:**
- [x] Mock data tamamen kaldırıldı
- [x] Gerçek API entegrasyonu
- [x] Error handling iyileştirildi
- [x] Backend response structure'a uygun hale getirildi

#### 2.4 User Campaign Utils ✅
**Dosya:** `src/utils/userCampaignUtils.js` ✅

**Güncellemeler:**
- [x] Backend veri yapısına uygun güncelleme
- [x] Error handling iyileştirildi
- [x] Campaign status utilities eklendi
- [x] Real API integration

#### 2.5 Campaign Detail Screen ✅
**Dosya:** `src/screens/Campaign/CampaignDetailScreen.js` ✅

**Güncellemeler:**
- [x] Backend veri yapısına uygun güncelleme
- [x] Error handling iyileştirildi
- [x] Real API integration

#### 2.6 Modüler Yapı İyileştirmeleri ✅
**Düzeltmeler:**
- [x] campaignService doğru kullanımı
- [x] API entegrasyonu modüler hale getirildi
- [x] Error handling iyileştirildi
- [x] Loading states modüler yapıldı
- [x] toString hatası güvenli hale getirildi

### Phase 3: Campaign Detail Screen (YENİ) ✅

#### 3.1 Campaign Detail Screen ✅
**Dosya:** `src/screens/Campaign/CampaignDetailScreen.js` ✅

**Görevler:**
- [x] Campaign detay sayfası oluşturma
- [x] Video player integration
- [x] Image gallery
- [x] Campaign description
- [x] Campaign stats (participants, reward, etc.)
- [x] "Kampanyaya Başla" butonu
- [x] Navigation to quiz
- [x] **Campaign detail buton logic düzeltildi** - userJoined kontrolü
- [x] **Campaign join hatası düzeltildi** - Backend endpoint düzeltmesi
- [x] **Campaign status kontrolü eklendi** - Expired campaign'ler için disabled button

#### 3.2 Campaign Detail Components ✅
**Dosyalar:**
- `src/screens/Campaign/CampaignDetailScreen.js` ✅

**Görevler:**
- [x] Responsive design
- [x] Video/resim içerik alanları
- [x] Campaign information display
- [x] Action buttons
- [x] Loading states

#### 3.3 Navigation Güncelleme ✅
**Dosyalar:**
- `src/navigators/StackNavigation/AppStack.js` ✅
- `src/screens/CampaignsScreen.js` ✅
- `src/components/UserCampaign/UserCampaignCard.js` ✅

**Görevler:**
- [x] CampaignDetail route ekleme
- [x] Navigation params handling
- [x] Card press handling

### Phase 4: Quiz System İyileştirme ✅

#### 4.1 Quiz Screen Güncelleme ✅
**Dosya:** `src/screens/QuizScreen.js`

**Görevler:**
- [x] API'den soru verilerini çekme
- [x] Yanlış cevap cezası (20 saniye)
- [x] Doğru cevaplayana kadar bekleme
- [x] Süre takibi iyileştirme
- [x] Quiz completion tracking
- [x] Try again butonunu kaldırma
- [x] **Quiz loading hatası düzeltildi** - Backend endpoint düzeltmesi
- [x] **Start time ref düzeltildi** - Completion time hesaplaması
- [x] **Quiz options render hatası düzeltildi** - Backend option formatına uygun hale getirildi
- [x] **Campaign join navigation düzeltildi** - Alert yerine direkt navigation

#### 4.2 Quiz Components Güncelleme ✅
**Dosyalar:**
- `src/components/Quiz/QuizOptions.js` (ceza sistemi)
- `src/components/Quiz/QuizResultModal.js` (try again kaldırma)
- `src/components/Quiz/QuizPenaltyModal.js` (YENİ)

**Görevler:**
- [x] Yanlış cevap modalı
- [x] 20 saniye countdown
- [x] Doğru cevap kontrolü
- [x] Progress tracking
- [x] Completion time tracking
- [x] **Quiz timer geçici olarak devre dışı bırakıldı**
- [x] **Doğru/yanlış cevap görselleştirmesi eklendi**
- [x] **20 saniye penalty sırasında tıklama engellendi**
- [x] **Question text field'ı düzeltildi** - Backend formatına uygun
- [x] **Doğru cevap sadece seçildiğinde yeşil gösteriliyor**
- [x] **20 saniye penalty timer düzeltildi** - Gerçek 20 saniye bekleme
- [x] **Progress update hatası düzeltildi** - Backend endpoint ve data formatı düzeltildi
- [x] **Quiz completion aktif edildi** - Backend endpoint eklendi, gerçek API çağrısı yapılıyor
- [x] **Progress update data format hatası düzeltildi** - Undefined değerler kontrol ediliyor, timeSpent hesaplaması düzeltildi
- [x] **Quiz score hesaplama hatası düzeltildi** - Backend formatına uygun score hesaplama, quiz tamamlandığında 100%
- [x] **Quiz completion navigation hatası düzeltildi** - Campaign state güncelleme, focus listener eklendi

### Phase 5: Navigation Güncelleme ✅

#### 5.1 AppStack Navigation ✅
**Dosya:** `src/navigators/StackNavigation/AppStack.js` ✅

**Görevler:**
- [x] CampaignDetailScreen route ekleme
- [x] QuizScreen route güncelleme
- [x] Navigation params handling
- [x] Gesture handling optimization
- [x] Card style interpolator eklendi
- [x] Navigation options iyileştirildi

#### 5.2 Tab Navigation ✅
**Dosya:** `src/navigators/TabNavigation/BottomTabNavigator.js` ✅

**Görevler:**
- [x] Campaign list route güncelleme
- [x] Navigation flow optimization
- [x] Tab bar styling iyileştirildi
- [x] Performance optimizations (lazy loading)
- [x] Unmount on blur eklendi
- [x] Tab bar hide on keyboard eklendi

#### 5.3 Navigation Utilities ✅
**Dosya:** `src/utils/navigationUtils.js` ✅

**Görevler:**
- [x] Navigation constants tanımlandı
- [x] Navigation helpers oluşturuldu
- [x] Navigation guards eklendi
- [x] Navigation flow helpers eklendi
- [x] Error handling iyileştirildi
- [x] Navigation state helpers eklendi

#### 5.4 Screen Navigation Updates ✅
**Dosyalar:**
- `src/screens/CampaignsScreen.js` ✅
- `src/screens/QuizScreen.js` ✅
- `src/screens/Campaign/CampaignDetailScreen.js` ✅

**Görevler:**
- [x] Navigation utilities entegrasyonu
- [x] Navigation params handling iyileştirildi
- [x] Error handling eklendi
- [x] Navigation flow optimization

### Phase 6: Error Handling ve Loading States

#### 6.1 Global Error Handling
**Dosya:** `src/utils/errorHandler.js`

**Görevler:**
- [ ] API error handling
- [ ] Network error handling
- [ ] User-friendly error messages
- [ ] Retry mechanism

#### 6.2 Loading States
**Dosya:** `src/components/common/LoadingSpinner.js`

**Görevler:**
- [ ] Loading spinner component
- [ ] Skeleton loading
- [ ] Progressive loading

---

## 🚨 Backend Eksiklikleri ve Çözümler

### 1. User Progress Tracking
**Eksiklik:** Backend'de user progress tracking yok
**Çözüm:** AsyncStorage ile local tracking

### 2. Campaign Participation
**Eksiklik:** Backend'de user participation tracking yok
**Çözüm:** Local state management

### 3. Quiz Completion Time
**Eksiklik:** Backend'de completion time tracking yok
**Çözüm:** Local calculation ve storage

### 4. User Score Tracking
**Eksiklik:** Backend'de user score tracking yok
**Çözüm:** Local calculation

### 5. Real-time Updates
**Eksiklik:** Backend'de real-time updates yok
**Çözüm:** Polling mechanism

---

## 📊 API Integration Plan

### 1. Campaign List API
```javascript
// GET /campaigns/all
const fetchCampaigns = async () => {
  try {
    const response = await api.get('/campaigns/all');
    return response.data.data;
  } catch (error) {
    console.error('Campaign fetch error:', error);
    return MOCK_CAMPAIGN_DATA; // Fallback
  }
};
```

### 2. Campaign Detail API
```javascript
// GET /campaigns/:id
const fetchCampaignDetail = async (campaignId) => {
  try {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data.data;
  } catch (error) {
    console.error('Campaign detail fetch error:', error);
    return null;
  }
};
```

### 3. Campaign Questions API
```javascript
// GET /questions/campaign/:campaignId
const fetchCampaignQuestions = async (campaignId) => {
  try {
    const response = await api.get(`/questions/campaign/${campaignId}`);
    return response.data.data;
  } catch (error) {
    console.error('Questions fetch error:', error);
    return QUIZ_DATA; // Fallback to existing data
  }
};
```

---

## 🎨 UI/UX Gereksinimleri

### 1. Campaign List Screen
- [ ] Glass morphism design
- [ ] Responsive layout
- [ ] Smooth animations
- [ ] Pull-to-refresh
- [ ] Search functionality
- [ ] Filter options

### 2. Campaign Detail Screen
- [ ] Hero image/video
- [ ] Campaign information cards
- [ ] Progress indicators
- [ ] Action buttons
- [ ] Smooth transitions

### 3. Quiz Screen
- [ ] Penalty modal design
- [ ] Countdown timer
- [ ] Progress indicators
- [ ] Smooth animations
- [ ] Error states

---

## 📱 Responsive Design

### 1. Screen Sizes
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 (390x844)
- [ ] iPhone 12 Pro Max (428x926)
- [ ] Android (various sizes)

### 2. Design Tokens
```javascript
const DESIGN_TOKENS = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#0a0f1c',
    cardBackground: 'rgba(30, 41, 59, 0.8)',
    text: '#ffffff',
    textSecondary: '#94a3b8'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  }
};
```

---

## 🧪 Testing Plan

### 1. Unit Tests
- [ ] Campaign service tests
- [ ] Campaign utils tests
- [ ] Component tests
- [ ] Navigation tests

### 2. Integration Tests
- [ ] API integration tests
- [ ] Navigation flow tests
- [ ] User interaction tests

### 3. Manual Testing
- [ ] Campaign list functionality
- [ ] Campaign detail navigation
- [ ] Quiz penalty system
- [ ] Error handling
- [ ] Loading states

---

## 📋 Implementation Checklist

### Phase 1: Foundation ✅
- [x] Campaign service oluşturma
- [x] API integration setup
- [x] Error handling implementation
- [x] Mock data fallback

### Phase 2: Campaign List ✅
- [x] Campaign list screen güncelleme
- [x] Campaign card component güncelleme
- [x] API data integration
- [x] Loading states
- [x] Export hataları düzeltildi

### Phase 3: Campaign Detail 🔄
- [ ] Campaign detail screen oluşturma
- [ ] Campaign detail components
- [ ] Video/image integration
- [ ] Navigation flow

### Phase 4: Quiz Enhancement
- [ ] Quiz penalty system
- [ ] Quiz timer improvement
- [ ] Quiz completion tracking
- [ ] Result modal updates

### Phase 5: Polish
- [ ] Error handling refinement
- [ ] Loading state optimization
- [ ] Performance optimization
- [ ] Code cleanup

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Error handling verified
- [ ] Loading states tested
- [ ] API integration tested
- [ ] Navigation flow tested

### Post-deployment
- [ ] Monitor API calls
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] User feedback collection

---

## 📝 Notes

### Backend Dependencies
- Campaign CRUD endpoints
- Question management endpoints
- User progress tracking (future)
- Real-time updates (future)

### Frontend Dependencies
- React Navigation
- AsyncStorage
- Axios
- React Native Vector Icons

### Performance Considerations
- Image optimization
- Lazy loading
- Cache management
- Bundle size optimization

---

**Son Güncelleme:** 2024-12-20  
**Versiyon:** 1.0  
**Durum:** Phase 2 Tamamlandı ve Hatalar Düzeltildi, Phase 3 Devam Ediyor 