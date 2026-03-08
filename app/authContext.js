import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

import { getToken, saveToken, deleteToken } from './authService';
import { dbQuery } from '../databaseAdapter';

const AuthContext = createContext();

// Nombre de tu base de datos local
const DB_NAME = 'empleados.db';
const WEB_STORAGE_KEY = 'tabla_empleados';

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Inicializar base de datos y comprobar sesión al arrancar
        const prepareApp = async () => {
            try {
              if (Platform.OS === 'web') {
                    inicializarWebDB();
                } else {
                await initializeDatabase();
                }
                await checkSession();
            } catch (e) {
                console.error("Error al preparar la aplicación:", e);
            } finally {
                setIsLoading(false);
            }
        };

        prepareApp();
    }, []);
    const inicializarWebDB = () => {
        if (!localStorage.getItem(WEB_STORAGE_KEY)) {
            localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify([
                { id: 1, nombre: 'Administrador', correo: 'administracion@iessanalberto.com', password: '1234', rol: 'Administrador' }
            ]));
            console.log("Web DB inicializada con usuario admin");
        }
    };

    // Configuración inicial de SQLite (Crea la tabla si no existe)
    const initializeDatabase = async () => {
        const SQLite = require('expo-sqlite');
        const db = await SQLite.openDatabaseAsync(DB_NAME);
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS empleados (
                id INTEGER PRIMARY KEY NOT NULL, 
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL, 
                password TEXT NOT NULL,
                rol TEXT NOT NULL
            );
        `);

        // Insertamos un usuario de prueba si la tabla está vacía
        const userCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM empleados');
        if (userCount.count === 0) {
            await db.runAsync('INSERT INTO empleados (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', ['Administrador', 'administracion@iessanalberto.com', '1234', 'Administrador']);
            
        }
    };

    // Comprueba si hay un token guardado en SecureStore/LocalStorage
    const checkSession = async () => {
        const token = await getToken();
        if (token) {
            setUserToken(token);
        }
    };

    // Lógica de Login con SQLite
    const signIn = async (username, password) => {
        
            
            
            // Buscamos el usuario en la base de datos local
            const user = await dbQuery(
                'SELECT * FROM empleados WHERE correo = ? AND password = ? AND id = 1', // Solo permitimos el admin con id=1
                [username, password]
            );
           

            if (user) {
        const token = 'session-' + user.id;
        await saveToken(token); // Tu authService que ya era multiplataforma
        setUserToken(token);
        return { success: true };
    }
    return { success: false, msg: "Error de credenciales" };
    
    };

    // Lógica de Logout
    const signOut = async () => {
        try {
            await deleteToken();
            setUserToken(null);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};