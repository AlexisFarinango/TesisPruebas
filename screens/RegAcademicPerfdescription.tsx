import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState, useEffect, Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, TextInput } from 'react-native';
import { API_URL_BACKEND } from '@env';
// import { Permissions } from "expo";
import { PermissionsAndroid } from 'react-native';

import Voice from '@react-native-voice/voice';


export default function DetalleActuaciones() {
    const navigation = useNavigation();
    const route = useRoute();
    const { materia, paralelo, semestre } = route.params; // Obtenemos el ID de la materia desde la navegación

    const [actuaciones, setActuaciones] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [currentEstudiante, setCurrentEstudiante] = useState(null);
    const [escuchando,setEscuchando]= useState(false);

    //Permisos para microfono
    // const handleMicrophonePress = async () => {
    //     // Solicitar permisos de micrófono
    //     const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    //     if (status !== "granted") {
    //         console.log("Permiso de micrófono no concedido");
    //         return;
    //     }
    //     console.log("Permiso de micrófono concedido");
    
    //     // Iniciar o detener la grabación según el estado de `escuchando`
    //     escuchando ? stopListening() : startListening();
    // };
    const handleMicrophonePress = async () => {
        try {
            // Solicitar permisos de micrófono en Android
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Permiso para grabar audio",
                    message: "La aplicación necesita acceder al micrófono para grabar audio.",
                    buttonNeutral: "Pregúntame después",
                    buttonNegative: "Cancelar",
                    buttonPositive: "Aceptar"
                }
            );
    
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Permiso de micrófono concedido");
                // Iniciar o detener la grabación según el estado de `escuchando`
                escuchando ? stopListening() : startListening();
            } else {
                console.log("Permiso de micrófono no concedido");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Datos simulados
    const asistenciasSimuladas = [
        {
            curso: '1',
            estudiante: '1',
            estado_asistencias: 'presente',
        },
        {
            curso: '1',
            estudiante: '2',
            estado_asistencias: 'ausente',
        },
        {
            curso: '1',
            estudiante: '3',
            estado_asistencias: 'presente',
        },
        {
            curso: '1',
            estudiante: '4',
            estado_asistencias: 'presente',
        },
        {
            curso: '2',
            estudiante: '1',
            estado_asistencias: 'ausente',
        },
        {
            curso: '2',
            estudiante: '2',
            estado_asistencias: 'ausente',
        },
        {
            curso: '2',
            estudiante: '3',
            estado_asistencias: 'presente',
        },
        {
            curso: '2',
            estudiante: '4',
            estado_asistencias: 'presente',
        },
        {
            curso: '3',
            estudiante: '1',
            estado_asistencias: 'presente',
        },
        {
            curso: '3',
            estudiante: '2',
            estado_asistencias: 'presente',
        },
        {
            curso: '3',
            estudiante: '3',
            estado_asistencias: 'presente',
        },
        {
            curso: '3',
            estudiante: '4',
            estado_asistencias: 'presente',
        },
    ];

    const estudiantesSimulados = [
        { _id: '1', nombre: 'Juan Pérez', },
        { _id: '2', nombre: 'María López', },
        { _id: '3', nombre: 'Carlos Sánchez', },
        { _id: '4', nombre: 'Jorge Perez', }
    ];

    const actuacionesSimuladas = [
        { _id: '1', nombre: 'Juan Pérez', actuacion: 0, descripcion: '' },
        { _id: '2', nombre: 'María López', actuacion: 0, descripcion: '' },
        { _id: '3', nombre: 'Carlos Sánchez', actuacion: 0, descripcion: '' },
        { _id: '4', nombre: 'Jorge Perez', actuacion: 0, descripcion: '' },
    ];

    const updateAsistentes = async (materia, paralelo, semestre) => {
        try {
            const token = await AsyncStorage.getItem("userToken")
            const response = await axios.post(`${API_URL_BACKEND}/actuacion/listar-estudiantes`, {
                materia: materia,
                paralelo: paralelo,
                semestre: semestre
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Agregar la propiedad 'cantiactuacionesactuales' inicializada en 0
            const dataConCantActuaciones = response.data.map((item) => ({
                ...item,
                cantiactuacionesactuales: 0
            }));
            console.log("Datos Actuaciones completo: ", dataConCantActuaciones);

            setActuaciones(dataConCantActuaciones);
        } catch (error) {
            console.log("Error al obtener estudiantes presentes", error);

        }
    }

    // Función para obtener estudiantes que estuvieron presentes en una asistencia simulada
    // const obtenerEstudiantesAsistentes = () => {
    //     const estudiantesPresentesIds = asistenciasSimuladas
    //         .filter(asistencia => asistencia.curso == materia && asistencia.estado_asistencias == 'presente')
    //         .map(asistencia => asistencia.estudiante);
    //     console.log('Estudiantes presentes IDs:', estudiantesPresentesIds); // Verifica el filtrado correcto

    //     const actuacionesDeEstudiantes = actuacionesSimuladas.filter(actuacion =>
    //         estudiantesPresentesIds.includes(actuacion._id)
    //     );
    //     console.log('Actuaciones de estudiantes:', actuacionesDeEstudiantes); // Verifica el resultado final

    //     setActuaciones(actuacionesDeEstudiantes);
    // };



    // Se ejecuta al montar el componente
    useEffect(() => {
        updateAsistentes(materia, paralelo, semestre);
        console.log("Este es el id recibido de materia", materia);

    }, [materia]);

    useEffect(()=>{
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = stopListening;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = error => console.log('onSpeechError:',error);

        return ()=>{
            Voice.destroy ().then(Voice.removeAllListeners);
        }

    },[]);

    const onSpeechStart = event => {
        console.log("Empezando grabación...: ",event);
        
    }

    // const onSpeechEnd = ()=>{};

    const onSpeechResults = (event) => {
        const text = event.value[0];
        setDescripcion(text);
    };

    const startListening = async () => {
        setEscuchando(true);
        try {
            await Voice.start('es-MX');
            console.log("Grabación iniciada");
        } catch (error) {
            console.log("Error al empezar a grabar:", error);
        }
    };

    const stopListening = async()=>{
        try {
            await Voice.stop();
            Voice.removeAllListeners();
            setEscuchando(false);
        } catch (error) {
            console.log("Error al detener la grabación a grabar: ",error);
        }
    }

    // Función para aumentar actuación de un estudiante
    const aumentarActuacion = (id) => {
        setActuaciones((prevActuaciones) =>
            prevActuaciones.map((item) =>
                item.estudiante._id === id && item.cantiactuacionesactuales < 5
                    ? { ...item, cantiactuacionesactuales: item.cantiactuacionesactuales + 1 }
                    : item
            )
        );
    };

    // Función para disminuir actuación de un estudiante
    const disminuirActuacion = (id) => {
        setActuaciones(prevActuaciones =>
            prevActuaciones.map(item =>
                item.estudiante._id === id && item.cantiactuacionesactuales > 0 ? { ...item, cantiactuacionesactuales: item.cantiactuacionesactuales - 1 } : item
            )
        );
    };

    // Función para añadir actuación a todos los estudiantes
    const añadirActuacionATodos = () => {
        setActuaciones(prevActuaciones =>
            prevActuaciones.map(item =>
                item.cantiactuacionesactuales < 5
                    ? { ...item, cantiactuacionesactuales: item.cantiactuacionesactuales + 1 }
                    : item
            )
        );
    };
    // Funciones para el manejo del dictado por voz
    // useEffect(() => {
    //     Voice.onSpeechResults = onSpeechResults;
    //     return () => {
    //         Voice.destroy().then(Voice.removeAllListeners);
    //     };
    // }, []);
    // const iniciarDictado = async () => {
    //     try {
    //         await Voice.start('es-ES');
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };
    //Funciones manejo Modal para dictado por voz
    const abrirModal = (estudiante) => {
        setCurrentEstudiante(estudiante);
        setDescripcion(estudiante.descripcion || '');
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
    };

    const guardarDescripcion = () => {
        setActuaciones(prevActuaciones =>
            prevActuaciones.map(item =>
                item._id === currentEstudiante._id ? { ...item, descripcion: descripcion } : item
            )
        );
        cerrarModal();
    };


    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.estudiante.nombre} {item.estudiante.apellido}</Text>
            <Text style={styles.tableCell}>{item.cantiactuacionesactuales}</Text>
            <View style={styles.actionsCell}>
                {/* Botón para disminuir actuación */}
                <TouchableOpacity onPress={() => disminuirActuacion(item.estudiante._id)}>
                    <Image
                        source={require('../icons/disminuir.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                {/* Botón para aumentar actuación */}
                <TouchableOpacity onPress={() => aumentarActuacion(item.estudiante._id)}>
                    <Image
                        source={require('../icons/aumentar.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>

                {/* Botón del micrófono o acción */}
                <TouchableOpacity onPress={() => abrirModal(item)}>
                    <Image
                        source={require('../icons/microfono.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle Actuaciones</Text>
            {actuaciones.length === 0 ? (
                <Text style={styles.noDataText}>No existen Asistencias por el momento</Text>
            ) : (<>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeaderRow]}>
                        <Text style={styles.tableHeader}>Estudiantes</Text>
                        <Text style={styles.tableHeader}>Actuaciones</Text>
                        <Text style={styles.tableHeader}>Acciones</Text>
                    </View>
                    <FlatList
                        data={actuaciones}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.estudiante._id.toString()}
                    />
                </View>

                {/* Botones de acción */}
                <TouchableOpacity style={styles.buttonAction} onPress={añadirActuacionATodos}>
                    <Text style={styles.buttonText}>Añadir Actuación a todos los estudiantes</Text>
                </TouchableOpacity>
            </>)}
            <TouchableOpacity style={styles.buttonAction} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Regresar y Guardar</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType='slide' transparent={true} onRequestClose={cerrarModal}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir Descripción</Text>
                        <View style={styles.textBoxContainer}>
                            <View style={styles.textBox}>
                                <TextInput value={descripcion} onChangeText={setDescripcion} placeholder='Descripción ...' multiline={true} style={styles.textInput}></TextInput>
                            </View>
                            {/* <TouchableOpacity onPress={iniciarDictado} style={styles.micButton}>
                                <Image source={require('../icons/microfono.png')} style={styles.icon}/>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.micButton} onPress={handleMicrophonePress}>
                                <Image source={require('../icons/microfono.png')} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={guardarDescripcion}>
                            <Text style={styles.addButtonText}>Añadir</Text>
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
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    table: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        padding: 10,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tableHeaderRow: {
        backgroundColor: '#4A90E2',
        borderRadius: 10,
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
    actionsCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 30,   // Tamaño de los iconos
        height: 30,
        marginHorizontal: 5,
    },
    buttonAction: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#4A90E2',
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    textBoxContainer: {
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    textBox: {
        width: '90%',
        height: '80%',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
    },
    micButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#4A90E2',
        padding: 10,
        borderRadius: 30,
    },
    addButton: {
        marginTop: 20,
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
