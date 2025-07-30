import React from 'react';
import { Text, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// Constants and Utils
import { ONBOARDING_PAGES, ONBOARDING_CONFIG } from '../constants/onboardingConstants';
import { handleOnboardingComplete } from '../utils/onboardingUtils';

// Components
import OnboardingPage from '../components/Onboarding/OnboardingPage';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const onComplete = () => handleOnboardingComplete(navigation);

  // Transform pages using the component
  const transformedPages = ONBOARDING_PAGES.map(page => 
    OnboardingPage({ page })
  );

  // Responsive button styles
  const responsiveButtonStyle = {
    paddingHorizontal: Math.max(32, width * 0.08),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: "#fbbf24",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    minWidth: Math.max(100, width * 0.25),
    alignItems: "center",
    justifyContent: "center",
  };

  const responsiveButtonTextStyle = {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    letterSpacing: 0.5,
  };

  return (
    <Onboarding
      onDone={onComplete}
      onSkip={onComplete}
      transitionAnimationDuration={ONBOARDING_CONFIG.transitionAnimationDuration}
      showSkip={ONBOARDING_CONFIG.showSkip}
      bottomBarHighlight={ONBOARDING_CONFIG.bottomBarHighlight}
      nextLabel={
        <Text style={[responsiveButtonStyle, responsiveButtonTextStyle]}>
          {ONBOARDING_CONFIG.labels.next}
        </Text>
      }
      skipLabel={
        <Text style={[responsiveButtonStyle, responsiveButtonTextStyle]}>
          {ONBOARDING_CONFIG.labels.skip}
        </Text>
      }
      doneLabel={
        <Text style={[responsiveButtonStyle, responsiveButtonTextStyle]}>
          {ONBOARDING_CONFIG.labels.done}
        </Text>
      }
      pages={transformedPages}
    />
  );
};

export default OnboardingScreen;
