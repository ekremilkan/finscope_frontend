import React from 'react';
import { Text } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// Constants and Utils
import { ONBOARDING_PAGES, ONBOARDING_CONFIG } from '../constants/onboardingConstants';
import { handleOnboardingComplete } from '../utils/onboardingUtils';

// Components
import OnboardingPage from '../components/Onboarding/OnboardingPage';

const OnboardingScreen = ({ navigation }) => {
  const onComplete = () => handleOnboardingComplete(navigation);

  // Transform pages using the component
  const transformedPages = ONBOARDING_PAGES.map(page => 
    OnboardingPage({ page })
  );

  return (
    <Onboarding
      onDone={onComplete}
      onSkip={onComplete}
      transitionAnimationDuration={ONBOARDING_CONFIG.transitionAnimationDuration}
      showSkip={ONBOARDING_CONFIG.showSkip}
      bottomBarHighlight={ONBOARDING_CONFIG.bottomBarHighlight}
      nextLabel={
        <Text style={ONBOARDING_CONFIG.buttonStyle}>
          {ONBOARDING_CONFIG.labels.next}
        </Text>
      }
      skipLabel={
        <Text style={ONBOARDING_CONFIG.buttonStyle}>
          {ONBOARDING_CONFIG.labels.skip}
        </Text>
      }
      doneLabel={
        <Text style={ONBOARDING_CONFIG.buttonStyle}>
          {ONBOARDING_CONFIG.labels.done}
        </Text>
      }
      pages={transformedPages}
    />
  );
};

export default OnboardingScreen;
