import React from 'react';
import { Image, Text } from 'react-native';
import { ONBOARDING_CONFIG } from '../../constants/onboardingConstants';

const OnboardingPage = ({ page }) => {
  return {
    backgroundColor: page.backgroundColor,
    image: (
      <Image
        source={page.image}
        style={ONBOARDING_CONFIG.imageSize}
        resizeMode="contain"
      />
    ),
    title: (
      <Text style={ONBOARDING_CONFIG.titleStyle}>
        {page.title}
      </Text>
    ),
    subtitle: (
      <Text style={ONBOARDING_CONFIG.subtitleStyle}>
        {page.subtitle}
      </Text>
    ),
  };
};

export default OnboardingPage; 