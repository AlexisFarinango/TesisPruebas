import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen(){
    const navigation = useNavigation()

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bienvenido a la pantalla principal</Text>
        <Button
        title="Ir a Iniciar Sesión"
        onPress={() => navigation.navigate("Iniciar Sesion")}
        />
        </View>
    );
}
