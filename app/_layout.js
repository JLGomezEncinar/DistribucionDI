import { Slot, useRouter, useSegments } from 'expo-router';

import { useEffect } from 'react';

import { AuthProvider, useAuth } from './authContext';
import { ThemeProvider } from '../themeContext';



function RootLayoutNav() {

  const { userToken, isLoading } = useAuth();

  const segments = useSegments();

  const router = useRouter();



  useEffect(() => {

    if (isLoading) return;



    // Ruta actual ('' o 'index' cuando es index.js)

    const currentRoute = segments[0];



    const isLoginPage =

      currentRoute === undefined || currentRoute === 'index';



    if (!userToken && !isLoginPage) {

      // No logueado → forzar login

      router.replace('/');

    }



    if (userToken && isLoginPage) {

      // Logueado → ir al menú

      router.replace('/menu');

    }

  }, [userToken, isLoading]);



  return <Slot />;

}



export default function RootLayout() {

  return (
    <ThemeProvider>
      <AuthProvider>

        <RootLayoutNav />

      </AuthProvider>
    </ThemeProvider>

  );

}