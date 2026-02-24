import React, { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, Button, Alert } from 'react-native';
import { useAuth } from './authContext'; // Asegúrate de que la ruta sea correcta
import { useTheme } from '../themeContext';
import { Platform } from 'react-native';
export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [issubmitting, setIsSubmitting] = useState(false);
  const { theme, isDarkMode, toggleTheme } = useTheme();

  // Extraemos la función signIn del contexto
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (correo === '' || password === '') {
      if (Platform.OS === 'web') {
        alert('Por favor, rellena todos los campos');
      } else {
        Alert.alert('Error', 'Por favor, rellena todos los campos');
      }
      return;
    }

    setIsSubmitting(true);
    
    // Llamamos a la lógica del contexto
    const result = await signIn(correo, password);
    
    if (result.success) {
      // No necesitas router.replace('/menu') aquí, 
      // el _layout.js lo hará por ti al detectar el nuevo userToken.
      console.log('Login correcto');
    } else {
      Alert.alert('Error de acceso', result.msg || 'Correo o contraseña incorrectos');
      setIsSubmitting(false);
    }
  };

  return (


    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Modo Oscuro: {isDarkMode ? 'ON' : 'OFF'}
      </Text>

      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: "#767577", true: theme.primary }}
      />
      <TextInput
        placeholder="Email"
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
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 8,
    borderColor: '#ccc',
  },
});
