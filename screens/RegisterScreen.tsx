import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, TouchableOpacity, PermissionsAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from "react-native-toast-message";
import axios from "axios";
import { API_URL_BACKEND } from '@env';
import { launchCamera } from 'react-native-image-picker';

export default function RegistroEstudiante() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    email: "",
    password: "",
    fecha_nacimiento: new Date(),
    direccion: "",
    ciudad: "",
    telefono: "",
    fotografia: "",
  });

  // Solicitar permiso para la cámara
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
        console.log('Permiso de cámara otorgado');
        launchCamera({ mediaType: 'photo' }, (response) => {
          if (response.didCancel) {
            console.log('Usuario canceló la cámara');
          } else if (response.error) {
            console.log('Error al lanzar la cámara:', response.error);
          } else {
            console.log('Foto capturada:', response.assets);
            setForm({ ...form, fotografia: response.assets[0].uri }); // Guarda la URI de la foto
          }
        });
      } else {
        console.log('Permiso de cámara denegado');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleRegistro = async () => {
    const { nombre, apellido, cedula, email, password, direccion, ciudad, telefono, fecha_nacimiento, fotografia } = form;
    if (!nombre || !apellido || !cedula || !email || !password || !direccion || !ciudad || !telefono) {
      alert("Por favor, completa todos los campos");
      return;
    } else {
      try {
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (key === 'fotografia' && fotografia) {
            formData.append('fotografia', {
              uri: fotografia,
              type: 'png/jpeg',
              name: 'fotografia.jpg',
            });
          } else {
            formData.append(key, form[key]);
          }
        });
        formData.append('fecha_nacimiento', fecha_nacimiento.toISOString());

        const response = await axios.post(`${API_URL_BACKEND}/estudiante/registro-estudiante`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          setForm({
            nombre: "",
            apellido: "",
            cedula: "",
            email: "",
            password: "",
            fecha_nacimiento: new Date(),
            direccion: "",
            ciudad: "",
            telefono: "",
            fotografia: "",
          });
          Toast.show({ type: 'success', text1: 'Usuario Registrado', text2: 'Sus datos fueron ingresados con éxito' });
          setTimeout(() => navigation.navigate('Iniciar Sesion'), 5000);
        }
      } catch (error) {
        console.log("Error al registrarse", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Ocurrió un error, intente nuevamente',
        });
      }
    }
  };


  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setForm({ ...form, fecha_nacimiento: selectedDate });
    }
  };
  

  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return "Fecha no seleccionada";
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Pantalla de Registro Estudiante</Text>
          <TextInput style={styles.input} placeholder="Nombres Completos" value={form.nombre} onChangeText={(value) => handleChange('nombre', value)} />
          <TextInput style={styles.input} placeholder="Apellidos Completos" value={form.apellido} onChangeText={(value) => handleChange('apellido', value)} />
          <TextInput style={styles.input} placeholder="Cédula" keyboardType="numeric" value={form.cedula} onChangeText={(value) => handleChange('cedula', value)} />
          <TextInput style={styles.input} placeholder="Correo Electrónico" keyboardType="email-address" value={form.email} onChangeText={(value) => handleChange('email', value)} />
          <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={(value) => handleChange('password', value)} />
          
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && <DateTimePicker value={form.fecha_nacimiento} mode="date" display="default" onChange={onChangeDate} />}
          <Text style={styles.selectedDate}>Fecha seleccionada: {formatDate(form.fecha_nacimiento)}</Text>

          <TextInput style={styles.input} placeholder="Dirección" value={form.direccion} onChangeText={(value) => handleChange('direccion', value)} />
          <TextInput style={styles.input} placeholder="Ciudad" value={form.ciudad} onChangeText={(value) => handleChange('ciudad', value)} />
          <TextInput style={styles.input} placeholder="Teléfono" keyboardType="phone-pad" value={form.telefono} onChangeText={(value) => handleChange('telefono', value)} />

          <View style={styles.profileSection}>
            <Text style={styles.label}>Foto:</Text>
            <TouchableOpacity style={styles.buttonpicture} onPress={requestCameraPermission}>
              <Text style={styles.buttonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>

          <Button title="Registrarse" onPress={handleRegistro} />
          <Toast />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  selectedDate: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "bold",
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
  profileSection: {
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
