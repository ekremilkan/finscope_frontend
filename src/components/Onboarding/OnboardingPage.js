import { Image, Text, View } from "react-native"
import { ONBOARDING_CONFIG } from "../../constants/onboardingConstants"

const OnboardingPage = ({ page }) => {
  return {
    backgroundColor: page.backgroundColor,
    image: (
      <View style={ONBOARDING_CONFIG.imageContainerStyle}>
        <Image source={page.image} style={ONBOARDING_CONFIG.imageSize} resizeMode="contain" />
      </View>
    ),
    title: <Text style={ONBOARDING_CONFIG.titleStyle}>{page.title}</Text>,
    subtitle: <Text style={ONBOARDING_CONFIG.subtitleStyle}>{page.subtitle}</Text>,
  }
}

export default OnboardingPage
