import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_BACKEND } from '@env';

export default function DetallesActuaciones() {
    const [fechas, setFechas] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [totalactuaciones, setTotalactuaciones] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDescriptions, setSelectedDescriptions] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { materia, paralelo, semestre } = route.params;

    const obtenerActuaciones = async (materia, paralelo, semestre) => {
        const token = await AsyncStorage.getItem("userToken");
        try {
            const response = await axios.post(`${API_URL_BACKEND}/estudiante/visualizar-actuaciones`, {
                materia: materia,
                paralelo: paralelo,
                semestre: semestre
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setFechas(response.data.fecha_actuaciones);
            setDetalles(response.data.descripciones);
            console.log("datitos", response.data.descripciones);
            setTotalactuaciones(response.data.cantidad_actuaciones);

        } catch (error) {
            console.log("Error al obtener actuaciones:", error);
        }
    };

    useEffect(() => {
        obtenerActuaciones(materia, paralelo, semestre);
    }, []);

    const handleDescriptionPress = (index) => {
        const descripciones = detalles[index];
        console.log("Presionado:", detalles[index]);
        console.log("Presionado:", detalles.length);

        if (descripciones && descripciones.length > 0) {
            setSelectedDescriptions(descripciones);
            setModalVisible(true);
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item}</Text>
            <TouchableOpacity onPress={() => handleDescriptionPress(index)}>
                <Text style={[
                    styles.tableCell,
                    detalles[index] && detalles[index].length > 0 ? styles.link : styles.noLink
                ]}>
                    {detalles[index] && detalles[index].length > 0 ? 'Ver Descripción' : 'Sin Descripción'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle Actuaciones{"\n"} Semestre {semestre}</Text>
            {/* <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    <Text style={styles.tableHeader}>Fecha</Text>
                    <Text style={styles.tableHeader}>Descripciones</Text>
                </View>
                <FlatList
                    data={fechas}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flexGrow: 1 }}
                />
            </View>
            <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeaderRow]}>
                    <Text style={styles.tableHeader}>Actuaciones Totales: {totalactuaciones}</Text>
                </View>
            </View> */}
            {fechas.length === 0 ? (
                <Text style={styles.noDataText}>No existen Actuaciones por el momento</Text>
            ) : (
                <>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeaderRow]}>
                            <Text style={styles.tableHeader}>Fecha</Text>
                            <Text style={styles.tableHeader}>Descripciones</Text>
                        </View>
                        <FlatList
                            data={fechas}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flexGrow: 1 }}
                        />
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeaderRow]}>
                            <Text style={styles.tableHeader}>Actuaciones Totales: {totalactuaciones}</Text>
                        </View>
                    </View>
                </>
            )}



            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Regresar</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Descripciones</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeaderRow]}>
                                <Text style={styles.tableHeader}>Descripciones</Text>
                            </View>
                            {selectedDescriptions.length > 0 ? (
                                Array.isArray(selectedDescriptions) ? (
                                    selectedDescriptions.map((descripcion, index) => (
                                        <View key={index} style={styles.tableRow}>
                                            <Text style={styles.tableCell}>{descripcion}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{selectedDescriptions}</Text>
                                    </View>
                                )
                            ) : (
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCell}>Sin descripciones</Text>
                                </View>
                            )}

                        </View>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        padding: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    link: {
        color: '#4A90E2',
        fontWeight: 'bold',
    },
    noLink: {
        color: '#ccc',
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#4A90E2',
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: '80%',
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    table: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableHeaderRow: {
        backgroundColor: '#4A90E2',
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#cc0605',
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
        textAlign: 'center',
        marginVertical: 20,
    },
});
