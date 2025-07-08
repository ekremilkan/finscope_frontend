import React, { useState } from 'react';
import { View } from 'react-native';
import BottomTabNavigator from './TabNavigation/BottomTabNavigator';
import CustomerBottomTabNavigator from './TabNavigation/CustomerBottomTabNavigator';

const MainTabs = () => {
  const [isCustomer, setIsCustomer] = useState(false);

  const handleSwitch = () => {
    setIsCustomer(prev => !prev);
  };

  return (
    <View style={{ flex: 1 }}>
      {isCustomer ? (
        <CustomerBottomTabNavigator onSwitchPress={handleSwitch} />
      ) : (
        <BottomTabNavigator onSwitchPress={handleSwitch} />
      )}
    </View>
  );
};

export default MainTabs;
