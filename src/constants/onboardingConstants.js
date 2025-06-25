export const ONBOARDING_PAGES = [
  {
    id: 1,
    backgroundColor: '#0f172a',
    image: require('../../assets/onboard/onboard1.png'),
    title: 'Learn Blockchain, Earn Rewards!',
    subtitle: 'Take lessons – Pass quizzes – Earn tokens',
  },
  {
    id: 2,
    backgroundColor: '#0f172a',
    image: require('../../assets/onboard/onboard2.png'),
    title: 'Multi-Wallet Connection',
    subtitle: 'Connect up to 3 wallets per network – Choose your EVM wallet for airdrops',
  },
  {
    id: 3,
    backgroundColor: '#0f172a',
    image: require('../../assets/onboard/onboard3.png'),
    title: 'Earn While You Learn',
    subtitle: 'Sign in or register, start using immediately',
  },
];

export const ONBOARDING_CONFIG = {
  transitionAnimationDuration: 400,
  showSkip: true,
  bottomBarHighlight: false,
  imageSize: { width: 200, height: 200 },
  titleStyle: {
    fontSize: 24,
    color: '#6854dd',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitleStyle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  buttonStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labels: {
    next: 'Next',
    skip: 'Skip',
    done: 'Start',
  },
}; 