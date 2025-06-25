export const QUIZ_DATA = [
  {
    id: 1,
    question: "What does DeFi stand for?",
    options: [
      "Decentralized Finance",
      "Digital Finance",
      "Blockchain Network",
      "Crypto Wallet Type"
    ],
    correctAnswer: 0,
    explanation: "DeFi is the reconstruction of traditional financial systems in a decentralized manner on blockchain."
  },
  {
    id: 2,
    question: "What is the main purpose of Layer 2 solutions?",
    options: [
      "Price stability",
      "Scalability and speed improvement",
      "Reducing security",
      "Price stability provision"
    ],
    correctAnswer: 1,
    explanation: "Layer 2 solutions work on top of the main blockchain, increasing transaction speed and reducing costs."
  },
  {
    id: 3,
    question: "What do Smart Contracts do?",
    options: [
      "Mining crypto",
      "Automatic agreement execution",
      "Website design",
      "Graphic design"
    ],
    correctAnswer: 1,
    explanation: "Smart contracts are digital agreements that automatically execute when predetermined conditions are met."
  },
  {
    id: 4,
    question: "What is a blockchain?",
    options: [
      "A type of cryptocurrency",
      "A distributed ledger technology",
      "A mining algorithm",
      "A wallet application"
    ],
    correctAnswer: 1,
    explanation: "Blockchain is a distributed ledger technology that stores data in blocks linked together in a chain."
  },
  {
    id: 5,
    question: "What is the purpose of cryptocurrency mining?",
    options: [
      "Creating new wallets",
      "Validating transactions and creating new blocks",
      "Storing private keys",
      "Designing user interfaces"
    ],
    correctAnswer: 1,
    explanation: "Mining is the process of validating transactions on the blockchain network and creating new blocks."
  },
  {
    id: 6,
    question: "What is a private key?",
    options: [
      "Public wallet address",
      "Secret code that controls cryptocurrency funds",
      "Transaction hash",
      "Smart contract code"
    ],
    correctAnswer: 1,
    explanation: "A private key is a secret code that allows you to access and control your cryptocurrency funds."
  },
  {
    id: 7,
    question: "What does NFT stand for?",
    options: [
      "New Financial Technology",
      "Non-Fungible Token",
      "Network File Transfer",
      "Next Future Tech"
    ],
    correctAnswer: 1,
    explanation: "NFT stands for Non-Fungible Token, representing unique digital assets on blockchain."
  },
  {
    id: 8,
    question: "What is a cryptocurrency wallet?",
    options: [
      "A physical money container",
      "Software for storing and managing cryptocurrencies",
      "A mining device",
      "A trading platform"
    ],
    correctAnswer: 1,
    explanation: "A cryptocurrency wallet is software that allows you to store, send, and receive cryptocurrencies."
  },
  {
    id: 9,
    question: "What is consensus mechanism?",
    options: [
      "A trading strategy",
      "A method for network participants to agree on transactions",
      "A wallet security feature",
      "A price prediction algorithm"
    ],
    correctAnswer: 1,
    explanation: "Consensus mechanism is a method used by blockchain networks to agree on the validity of transactions."
  },
  {
    id: 10,
    question: "What is gas fee in Ethereum?",
    options: [
      "Mining reward",
      "Transaction processing fee",
      "Staking reward",
      "Exchange commission"
    ],
    correctAnswer: 1,
    explanation: "Gas fee is the cost required to execute transactions and smart contracts on the Ethereum network."
  }
];

export const QUIZ_CONFIG = {
  timeLimit: 600, // 10 minutes in seconds
  passingScore: 70, // Percentage
  questionsToShow: 10,
  shuffleQuestions: false,
  shuffleOptions: true
}; 