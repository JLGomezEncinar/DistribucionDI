import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Pressable, Image, Button, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import { dbQuery } from '../databaseAdapter';
import * as SQLite from 'expo-sqlite';

const Empleado = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);



  const router = useRouter();
  
  useEffect(() => {
  cargarEmpleados();
}, []);

const cargarEmpleados = async () => {
  
  const sql = 'SELECT * FROM empleados where id != 1';
  const result = await dbQuery(sql);
  setEmpleados(result);
  setLoading(false);
  
};
  

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.nombre}</Text>
      <Text style={styles.cell}>{item.correo}</Text>
      <Text style={styles.cell}>{item.password}</Text>
      <Text style={styles.cell}>{item.rol}</Text>
      <Pressable style={styles.cell} onPress={() => handleConfirm(item.id)}><Image source={require('../assets/delete.png')}></Image> </Pressable>
    </View>
  );
  const handleConfirm = (id) => {
    if (Platform.OS === 'web') {
        if (confirm("¿Estás seguro de que quieres borrar el usuario con ID " + id + "?")) {
            const sql = 'DELETE FROM empleados WHERE id = ?';
            dbQuery(sql, [id]).then(() => cargarEmpleados());
        }
     } else {
    Alert.alert(
    "Confirmación", // Título
    "¿Estás seguro de que quieres borrar el usuario con ID " + id + "?", // Mensaje
    [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancelado"),
        style: "cancel" // Estilo especial en iOS
      },
      { 
        text: "Sí, borrar", 
        onPress: async () => {
          const sql = 'DELETE FROM empleados WHERE id = ?';
          await dbQuery(sql, [id]);
          cargarEmpleados();
      }
    }
    ],
    { cancelable: true } // Permite cerrar al tocar fuera (solo Android)

  )};
};
  
  
if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={[styles.row, styles.header]}>
        <Text style={styles.headerCell}>Id</Text>
        <Text style={styles.headerCell}>Nombre</Text>
        <Text style={styles.headerCell}>Correo</Text>
        <Text style={styles.headerCell}>Password</Text>
        <Text style={styles.headerCell}>Rol</Text>
        <Text style={styles.headerCell}>Eliminar</Text>
      </View>

      {/* Filas */}
      <FlatList
        data={empleados}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <Button title="Volver al menú" onPress={() => router.push('/menu')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8
  },
  cell: {
    flex: 1,
    textAlign: 'center'
  },
  header: {
    backgroundColor: '#eee',
    borderBottomWidth: 2
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Empleado