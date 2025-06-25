export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "DeFi (Decentralized Finance) nedir?",
    options: [
      "Merkezi olmayan finans sistemi",
      "Dijital para birimi",
      "Blockchain ağı",
      "Kripto cüzdan türü"
    ],
    correctAnswer: 0,
    explanation: "DeFi, geleneksel finans sistemlerinin blockchain üzerinde merkezi olmayan şekilde yeniden inşa edilmesidir."
  },
  {
    id: 2,
    question: "Layer 2 çözümlerinin ana amacı nedir?",
    options: [
      "Yeni coin yaratmak",
      "Ölçeklenebilirlik ve hız artışı",
      "Güvenlik azaltmak",
      "Fiyat istikrarı sağlamak"
    ],
    correctAnswer: 1,
    explanation: "Layer 2 çözümleri ana blockchain'in üzerinde çalışarak işlem hızını artırır ve maliyetleri düşürür."
  },
  {
    id: 3,
    question: "Smart Contract'lar ne işe yarar?",
    options: [
      "Sadece para transferi",
      "Otomatik anlaşma yürütme",
      "Veri depolama",
      "Grafik tasarım"
    ],
    correctAnswer: 1,
    explanation: "Smart contract'lar, önceden belirlenen koşullar gerçekleştiğinde otomatik olarak çalışan dijital anlaşmalardır."
  },
  {
    id: 4,
    question: "Yield Farming nedir?",
    options: [
      "Tarım ürünleri satışı",
      "Kripto madenciliği",
      "DeFi protokollerinde getiri kazanma",
      "NFT koleksiyonu"
    ],
    correctAnswer: 2,
    explanation: "Yield Farming, DeFi protokollerine likidite sağlayarak token ödülleri kazanma stratejisidir."
  },
  {
    id: 5,
    question: "UniDEX platformunun temel özelliği nedir?",
    options: [
      "Sosyal medya platformu",
      "Merkezi olmayan borsa (DEX)",
      "Video oyunu",
      "Haber sitesi"
    ],
    correctAnswer: 1,
    explanation: "UniDEX, kullanıcıların kripto varlıklarını doğrudan takas edebileceği merkezi olmayan bir borsadır."
  }
];

export const QUIZ_CONFIG = {
  defaultTime: 300, // 5 dakika
  passPercentage: 70,
  timeWarning: 60, // Son 1 dakika uyarısı
}; 