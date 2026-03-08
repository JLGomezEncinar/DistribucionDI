import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from './authContext';
import { dbQuery } from '../databaseAdapter';
export default function LoginScreen() {
  const router = useRouter();
  const {  isLoading, isAuthenticated, logout} = useAuth();
  // Corregido: useState en lugar de requireState
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState("Profesor");

  const handleLogin = async () => {
   if (!nombre || !correo || !password) {
        const msg = 'Por favor, rellena todos los campos';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
        return;
    }

    try {
        // 2. Definimos la consulta SQL
        const sql = 'INSERT INTO empleados (nombre, correo, password, rol) VALUES (?, ?, ?, ?)';
        const params = [nombre, correo, password, rol];

        // 3. Llamamos al adaptador (él decidirá si usar SQLite o LocalStorage)
        await dbQuery(sql, params);

        // 4. Feedback al usuario según plataforma
        const successMsg = 'Empleado añadido correctamente';
        if (Platform.OS === 'web') {
            alert(successMsg);
        } else {
            Alert.alert('Éxito', successMsg);
        }

        // 5. Limpiar el formulario
        setNombre('');
        setCorreo('');
        setPassword('');
        setRol("Profesor");

    } catch (error) {
        console.error("Error al insertar:", error);
        const errorMsg = 'No se pudo guardar el empleado';
        Platform.OS === 'web' ? alert(errorMsg) : Alert.alert('Error', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre"
        onChangeText={setNombre}
        value={nombre}
        style={styles.input}
        autoCapitalize="none"

      />
      <TextInput
        placeholder="Correo"
        onChangeText={setCorreo}
        value={correo}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <Picker 
      selectedValue={rol}
        onValueChange={(itemValue) =>
          setRol(itemValue)}
          >
        <Picker.Item label="Profesor" value="Profesor" />
        <Picker.Item label="Administrador" value="Administrador" />
      </Picker>
      <Button title="Añadir empleado" onPress={() => { handleLogin() }} />
      <Button title="Volver al menú" onPress={() => router.push('/menu')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center', flex: 1, backgroundColor: '#fff' },
  input: { borderBottomWidth: 1, marginBottom: 15, padding: 8, borderColor: '#ccc' }
});