import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// --- EKRANLAR ---
function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🏠 Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>📄 Details Screen</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🔍 Search Screen</Text>
    </View>
  );
}

function ReelsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🎞️ Reels Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>👤 Profile Screen</Text>
    </View>
  );
}

// --- STACK (Home için) ---
function HomeStack({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '🏠 Home',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="menu" size={25} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: '📄 Details' }}
      />
    </Stack.Navigator>
  );
}

// --- BOTTOM TAB ---
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'HomeTab') iconName = 'home-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'Reels') iconName = 'videocam-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: '🏠 Home' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: '🔍 Search' }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{ title: '🎞️ Reels' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: '👤 Profile' }}
      />
    </Tab.Navigator>
  );
}

// --- CUSTOM DRAWER ---
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="🚪 Çıkış Yap"
        onPress={() =>
          Alert.alert('Çıkış Yapılıyor', 'Kullanıcı oturumdan çıkıyor...')
        }
      />
    </DrawerContentScrollView>
  );
}

// --- UYGULAMA ---
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="App"
        screenOptions={{ headerShown: false }}
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="App" component={BottomTabs} />
        <Drawer.Screen name="⚙️ Ayarlar" component={ProfileScreen} />
        <Drawer.Screen name="❓ Yardım" component={ReelsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
