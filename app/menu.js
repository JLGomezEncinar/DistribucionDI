import { View, Text, Pressable } from 'react-native';
import { useRouter} from 'expo-router';
import { useAuth } from './authContext';


export default function Menu() {
    const { signOut } = useAuth();
    const router = useRouter();
 
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Pressable
                onPress={() => {
                    router.push("/formulario")
                }}>
                <Text>Añadir empleado</Text>
            </Pressable>

            
            <Pressable
                onPress={() => {
                    router.push("/empleado")
                }}>
                <Text>Consultar empleados</Text>
            </Pressable>
            <Pressable
                onPress={() => {
                    signOut();
                    router.replace('/');
                }}>
                <Text>Cerrar sesión</Text>
            </Pressable>
        </View>

    );
}
