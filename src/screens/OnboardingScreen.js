import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({ navigation }) => {
  const handleDone = async () => {
    await AsyncStorage.setItem('onboardingSeen', 'true');
    navigation.replace('Auth');
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      transitionAnimationDuration={400}
      showSkip={true}
      bottomBarHighlight={false}
      nextLabel={<Text style={{ color: '#fff', fontWeight: 'bold' }}>Next</Text>}
      skipLabel={<Text style={{ color: '#fff', fontWeight: 'bold' }}>Skip</Text>}
      doneLabel={<Text style={{ color: '#fff', fontWeight: 'bold' }}>Start</Text>}
      pages={[
        {
          backgroundColor: '#000',
          image: (
            <Image
              source={require('../../assets/onboard/onboard.png')}
              style={{ width: 200, height: 200 }}
            />
          ),
          title: (
            <Text style={{ fontSize: 24, color: '#6854dd', fontWeight: 'bold', textAlign: 'center' }}>
              Learn Blockchain, Earn Rewards!
            </Text>
          ),
          subtitle: (
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Take lessons – Pass quizzes – Earn tokens
            </Text>
          ),
        },
        {
          backgroundColor: '#000',
          image: (
            <Image
              source={require('../../assets/onboard/onboard.png')}
              style={{ width: 200, height: 200 }}
            />
          ),
          title: (
            <Text style={{ fontSize: 24, color: '#6854dd', fontWeight: 'bold', textAlign: 'center' }}>
              Multi-Wallet Connection
            </Text>
          ),
          subtitle: (
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Connect up to 3 wallets per network – Choose your EVM wallet for airdrops
            </Text>
          ),
        },
        {
          backgroundColor: '#000',
          image: (
            <Image
              source={require('../../assets/onboard/onboard.png')}
              style={{ width: 200, height: 200 }}
            />
          ),
          title: (
            <Text style={{ fontSize: 24, color: '#6854dd', fontWeight: 'bold', textAlign: 'center' }}>
              Earn While You Learn
            </Text>
          ),
          subtitle: (
            <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
              Sign in or register, start using immediately
            </Text>
          ),
        },
      ]}
    />
  );
};

export default OnboardingScreen;
