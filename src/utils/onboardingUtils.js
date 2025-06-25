import AsyncStorage from '@react-native-async-storage/async-storage';

export const handleOnboardingComplete = async (navigation) => {
  try {
    await AsyncStorage.setItem('onboardingSeen', 'true');
    navigation.replace('Auth');
  } catch (error) {
    console.error('Error saving onboarding completion:', error);
    // Fallback: Still navigate even if storage fails
    navigation.replace('Auth');
  }
};

export const checkOnboardingStatus = async () => {
  try {
    const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
    return onboardingSeen === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}; 