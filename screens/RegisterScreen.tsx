import React, { useState } from "react";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TouchableOpacity, Button, Image, PermissionsAndroid, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { launchCamera } from "react-native-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "axios";
import { API_URL_BACKEND } from '@env'
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

// Esquema de validación con Yup
const validacionForm = Yup.object().shape({
    nombre: Yup.string().trim().matches(/^[A-Za-zñÑ\s]+$/, 'El nombre solo puede contener letras').required('Nombre Obligatorio').max(40, 'El nombre no puede tener más de 40 caracteres').min(3, "Debe existir un minimo de 3 caracteres"),
    apellido: Yup.string().trim().matches(/^[A-Za-zñÑ\s]+$/, 'El apellido solo puede contener letras').required('Apellido Obligatorio').max(40, 'El apellido no puede tener más de 40 caracteres').min(3, "Debe existir un minimo de 3 caracteres"),
    cedula: Yup.string().trim().matches(/^[0-9]+$/, 'La cédula solo puede contener números').required('Cedula Obligatoria').max(10, 'La cédula no puede tener más de 10 caracteres').min(10, "Completa tu cédula"),
    email: Yup.string().trim().required('Correo Institucional Obligatorio').email("Debe ser un correo válido").matches(
        /@(epn\.edu\.ec)$/i,
        'El correo debe ser institucional: @epn.edu.ec'
    ).min(3, "Debe existir un minimo de 3 caracteres"),
    password: Yup.string().trim().required('Contraseña Obligatoria').min(8, "Debe existir un minimo de 8 caracteres"),
    fecha_nacimiento: Yup.string().required("Fecha de Nacimiento Obligatoria"),
    direccion: Yup.string().trim().required('Dirección Obligatoria').max(30, 'La dirección no puede tener más de 30 caracteres').min(3, "Debe existir un minimo de 3 caracteres"),
    ciudad: Yup.string().trim().matches(/^[A-Za-zñÑ\s]+$/, 'La ciudad solo puede contener letras').required('Ciudad Obligatoria').max(30, 'La ciudad no puede tener más de 30 caracteres').min(3, "Debe existir un minimo de 3 caracteres"),
    telefono: Yup.string().trim().matches(/^[0-9]+$/, 'El teléfono solo puede contener números').required('Teléfono Obligatorio').max(10, 'El teléfono no puede tener más de 10 caracteres').min(10, "Completa tu número de teléfono"),
    fotografia: Yup.mixed().required('Debes capturar una imagen.'),
});





