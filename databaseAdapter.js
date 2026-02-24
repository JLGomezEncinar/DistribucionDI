import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'empleados.db';
const WEB_STORAGE_KEY = 'tabla_empleados';

export const dbQuery = async (sql, params = []) => {
    if (Platform.OS === 'web') {
        // --- LÓGICA PARA WEB (JSON en LocalStorage) ---
        console.log("Ejecutando en Web:", sql);

        // 1. Obtener los datos actuales
        const rawData = localStorage.getItem(WEB_STORAGE_KEY);
        let empleados = rawData ? JSON.parse(rawData) : [];
        console.log(empleados)

        // 2. Simular un SELECT *
        if (sql.toUpperCase().includes('SELECT *')) {
            // Si hay un WHERE básico (ej: login)
            if (sql.includes('WHERE correo = ?')) {
                const encontrado = empleados.find(u =>
                    u.correo === params[0] &&
                    u.password === params[1] &&
                    u.id === 1 // Forzamos el ID 1 porque está fijo en tu SQL
                    
                );
                return encontrado || null;
            }
            if (sql.includes('id != 1')) {
                    empleados = empleados.filter(u => u.id !== 1);
                    return empleados;
            }
            return empleados;
        }

        // 3. Simular un INSERT
        if (sql.toUpperCase().includes('INSERT INTO')) {
            const nuevo = { id: Date.now(), nombre: params[0], correo: params[1], password: params[2], rol: params[3] };
            empleados.push(nuevo);
            localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(empleados));
            return { insertId: nuevo.id };
        }

        // 4. Simular un DELETE
        if (sql.toUpperCase().includes('DELETE')) {
            empleados = empleados.filter(u => u.id !== params[0]);
            localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(empleados));
            return true;
        }

    } else {
        // --- LÓGICA PARA MÓVIL (SQLite Nativo) ---
        const db = await SQLite.openDatabaseAsync(DB_NAME);

        if (sql.toUpperCase().startsWith('SELECT')) {
            // Si es login (un solo resultado) usamos getFirstAsync, si no getAllAsync
            return sql.includes('WHERE')
                ? await db.getFirstAsync(sql, params)
                : await db.getAllAsync(sql, params);
        } else {
            return await db.runAsync(sql, params);
        }
    }
};