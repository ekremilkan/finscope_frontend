import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../LoginScreen';
import RegisterScreen from '../../RegisterScreen';
import HomeScreen from '../../screens/Home/HomeScreen';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#1a2b6d' } 
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export default AuthStack;