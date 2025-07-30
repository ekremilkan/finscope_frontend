export const ONBOARDING_PAGES = [
  {
    id: 1,
    backgroundColor: "#181818",
    image: require("../../assets/onboard/onboard1.png"),
    title: "Welcome to Finscope",
    subtitle:
      "Discover the future of Web3 learning and earning. Connect your wallets, take quizzes, and earn crypto rewards while exploring real blockchain projects.",
  },
  {
    id: 2,
    backgroundColor: "#181818",
    image: require("../../assets/onboard/onboard2.png"),
    title: "Learn & Earn Model",
    subtitle:
      "Our innovative Learn-to-Earn platform rewards you for your knowledge. Complete educational quizzes, earn tokens, and build your crypto portfolio.",
  },
  {
    id: 3,
    backgroundColor: "#181818",
    image: require("../../assets/onboard/onboard3.png"),
    title: "Connect Your Wallets",
    subtitle:
      "Securely connect multiple wallets to track your assets, participate in campaigns, and receive airdrops from promising blockchain projects.",
  },
  {
    id: 4,
    backgroundColor: "#181818",
    image: require("../../assets/onboard/onboard4.png"),
    title: "Targeted Marketing",
    subtitle:
      "Reach real Web3 users based on on-chain behavior. Launch campaigns, monitor performance, and get actionable insights—all in one platform.",
  },
  {
    id: 5,
    backgroundColor: "#181818",
    image: require("../../assets/onboard/onboard5.png"),
    title: "Build Your Network",
    subtitle:
      "Connect with projects, users, and communities that matter. Track your FS Score and grow your influence in the decentralized ecosystem.",
  },
]

export const ONBOARDING_CONFIG = {
  transitionAnimationDuration: 400,
  showSkip: true,
  bottomBarHighlight: false,
  imageSize: {
    width: 200,
    height: 200,
    borderRadius: 0, // Removed border radius
    shadowColor: "#fbbf24",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainerStyle: {
    width: 240,
    height: 240,
    borderRadius: 0, // Removed border radius
    backgroundColor: "rgba(251, 191, 36, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#fbbf24",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  titleStyle: {
    fontSize: 28,
    color: "#fbbf24",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 36,
    letterSpacing: -0.5,
    paddingHorizontal: 16,
  },
  subtitleStyle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.3,
    paddingHorizontal: 24,
  },
  buttonStyle: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: "#fbbf24",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTextStyle: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  labels: {
    next: "Next",
    skip: "Skip",
    done: "Get Started",
  },
}
