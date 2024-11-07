import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from 'react-native-screens';
import Login from "./screens/Login";
import HomeScreen from "./screens/HomeScreen";
import RegistroEstudiante from "./screens/RegisterScreen";
import RecuperarContra from "./screens/RecoverPassword";
import StudentNavigation from "./RoutesStudent";
import TeacherNavigation from "./RoutesTeacher";
import { AuthProvider } from './context/AuthContext'; // Ajusta la ruta según tu estructura
import { GestureHandlerRootView } from 'react-native-gesture-handler';


enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    // </GestureHandlerRootView>
  );
}

const MainApp = () => {
  const [initialRoute, setInitialRoute] = useState("Home");



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Iniciar Sesion" component={Login} />
        <Stack.Screen name="Registro" component={RegistroEstudiante} />
        <Stack.Screen name="Recuperar Contraseña" component={RecuperarContra} />
        <Stack.Screen name="Docente" component={TeacherNavigation} options={{headerShown: false}}/>
        <Stack.Screen name="Estudiante" component={StudentNavigation} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
