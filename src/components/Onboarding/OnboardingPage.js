import { Image, Text, View, Dimensions } from "react-native"
import { ONBOARDING_CONFIG } from "../../constants/onboardingConstants"

const { width, height } = Dimensions.get('window');

const OnboardingPage = ({ page }) => {
  // Responsive sizing
  const responsiveImageSize = {
    width: Math.min(200, width * 0.5),
    height: Math.min(200, width * 0.5),
    borderRadius: 0, // Removed border radius
  };

  const responsiveContainerSize = {
    width: Math.min(240, width * 0.6),
    height: Math.min(240, width * 0.6),
    borderRadius: 0, // Removed border radius
    backgroundColor: "rgba(251, 191, 36, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Math.max(20, height * 0.025),
    shadowColor: "#fbbf24",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  };

  const responsiveTitleStyle = {
    fontSize: Math.max(20, Math.min(28, width * 0.07)),
    color: "#fbbf24",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Math.max(12, height * 0.015),
    lineHeight: Math.max(24, Math.min(36, width * 0.09)),
    letterSpacing: -0.5,
    paddingHorizontal: Math.max(12, width * 0.04),
  };

  const responsiveSubtitleStyle = {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: "rgba(255,255,255,0.85)",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: Math.max(20, Math.min(24, width * 0.06)),
    letterSpacing: 0.3,
    paddingHorizontal: Math.max(16, width * 0.06),
  };

  return {
    backgroundColor: page.backgroundColor,
    image: (
      <View style={responsiveContainerSize}>
        <Image 
          source={page.image} 
          style={responsiveImageSize} 
          resizeMode="contain" 
        />
      </View>
    ),
    title: <Text style={responsiveTitleStyle}>{page.title}</Text>,
    subtitle: <Text style={responsiveSubtitleStyle}>{page.subtitle}</Text>,
  }
}

export default OnboardingPage
