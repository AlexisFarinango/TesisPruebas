import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { stickyWorkers } from "../metro.config";


export default function PerfilUsuario() {
    const navigation=useNavigation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            padding: 20,
            justifyContent: "center",
        },
        title: {
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: "#003366",  // Azul oscuro
        },
        imageContainer: {
            alignItems: "center",
            marginBottom: 20,
        },
        profileImage: {
            width: 150,
            height: 150,
            borderRadius: 75,
            borderWidth: 3,
            borderColor: "#003366",  // Azul oscuro
        },
        profileSection: {
            marginBottom: 15,
            paddingHorizontal: 10,
        },
        label: {
            fontSize: 18,
            fontWeight: "600",
            color: "#003366",  // Azul oscuro
        },
        info: {
            fontSize: 16,
            color: "#777",
        },
        buttonContainer: {
            marginTop: 30,
        },
        button: {
            backgroundColor: "#003366",  // Azul Oscuro
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            alignItems: "center",
        },
        buttonReturn: {
            backgroundColor: "#cc0605",  // Rojo
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginBottom: 15,
            width:150,
            alignSelf: 'center',
        },
        buttonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        }
    })
    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Perfil de Usuario</Text>
            {/*Imagen Usuario*/}
            <View style={styles.imageContainer}>
                <Image source={{uri: 'https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg'}}
                style={styles.profileImage}
                />
            </View>
            <View>
                <TouchableOpacity style={styles.buttonReturn} onPress={()=>navigation.navigate('Iniciar Sesion')}>
                    <Text style={styles.buttonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
            {/*Informacion Perfil*/}
            <View style={styles.profileSection}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.info}>Alexis Farinango</Text>
            </View>
            <View style={styles.profileSection}>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.info}>alexis@gmail.com</Text>
            </View>
            <View style={styles.profileSection}>
                <Text style={styles.label}>Telefono:</Text>
                <Text style={styles.info}>095881954</Text>
            </View>
            {/*Modulos*/}
            <View style={styles.buttonContainer}>
                {/* <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Actualizar Informacion')}>
                    <Text style={styles.buttonText}>Actualizar Informacion Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Ver Materias')}>
                <Text style={styles.buttonText}> Ver Materias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Ver Asistencias')}>
                    <Text style={styles.buttonText}>Ver Asistencias</Text>                    
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Ver Participaciones')}>
                    <Text style={styles.buttonText}>Ver Participaciones</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

