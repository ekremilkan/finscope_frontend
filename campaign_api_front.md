# Kampanya API Frontend Gereksinimleri

## ✅ **BACKEND GELİŞTİRİCİ NOTU - TAMAMLANDI**

### **Quiz Completion Endpoint Eklendi**

Backend geliştiricisi `POST /campaigns/:id/complete` endpoint'ini başarıyla ekledi. Frontend artık quiz completion'ı backend'e gönderebiliyor.

**Eklenen Endpoint:**
```
POST /campaigns/:id/complete
```

**Request Body:**
```json
{
  "totalTimeSpent": 183,
  "score": 100,
  "questionsAnswered": 7,
  "totalQuestions": 7
}
```

**Response:**
```json
{
  "code": 200,
  "error": false,
  "success": true,
  "message": "Quiz completed successfully",
  "data": {
    "campaignId": "campaign_id",
    "userId": "user_id",
    "completed": true,
    "completedAt": "2024-12-20T10:30:00.000Z",
    "score": 100,
    "totalTimeSpent": 183
  }
}
```

**✅ Endpoint başarıyla entegre edildi!**

---

## 📋 Genel Bilgiler

**Proje:** Finscope Frontend - React Native  
**Modül:** Kampanya Sistemi  
**Hedef:** Backend API'sine eksik verilerin eklenmesi  
**Versiyon:** 1.0  
**Tarih:** 2024-12-20  

---

## 🎯 Mevcut Durum ve Sorunlar

