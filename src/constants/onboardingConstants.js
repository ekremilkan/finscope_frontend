export const ONBOARDING_PAGES = [
  {
    id: 1,
    backgroundColor: "#0f172a",
    image: require("../../assets/onboard/onboard1.png"),
    title: "Learn Blockchain, Earn Rewards!",
    subtitle:
      "Join the Web3 revolution with Finscope's Learn-to-Earn model. Take quizzes, connect your wallets, and earn crypto rewards while discovering real blockchain projects.",
  },
  {
    id: 2,
    backgroundColor: "#0f172a",
    image: require("../../assets/onboard/onboard2.png"),
    title: "Targeted Marketing for Blockchain Projects",
    subtitle:
      "Reach real, segmented Web3 users based on on-chain behavior. Launch campaigns, monitor performance, and get actionable insights—all in one platform.",
  },
  {
    id: 3,
    backgroundColor: "#0f172a",
    image: require("../../assets/onboard/onboard3.png"),
    title: "Build Your Web3 Network And Join",
    subtitle:
      "Connect with projects, users, and communities that matter. Track your FS Score and grow your influence in the decentralized ecosystem.",
  },
]

export const ONBOARDING_CONFIG = {
  transitionAnimationDuration: 400,
  showSkip: true,
  bottomBarHighlight: false,
  imageSize: {
    width: 280,
    height: 280,
    borderRadius: 140,
    shadowColor: "#6854dd",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  imageContainerStyle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(104, 84, 221, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#6854dd",
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
    color: "#6854dd",
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
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.3,
    paddingHorizontal: 24,
    fontWeight: "400",
  },
  buttonStyle: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: "#6854dd",
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
    done: "Start",
  },
}
