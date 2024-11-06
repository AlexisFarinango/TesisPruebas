import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import ModulosDocentes from "./screens/ModulesTeacher";
import RegistrarAsistencias from "./screens/RegisterAcademicPerformance";
import DetalleActuacionDocente from "./screens/RegAcademicPerfdescription";




enableScreens();


const TeacherStack = createNativeStackNavigator();

export default function TeacherNavigation(){
    return(
        <TeacherStack.Navigator>
            <TeacherStack.Screen name="Modulos" component={ModulosDocentes} options={{headerShown: false}}/>
            <TeacherStack.Screen name="Ver Actuaciones" component={RegistrarAsistencias} options={{headerShown: false}}/>
            <TeacherStack.Screen name="Detalle Registro Actuacion" component={DetalleActuacionDocente} options={{headerShown: false}}/>
        </TeacherStack.Navigator>
    );
}