### ✅ **Mevcut API Verileri (Backend'de Var):**
```javascript
{
  _id: "campaign_id",
  title: "Kampanya Başlığı",
  description: "Kampanya açıklaması",
  maxParticipants: 200,
  reward: 100,
  difficulty: "Beginner",
  startDate: "2024-01-01T00:00:00.000Z",
  endDate: "2024-12-31T23:59:59.000Z",
  tags: ["web3", "blockchain"],
  category: "Education",
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

### ❌ **Eksik API Verileri (Backend'de Yok):**
```javascript
{
  participants: 0,           // Mevcut katılımcı sayısı
  currentParticipants: 0,    // Aktif katılımcı sayısı
  userJoined: false,         // Kullanıcının katılıp katılmadığı
  userCompleted: false,      // Kullanıcının tamamlayıp tamamlamadığı
  userScore: null,           // Kullanıcının skoru (100% olacak - tüm sorular doğru)
  userTimeSpent: null,       // Kullanıcının harcadığı süre (saniye)
  userProgress: null,        // Kullanıcının ilerleme durumu
  completionTime: null       // Kampanya tamamlanma süresi
}
```

---

## 🔧 Backend API Güncellemeleri

### 1. Campaign List API Güncellemesi

#### **Mevcut Endpoint:**
```
GET /api/v1/campaigns/all
```

#### **Güncellenmiş Response:**
```javascript
{
  "success": true,
  "data": [
    {
      "_id": "campaign_id",
      "title": "Kampanya Başlığı",
      "description": "Kampanya açıklaması",
      "maxParticipants": 200,
      "participants": 77,           // ✅ YENİ
      "currentParticipants": 65,     // ✅ YENİ
      "reward": 100,
      "difficulty": "Beginner",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "tags": ["web3", "blockchain"],
      "category": "Education",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      
      // User-specific data (Auth required)
      "userJoined": false,          // ✅ YENİ
      "userCompleted": false,       // ✅ YENİ
      "userScore": null,            // ✅ YENİ (100% olacak - tüm sorular doğru)
      "userTimeSpent": null,        // ✅ YENİ
      "userProgress": null          // ✅ YENİ
    }
  ]
}
```

### 2. Campaign Detail API Güncellemesi

#### **Mevcut Endpoint:**
```
GET /api/v1/campaigns/:id
```

#### **Güncellenmiş Response:**
```javascript
{
  "success": true,
  "data": {
    "_id": "campaign_id",
    "title": "Kampanya Başlığı",
    "description": "Kampanya açıklaması",
    "content": "Detaylı kampanya içeriği...",  // ✅ YENİ
    "videoUrl": "https://example.com/video.mp4", // ✅ YENİ
    "imageUrls": [                               // ✅ YENİ
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "maxParticipants": 200,
    "participants": 77,
    "currentParticipants": 65,
    "reward": 100,
    "difficulty": "Beginner",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T23:59:59.000Z",
    "tags": ["web3", "blockchain"],
    "category": "Education",
    "isActive": true,
    "questions": 10,                              // ✅ YENİ
    "estimatedDuration": 15,                      // ✅ YENİ (dakika)
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    
    // User-specific data
    "userJoined": false,
    "userCompleted": false,
    "userScore": null,            // 100% olacak - tüm sorular doğru
    "userTimeSpent": null,
    "userProgress": {
      "currentQuestion": 0,
      "answeredQuestions": [],
      "correctAnswers": 0,
      "wrongAnswers": 0,
      "timeSpent": 0,
      "lastActivity": null
    }
  }
}
```

### 3. User Progress API (YENİ)

#### **Endpoint:**
```
GET /api/v1/campaigns/:id/user-progress
```

#### **Response:**
```javascript
{
  "success": true,
  "data": {
    "campaignId": "campaign_id",
    "userId": "user_id",
    "joined": true,
    "completed": false,
    "score": 100,              // 100% olacak - tüm sorular doğru
    "timeSpent": 450,          // saniye
    "progress": {
      "currentQuestion": 3,
      "totalQuestions": 10,
      "answeredQuestions": [0, 1, 2],
      "correctAnswers": 3,
      "wrongAnswers": 0,
      "lastActivity": "2024-12-20T10:30:00.000Z"
    },
    "startedAt": "2024-12-20T10:00:00.000Z",
    "completedAt": null
  }
}
```

### 4. Join Campaign API (YENİ)

#### **Endpoint:**
```
POST /api/v1/campaigns/:id/join
```

#### **Request:**
```javascript
{
  "userId": "user_id"
}
```

#### **Response (Başarılı):**
```javascript
{
  "success": true,
  "data": {
    "campaignId": "campaign_id",
    "userId": "user_id",
    "joined": true,
    "joinedAt": "2024-12-20T10:00:00.000Z",
    "message": "Kampanyaya başarıyla katıldınız",
    "participants": 78,           // ✅ Güncellenmiş katılımcı sayısı
    "maxParticipants": 200,
    "remainingSlots": 122         // ✅ Kalan kontenjan
  }
}
```

#### **Response (Kontenjan Dolu):**
```javascript
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_FULL",
    "message": "Kampanya kontenjanı dolmuştur",
    "details": {
      "campaignId": "campaign_id",
      "participants": 200,
      "maxParticipants": 200,
      "remainingSlots": 0
    }
  }
}
```

#### **Response (Zaten Katılmış):**
```javascript
{
  "success": false,
  "error": {
    "code": "ALREADY_JOINED",
    "message": "Bu kampanyaya zaten katılmışsınız",
    "details": {
      "campaignId": "campaign_id",
      "userId": "user_id",
      "joinedAt": "2024-12-20T09:00:00.000Z"
    }
  }
}
```

#### **Response (Kampanya Aktif Değil):**
```javascript
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_NOT_ACTIVE",
    "message": "Bu kampanya aktif değil",
    "details": {
      "campaignId": "campaign_id",
      "isActive": false,
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z"
    }
  }
}
```

### 5. Update Progress API (YENİ)

#### **Endpoint:**
```
PUT /api/v1/campaigns/:id/progress
```

#### **Request:**
```javascript
{
  "userId": "user_id",
  "questionId": "question_id",
  "selectedAnswer": 0,
  "isCorrect": true,
  "timeSpent": 30, // saniye
  "completed": false
}
```

#### **Response:**
```javascript
{
  "success": true,
  "data": {
    "campaignId": "campaign_id",
    "userId": "user_id",
    "progress": {
      "currentQuestion": 4,
      "totalQuestions": 10,
      "answeredQuestions": [0, 1, 2, 3],
      "correctAnswers": 4,
      "wrongAnswers": 0,
      "timeSpent": 120,
      "lastActivity": "2024-12-20T10:30:00.000Z"
    },
    "score": 100,              // 100% olacak - tüm sorular doğru
    "completed": false
  }
}
```

---

## 📊 Database Schema Güncellemeleri

### 1. Campaign Collection Güncellemesi

```javascript
// campaigns collection
{
  _id: ObjectId,
  title: String,
  description: String,
  content: String,           // ✅ YENİ
  videoUrl: String,          // ✅ YENİ
  imageUrls: [String],       // ✅ YENİ
  maxParticipants: Number,
  participants: Number,       // ✅ YENİ
  currentParticipants: Number, // ✅ YENİ
  reward: Number,
  difficulty: String,
  startDate: Date,
  endDate: Date,
  tags: [String],
  category: String,
  isActive: Boolean,
  questions: Number,         // ✅ YENİ
  estimatedDuration: Number, // ✅ YENİ
  createdAt: Date,
  updatedAt: Date
}
```

### 2. User Progress Collection (YENİ)

```javascript
// user_progress collection
{
  _id: ObjectId,
  userId: ObjectId,
  campaignId: ObjectId,
  joined: Boolean,
  completed: Boolean,
  score: Number,             // 100 olacak - tüm sorular doğru
  timeSpent: Number,         // saniye
  progress: {
    currentQuestion: Number,
    totalQuestions: Number,
    answeredQuestions: [Number],
    correctAnswers: Number,
    wrongAnswers: Number,
    lastActivity: Date
  },
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Campaign Participation Collection (YENİ)

```javascript
// campaign_participants collection
{
  _id: ObjectId,
  campaignId: ObjectId,
  userId: ObjectId,
  joinedAt: Date,
  status: String, // 'active', 'completed', 'abandoned'
  score: Number,             // 100 olacak - tüm sorular doğru
  timeSpent: Number,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Real-time Updates (İsteğe Bağlı)

### WebSocket Events

```javascript
// Campaign participant count updates
socket.on('campaign:participant:update', (data) => {
  // { campaignId, participants, currentParticipants }
});

// User progress updates
socket.on('campaign:progress:update', (data) => {
  // { campaignId, userId, progress, score }
});

// Campaign completion
socket.on('campaign:completed', (data) => {
  // { campaignId, userId, score, timeSpent }
});
```

---

## 📈 Analytics ve Reporting

### 1. Campaign Statistics API

#### **Endpoint:**
```
GET /api/v1/campaigns/:id/statistics
```

#### **Response:**
```javascript
{
  "success": true,
  "data": {
    "campaignId": "campaign_id",
    "totalParticipants": 77,
    "activeParticipants": 65,
    "completedParticipants": 45,
    "completionRate": 58,        // Tamamlanma oranı
    "averageTimeSpent": 300,     // Ortalama süre (saniye)
    "topTimes": [                // En hızlı tamamlayanlar
      { "userId": "user1", "timeSpent": 180 },
      { "userId": "user2", "timeSpent": 200 }
    ],
    "dailyStats": [
      { "date": "2024-12-20", "participants": 10, "completions": 5 },
      { "date": "2024-12-21", "participants": 15, "completions": 8 }
    ]
  }
}
```

---

## 🚀 Implementation Priority

### 🔴 **Yüksek Öncelik (Hemen Gerekli):**
1. `participants` ve `currentParticipants` alanları
2. `userJoined` ve `userCompleted` alanları
3. User Progress API
4. Join Campaign API

### 🟡 **Orta Öncelik (1-2 Hafta):**
1. `userScore` (100% olacak) ve `userTimeSpent` alanları
2. Campaign Detail API güncellemeleri
3. Progress Update API

### 🟢 **Düşük Öncelik (Gelecek):**
1. Real-time updates (WebSocket)
2. Analytics ve reporting
3. Advanced statistics

---

## 📝 Test Cases

### 1. Campaign List Test
```javascript
// Test: Campaign list should include participant count
GET /api/v1/campaigns/all
// Expected: participants field in response
```

### 2. User Progress Test
```javascript
// Test: User progress should be tracked
POST /api/v1/campaigns/:id/join
// Expected: userJoined = true in campaign list
```

### 3. Progress Update Test
```javascript
// Test: Progress should be updated
PUT /api/v1/campaigns/:id/progress
// Expected: userProgress updated in database
```

### 4. Quiz Completion Test
```javascript
// Test: User must answer all questions correctly
PUT /api/v1/campaigns/:id/progress
// Expected: score = 100 when all questions answered correctly
```

---

## 🔧 Frontend Integration Notes

### 1. API Response Mapping
```javascript
// Frontend'de kullanılacak mapping
const mapApiResponse = (apiCampaign) => ({
  ...apiCampaign,
  progressPercentage: Math.round((apiCampaign.participants / apiCampaign.maxParticipants) * 100),
  canJoin: apiCampaign.participants < apiCampaign.maxParticipants && !apiCampaign.userJoined,
  isCompleted: apiCampaign.userCompleted,
  timeRemaining: calculateTimeRemaining(apiCampaign.endDate)
});
```

### 2. Error Handling
```javascript
// Backend'den gelecek hata kodları
const ERROR_CODES = {
  CAMPAIGN_FULL: 'CAMPAIGN_FULL',           // Kontenjan dolu
  ALREADY_JOINED: 'ALREADY_JOINED',         // Zaten katılmış
  CAMPAIGN_NOT_ACTIVE: 'CAMPAIGN_NOT_ACTIVE', // Kampanya aktif değil
  CAMPAIGN_EXPIRED: 'CAMPAIGN_EXPIRED',     // Kampanya süresi dolmuş
  USER_NOT_FOUND: 'USER_NOT_FOUND',         // Kullanıcı bulunamadı
  QUIZ_NOT_COMPLETED: 'QUIZ_NOT_COMPLETED', // Quiz tamamlanmamış
  INVALID_CAMPAIGN: 'INVALID_CAMPAIGN'      // Geçersiz kampanya
};

// Frontend'de kullanılacak hata mesajları
const ERROR_MESSAGES = {
  CAMPAIGN_FULL: 'Kampanya kontenjanı dolmuştur. Lütfen başka bir kampanya seçin.',
  ALREADY_JOINED: 'Bu kampanyaya zaten katılmışsınız.',
  CAMPAIGN_NOT_ACTIVE: 'Bu kampanya henüz başlamamış veya bitmiş.',
  CAMPAIGN_EXPIRED: 'Bu kampanya süresi dolmuş.',
  USER_NOT_FOUND: 'Kullanıcı bilgileriniz bulunamadı.',
  QUIZ_NOT_COMPLETED: 'Quiz tamamlanmamış. Lütfen tüm soruları cevaplayın.',
  INVALID_CAMPAIGN: 'Geçersiz kampanya.'
};
```

### 3. Quiz Logic Notes
```javascript
// Quiz tamamlama mantığı
const quizLogic = {
  // Kullanıcı tüm soruları doğru cevaplamadan bitiremez
  mustAnswerAllCorrectly: true,
  
  // Skor her zaman 100% olacak (tüm sorular doğru)
  scoreAlways100: true,
  
  // Yanlış cevap cezası: 20 saniye bekleme
  penaltyForWrongAnswer: 20, // saniye
  
  // Doğru cevaplayana kadar aynı soruda kalır
  stayOnSameQuestionUntilCorrect: true
};
```

### 4. Backend Join Campaign Logic
```javascript
// Backend'de Join Campaign işlemi
const joinCampaignLogic = {
  // 1. Kampanya varlığını kontrol et
  checkCampaignExists: true,
  
  // 2. Kampanya aktif mi kontrol et
  checkCampaignActive: true,
  
  // 3. Kullanıcı zaten katılmış mı kontrol et
  checkUserAlreadyJoined: true,
  
  // 4. Kontenjan dolu mu kontrol et
  checkCampaignFull: true,
  
  // 5. Katılımcı sayısını artır
  incrementParticipants: true,
  
  // 6. User progress kaydı oluştur
  createUserProgress: true,
  
  // 7. Başarılı response döndür
  returnSuccessResponse: true
};

// Backend validation sırası
const validationOrder = [
  'campaign_exists',
  'campaign_active', 
  'user_not_already_joined',
  'campaign_not_full'
];
```

---

## 📞 İletişim

**Frontend Geliştirici:** [İletişim Bilgileri]  
**Backend Geliştirici:** [İletişim Bilgileri]  
**Proje Yöneticisi:** [İletişim Bilgileri]  

---

**Son Güncelleme:** 2024-12-20  
**Versiyon:** 1.2  
**Durum:** Backend Geliştirici İncelemesi Bekleniyor