export default function RegistroEstudiante() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();
    const [imageError, setImageError] = useState('');


    // Solicitar permiso de cámara y capturar foto
    const requestCameraPermission = async (setFieldValue) => {
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
                console.log('Permiso de cámara otorgado');
                launchCamera({ mediaType: 'photo' }, (response) => {
                    if (response.didCancel) {
                        console.log('Usuario canceló la cámara');
                    } else if (response.error) {
                        console.log('Error al lanzar la cámara:', response.error);
                    } else {
                        console.log('Foto capturada:', response.assets[0]);
                        const image = response.assets[0];
                        setSelectedImage(image.uri); // Muestra la imagen en la vista
                        setFieldValue('fotografia', image); // Asigna la imagen al formulario
                    }
                });
            } else {
                console.log('Permiso de cámara denegado');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = async (values) => {
        console.log(values.fotografia.uri);
        
        if (!values.fotografia?.uri) {
            Toast.show({
                type: "error",
                text1: "No se ha capturado una fotografía"
            }); // Establecer mensaje de error
            console.log("No se ha capturado una fotografía");
            
            return; // Detener el envío si no hay imagen
        } else {
            setImageError(''); // Limpiar el mensaje de error si hay imagen
        }
        const formData = new FormData();
        formData.append('nombre', values.nombre);
        formData.append('apellido', values.apellido);
        formData.append('cedula', values.cedula);
        formData.append('email', values.email);
        formData.append('password', `EST${values.password}`);
        // formData.append('fecha_nacimiento', values.fecha_nacimiento);
        const fecha = new Date(values.fecha_nacimiento);
        const formattedDate = `${fecha.getFullYear()}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${String(fecha.getDate()).padStart(2, '0')}`;
        formData.append('fecha_nacimiento', formattedDate);
        formData.append('direccion', values.direccion);
        formData.append('ciudad', values.ciudad);
        formData.append('telefono', values.telefono);
        formData.append('fotografia', {
            uri: values.fotografia.uri,
            type: values.fotografia.type,
            name: values.fotografia.fileName || `photo_${Date.now()}.jpg`,
        });

        console.log("formulario: ", JSON.stringify(formData, null, 2));

        // Aquí puedes realizar la petición al backend usando Axios o Fetch
        // Ejemplo:
        console.log("ruta", `${API_URL_BACKEND}/estudiante/registro-estudiante`);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            let response = await axios.post(`${API_URL_BACKEND}/estudiante/registro-estudiante`, formData, config);
            if (response.status === 201) {
                Toast.show({ type: 'success', text1: 'Usuario Registrado revisa tu correo', text2: 'Registro Exitoso' });
                setTimeout(() => navigation.navigate('Token Registro'), 3000);
                console.log(response.data);
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                console.error("Error en la respuesta del servidor:", error.response.data);
                console.error("Estado HTTP:", status);
                console.error("Encabezados de respuesta:", error.response.headers);

                // Manejo de códigos de estado específicos
                if (status === 400) {
                    console.error("Solicitud incorrecta (400) ");
                    Toast.show({ type: 'error', text1: 'Existen campos vacios' });
                } else if (status === 409) {
                    console.error("Email o cédula ya registrados.");
                    Toast.show({ type: 'error', text1: 'Email o cédula ya registrados' });
                } else if (status === 500) {
                    console.error("Error del servidor (500)");
                    Toast.show({ type: 'error', text1: 'Error en el servidor' });
                } else {
                    console.error(`Error con código ${status}`);
                    // Puedes agregar más códigos de error según sea necesario
                }
                console.error("Detalles completos del error:", error.toJSON());
            }
        };
    }

    // Función para formatear la fecha
    const formatDate = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            // Verifica que sea una instancia válida de Date
            const d = new Date(date);
            // Extrae los componentes de la fecha
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0"); // Mes comienza en 0
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}/${month}/${day}`; // Construye el formato deseado
        } else {
            return ""; // Si no es una instancia válida de Date, retorna un string vacío
        }
    };
    const handleChangeDate = (event, selectedDate, setFieldValue) => {
        setShowDatePicker(false);
        if (selectedDate) {
            // Actualiza el valor de la fecha en Formik
            // setFieldValue("fecha_nacimiento", selectedDate.toISOString().split("T")[0]);
            setFieldValue("fecha_nacimiento", selectedDate);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <View>
                <Text style={styles.title}>Nuevo Estudiante</Text>
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Formik
                        initialValues={{
                            nombre: '',
                            apellido: '',
                            cedula: '',
                            email: '',
                            password: '',
                            fecha_nacimiento: null,
                            direccion: '',
                            ciudad: '',
                            telefono: '',
                            fotografia: Yup.mixed().test(
                                'fileFormat',
                                'Solo se permiten imágenes',
                                value => value && value.type.startsWith('image/')
                            ),

                        }}
                        validationSchema={validacionForm}
                        onSubmit={handleSubmit}>
                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                            <>
                                <Text style={styles.labeldos}>Nombres:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 30) {
                                            handleChange('nombre')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('nombre')}
                                    value={values.nombre}
                                    placeholder="Ingresa tu nombre"
                                />
                                {touched.nombre && errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

                                <Text style={styles.labeldos}>Apellidos:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 30) {

                                            handleChange('apellido')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('apellido')}
                                    value={values.apellido}
                                    placeholder="Ingresa tu apellido"
                                />
                                {touched.apellido && errors.apellido && <Text style={styles.error}>{errors.apellido}</Text>}

                                <Text style={styles.labeldos}>Cédula:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 10) {

                                            handleChange('cedula')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('cedula')}
                                    value={values.cedula}
                                    placeholder="Ingresa tu cédula"
                                    keyboardType="numeric"
                                />
                                {touched.cedula && errors.cedula && <Text style={styles.error}>{errors.cedula}</Text>}

                                <Text style={styles.labeldos}>Correo Institucional:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 50) {
                                            handleChange('email')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Ingresa tu correo"
                                />
                                {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                                <Text style={styles.labeldos}>Contraseña:</Text>
                                <Text style={styles.selectedDate}>Recuerda que tu contraseña iniciara con "EST"</Text>
                                <View style={styles.passwordContainer}>
                                    <Text style={styles.prefix}>EST</Text>
                                    <TextInput
                                        style={styles.inputpassword}
                                        placeholder="Ingresa tu contraseña"
                                        secureTextEntry={!passwordVisible} // Cambia la visibilidad
                                        // onChangeText={handleChange('password')}
                                        onChangeText={text => {
                                            // Verifica si el texto contiene espacios
                                            if (text.includes(' ')) {
                                                // Si contiene espacios, no actualiza el estado
                                                return;
                                            }
                                            handleChange('password')(text); // Actualiza el estado si no hay espacios
                                        }}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                    />
                                </View>
                                {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                <View style={styles.checkboxContainer}>
                                    <Text style={styles.helperText}>
                                        {passwordVisible ? "Contraseña visible" : "Contraseña oculta"}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => setPasswordVisible(!passwordVisible)} // Alterna la visibilidad
                                        style={styles.checkbox}>
                                        <View style={passwordVisible ? styles.checkboxChecked : styles.checkboxUnchecked} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.labeldos}>Fecha de Nacimiento:</Text>
                                <TouchableOpacity
                                    style={styles.customButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.buttonText}>Seleccionar Fecha</Text>
                                </TouchableOpacity>

                                {/* Aquí va el DateTimePicker si se está mostrando */}
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={values.fecha_nacimiento ? new Date(values.fecha_nacimiento) : new Date()}
                                        mode="date"
                                        display="default"
                                        maximumDate={new Date()}
                                        onChange={(event, selectedDate) => handleChangeDate(event, selectedDate, setFieldValue)}
                                    />
                                )}
                                {values.fecha_nacimiento && <Text style={styles.selectedDate}>Fecha seleccionada: {formatDate(new Date(values.fecha_nacimiento))}</Text>}
                                {touched.fecha_nacimiento && errors.fecha_nacimiento && <Text style={styles.error}>{errors.fecha_nacimiento}</Text>}

                                <Text style={styles.labeldos}>Dirección:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 30) {
                                            handleChange('direccion')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('direccion')}
                                    value={values.direccion}
                                    placeholder="Ingresa tu dirección"
                                />
                                {touched.direccion && errors.direccion && <Text style={styles.error}>{errors.direccion}</Text>}

                                <Text style={styles.labeldos}>Ciudad:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 30) {
                                            handleChange('ciudad')(text)
                                        }
                                    }}
                                    onBlur={handleBlur('ciudad')}
                                    value={values.ciudad}
                                    placeholder="Ingresa tu ciudad"
                                />
                                {touched.ciudad && errors.ciudad && <Text style={styles.error}>{errors.ciudad}</Text>}

                                <Text style={styles.labeldos}>Teléfono:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => {
                                        if (text.length <= 10) {
                                            handleChange('telefono')(text);
                                        }
                                    }}
                                    onBlur={handleBlur('telefono')}
                                    value={values.telefono}
                                    placeholder="Ingresa tu teléfono"
                                    keyboardType="numeric"
                                />
                                {touched.telefono && errors.telefono && <Text style={styles.error}>{errors.telefono}</Text>}
                                <TouchableOpacity
                                    style={styles.customButton}
                                    onPress={() => requestCameraPermission(setFieldValue)}
                                    onBlur={handleBlur('fotografia')} 
                                >
                                    <Text style={styles.buttonText}>Tomar Foto</Text>
                                </TouchableOpacity>
                                {/* Mostrar imagen capturada */}
                                {selectedImage && (
                                    <Image source={{ uri: selectedImage }} style={styles.image} />
                                )}

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit}
                                >
                                    <Text style={styles.buttonText}>Enviar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Formik>
                </ScrollView>
            </View>
            <Toast />
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
        marginTop: 30,
        textAlign: "center",
        color: "#666666",
    },
    container: {
        padding: 20,
        flexGrow: 1, // Ensures that the container stretches to fill available space
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        color: "#666666",
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    passwordContainer: {
        marginVertical: 10,
        flexDirection: 'row', // Organiza los elementos en una fila
        alignItems: 'center', // Alinea verticalmente en el centro
        borderWidth: 1, // Opcional: para mostrar un borde en el contenedor
        borderColor: '#ccc', // Opcional: color del borde
        borderRadius: 5, // Opcional: esquinas redondeadas
        padding: 5, // Opcional: espacio interno
    },
    prefix: {
        marginRight: 5, // Espacio entre "EST" y el input
        fontWeight: 'bold', // Opcional: formato del texto "EST"
        color: "#666666",
    },
    inputpassword: {
        flex: 1, // Hace que el input ocupe el resto del espacio disponible
        height: 40, // Altura del TextInput
        backgroundColor: "#fff",
        color: "#666666",
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    checkbox: {
        width: 20,
        height: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'black',
    },
    checkboxUnchecked: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: 'black',
    },
    helperText: {
        marginLeft: 10,
        color: "#666666",
    },
    label: {
        fontSize: 16,
        marginVertical: 5,
    },
    selectedDate: {
        fontSize: 14,
        marginVertical: 5,
        color: 'gray',
    },
    button: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#4CAF50',  // Puedes cambiar el color de fondo aquí
        borderRadius: 5,
        borderWidth: 1,  // Esto es para agregar un borde
        borderColor: '#ccc',  // Color del borde
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    customButton: {
        backgroundColor: '#007BFF', // Color de fondo
        padding: 10, // Espaciado dentro del botón
        borderRadius: 5, // Bordes redondeados
        borderWidth: 1, // Ancho del borde
        borderColor: '#0056b3', // Color del borde
        alignItems: 'center', // Alinear el texto al centro
        justifyContent: 'center',
        marginVertical: 10, // Espaciado vertical
    },
    labeldos: {
        fontSize: 18,
        fontWeight: "600",
        color: "#003366",
    },
    errordos: {
        color: 'red',
        fontSize: 12,
        marginVertical: 5,
        textAlign: 'center', // Centra el mensaje
    },
});