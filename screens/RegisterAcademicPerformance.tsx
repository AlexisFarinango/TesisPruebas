import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Modal } from "react-native";


export default function RegistrarAsistencias() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#f4f4f4",
        },
        title: {
            fontSize: 24,
            padding: 20,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
        },
        tableContainer: {
            marginBottom: 20,
        },
        tableHeader: {
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: 10,
            backgroundColor: "#003366", // Azul oscuro
            borderRadius: 5,
        },
        headerText: {
            color: "#fff", // Letras blancas
            fontWeight: "bold",
            fontSize: 14,
            width: 70,  // Ancho de cada columna (ajustable según necesidad)
            textAlign: "center",
        },
        headertableText: {
            color: "#fff", // Letras blancas
            fontWeight: "bold",
            fontSize: 14,
            width:125,  // Ancho de cada columna (ajustable según necesidad)
            textAlign: "center",
        },
        tableRow: {
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: 10,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        rowText: {
            fontSize: 14,
            width: 125,  // Ancho de cada columna (ajustable según necesidad)
            textAlign: "center",
        },
        button: {
            backgroundColor: "#cc0605", // Rojo
            paddingVertical: 15,
            borderRadius: 10,
            alignItems: "center",
            alignSelf: "center",
            width: "50%", // Tamaño del botón
        },
        buttonText: {
            color: "#fff", // Letras blancas
            fontSize: 16,
            fontWeight: "bold",
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
        barNavicon: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
        },
        card: {
            backgroundColor: '#3373bd',
            flex: 1,
            margin: 10,
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
    
        },
        highlight: {
            backgroundColor: '#FFEBB0',
        },
        cardText: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        grid: {
            paddingHorizontal: 20,
        },
        row: {
            justifyContent: 'space-between',
        },
    });
    

    const data = [
        { id: 1, title: 'Química', screen:'Detalle Registro Actuacion'},
        { id: 2, title: 'Matemáticas',screen:'Detalle Registro Actuacion'},
        { id: 3, title: 'Física', screen:'Detalle Registro Actuacion'},
    ];
    const navigation=useNavigation();
    const renderItem = ({ item }) => (
        <TouchableOpacity style={[styles.card, item.highlight && styles.highlight]} onPress={()=>navigation.navigate(item.screen, {materiaId: item.id})}>
            <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actuaciones</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
            />
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Modulos')}>
                    <Image source={require('../icons/inicio.png')} style={styles.barNavicon}/>
                    <Text style={styles.navText}>Inicio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Ver Actuaciones')}>
                    <Image source={require('../icons/asistencias.png')} style={styles.barNavicon}/>
                    <Text style={styles.navText}>Actuaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={()=>navigation.navigate('Iniciar Sesion')}>
                    <Image source={require('../icons/cerrarsesion.png')} style={styles.barNavicon}/>
                    <Text style={styles.navText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
