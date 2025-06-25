// AuthStack.js
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen.js';
import HomeScreen from '../../screens/Home/HomeScreen';
import CustomerDashboard from '../../screens/Home/CustomerDashboard';
import QuizScreen from '../../screens/QuizScreen';
import CampaignsScreen from '../../screens/CampaignsScreen';
import CustomerCampaignsScreen from '../../screens/CustomerCampaignsScreen';

const Stack = createStackNavigator();

const AuthStack = ({ initialRoute }) => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#0f172a' },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
    <Stack.Screen name="QuizScreen" component={QuizScreen} />
    <Stack.Screen name="CampaignsScreen" component={CampaignsScreen} />
    <Stack.Screen name="CustomerCampaignsScreen" component={CustomerCampaignsScreen} />
  </Stack.Navigator>
);

export default AuthStack;
