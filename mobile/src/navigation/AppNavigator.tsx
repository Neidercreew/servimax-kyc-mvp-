import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import ContactDataScreen from '../screens/ContactDataScreen';
import DocumentCaptureScreen from '../screens/DocumentCaptureScreen';

export type RootStackParamList = {
  Welcome: undefined;
  ContactData: undefined;
  DocumentCapture: { applicationId: number };
  DocumentReview: { applicationId: number };
};


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="ContactData" component={ContactDataScreen} />
        <Stack.Screen name="DocumentCapture" component={DocumentCaptureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}
/*todo relacionado a pantallas y navegacion, se crea un stack navigator 
para poder navegar entre pantallas. el navigation container es el contenedor principal de la app,
y el stack navigator es el que maneja la navegacion entre pantallas. el screen options es para ocultar el header de cada pantalla.*/
