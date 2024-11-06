import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import Materias from "./screens/Courses";
import PerfilEstudiante from "./screens/ProfileStudent";
import Asistencias from "./screens/Attendance";
import Participaciones from "./screens/AcademicPerformance";
import ModulosEstudiantes from "./screens/ModulesStudent";
import DetallesActuaciones from "./screens/AcademicPerformanceDetails";


enableScreens();


const StudentStack = createNativeStackNavigator();

export default function StudentNavigation(){
    return(
        <StudentStack.Navigator>
            <StudentStack.Screen name="Modulos" component={ModulosEstudiantes} options={{headerShown: false}}/>
            <StudentStack.Screen name="Perfil" component={PerfilEstudiante} options={{headerShown: false}}/>
            <StudentStack.Screen name="Ver Cursos" component={Materias} options={{headerShown: false}}/>
            <StudentStack.Screen name="Ver Asistencias" component={Asistencias} options={{headerShown: false}}/>
            <StudentStack.Screen name="Ver Actuaciones" component={Participaciones} options={{headerShown: false}}/>
            <StudentStack.Screen name="Detalles Actuaciones" component={DetallesActuaciones} options={{headerShown: false}}/>
        </StudentStack.Navigator>
    )
}

