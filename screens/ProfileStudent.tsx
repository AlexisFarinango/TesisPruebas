import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, PermissionsAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchCamera } from 'react-native-image-picker';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_URL_BACKEND } from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAvoidingView, Platform } from 'react-native';

const formatearfecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PerfilEstudiante() {
    const navigation = useNavigation();
    const { userData, datosusuario } = useContext(AuthContext);

    const [form, setForm] = useState({
        id: userData._id,
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        cedula: userData.cedula || "",
        email: userData.email || "",
        direccion: userData.direccion || "",
        ciudad: userData.ciudad || "",
        telefono: userData.telefono || "",
        fechanacimiento: userData.fecha_nacimiento || "",
        fotografia: userData.fotografia || "",
    });
    useEffect(() => {
        if (userData) {
            setForm(prevForm => ({ ...prevForm, fotografia: userData.fotografia }));
        }
    }, [userData]);

    const handleInputChange = (field, value) => {
        setForm(prevForm => ({ ...prevForm, [field]: value }));
    };

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            const formData = new FormData();
            Object.keys(form).forEach((key) => {
                if (key === 'fotografia' || key === 'fotografia') {
                    formData.append('fotografia', {
                        uri: form.fotografia,
                        type: 'fotografia/jpeg',
                        name: 'fotografia.jpg',
                    });
                } else {
                    formData.append(key, form[key]);
                }
            });

            const response = await axios.put(`${API_URL_BACKEND}/estudiante/modificar-perfil/${form.id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            Toast.show({
                type: "success",
                text1: "Actualización Realizada con Éxito",
            });
            // await datosusuario();
               
            setTimeout(() => {
                navigation.navigate("Modulos");
            }, 3000);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error al Actualizar la Información",
            });
            console.error(error);
        }
    };


    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Permiso de Cámara',
                    message: 'La aplicación necesita acceso a la cámara.',
                    buttonNeutral: 'Preguntar luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                launchCamera({ mediaType: 'photo' }, (response) => {
                    if (response.assets) {
                        setForm(prevForm => ({ ...prevForm, fotografia: response.assets[0].uri }));
                    }
                });
            } else {
                console.log('Permiso de cámara denegado');
            }
        } catch (err) {
            console.warn(err);
        }
    };


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
            color: "#003366",
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
            borderColor: "#003366",
        },
        profileSection: {
            marginBottom: 15,
            paddingHorizontal: 10,
        },
        label: {
            fontSize: 18,
            fontWeight: "600",
            color: "#003366",
        },
        info: {
            fontSize: 16,
            color: "#777",
        },
        buttonContainer: {
            marginTop: 30,
        },
        button: {
            backgroundColor: "#003366",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            alignItems: "center",
        },
        buttonpicture: {
            backgroundColor: "#003366",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
            alignItems: "center",
            width: 150,
        },
        buttonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
        },
        input: {
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 15,
            backgroundColor: "#fff",
        },
        statictext: {
            height: 25,
            paddingHorizontal: 0,
            marginBottom: 10,
            backgroundColor: "#fff",
        },
        barNavicon: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
        },
        bottomNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: '#FFF',
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
        },
        navItem: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        navText: {
            fontSize: 12,
            color: '#000',
            marginTop: 5,
        },
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Perfil de Usuario</Text>
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: form.fotografia || "https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752.jpg",
                        }}
                        style={styles.profileImage}
                    />
                </View>
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Foto</Text>
                    <TouchableOpacity style={styles.buttonpicture} onPress={requestCameraPermission}>
                        <Text style={styles.buttonText}>Actualizar Foto</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Nombres:</Text>
                        <TextInput style={styles.input} value={form.nombre} onChangeText={(value) => handleInputChange("nombre", value)} placeholder="Nombres" />
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Apellidos:</Text>
                        <TextInput style={styles.input} value={form.apellido} onChangeText={(value) => handleInputChange("apellido", value)} placeholder="Apellidos" />
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Correo Institucional:</Text>
                        <Text style={styles.statictext}>{form.email}</Text>
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Cédula:</Text>
                        <Text style={styles.statictext}>{form.cedula}</Text>
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <Text style={styles.statictext}>{formatearfecha(form.fechanacimiento)}</Text>
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Dirección:</Text>
                        <TextInput style={styles.input} value={form.direccion} onChangeText={(value) => handleInputChange("direccion", value)} placeholder="Dirección" />
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Ciudad:</Text>
                        <TextInput style={styles.input} value={form.ciudad} onChangeText={(value) => handleInputChange("ciudad", value)} placeholder="Ciudad" />
                    </View>
                    <View style={styles.profileSection}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <TextInput style={styles.input} value={form.telefono} onChangeText={(value) => handleInputChange("telefono", value)} placeholder="Teléfono" />
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Actualizar Información</Text>
                </TouchableOpacity>
                <Toast />
            </View>
            </KeyboardAvoidingView>
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Modulos')}>
                    <Image source={require('../icons/inicio.png')} style={styles.barNavicon} />
                    <Text style={styles.navText}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Ver Cursos')}>
                    <Image source={require('../icons/cursos.png')} style={styles.barNavicon} />
                    <Text style={styles.navText}>Cursos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Ver Asistencias')}>
                    <Image source={require('../icons/asistencias.png')} style={styles.barNavicon} />
                    <Text style={styles.navText}>Asistencias</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Ver Actuaciones')}>
                    <Image source={require('../icons/actuaciones.png')} style={styles.barNavicon} />
                    <Text style={styles.navText}>Actuaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Iniciar Sesion')}>
                    <Image source={require('../icons/cerrarsesion.png')} style={styles.barNavicon} />
                    <Text style={styles.navText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}
