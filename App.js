  import React, { useEffect } from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { StatusBar } from 'react-native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import { AuthProvider, useAuth } from './Helpers/AuthContext';
  import TermsAndConditions from './Screens/TermsAndConditions';
  import SplashScreen from './Screens/SplashScreen';
  import Home from './Screens/Home';
  import Login from './Screens/Login';
  import Register from './Screens/Register';
  import Dashboard from './Screens/DashBoard_Version_1';
  import MesCalculs from './Screens/MesCalculs';
  import SingleCalcul from './Screens/SingleCalcul';
  import AjouterCalcul from './Screens/AjouterCalcul';
  import Profil from './Screens/Profil';
  import MesPersonnels from './Screens/MesPersonnels';
  import AjouterPersonnel from './Screens/AjouterPersonnel';
  import AjouterClient from './Screens/AjouterClient';
  import MesFermes from './Screens/MesFermes';
  import AjouterFerme from './Screens/AjouterFerme';
  import MesClients from './Screens/MesClients';
  import SingleFarm from './Screens/SingleFarm';
  import SingleSerre from './Screens/SingleSerre';
  import AjouterSerre from './Screens/AjouterSerre';
  import NouvellesDemandes from './Screens/NouvellesDemandes';
  import SingleDemande from './Screens/SingleDemande';
  import ProfilOthers from './Screens/ProfilOthers';
  import Politique from './Screens/Politique';


  const Stack = createNativeStackNavigator();
  export const ENDPOINT_URL = "https://track-tom-test.pcs-agri.com/api/";
  export const DOWNLOAD_URL = "https://ws-tracktom-test.pcs-agri.com/download/";


  export default function App() {
    return (
      <AuthProvider>
        <StatusBar translucent={false} backgroundColor="black"  />
        <MainNavigator />
      </AuthProvider>
    );
  }

  const MainNavigator = () => {
    const { isLoading, isAuthenticated, triggerIt } = useAuth();

    useEffect(() => {
      console.log("Fuck it...");
    }, [triggerIt]);

    if (isLoading) return <SplashScreen />;

    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
              <Stack.Screen name="Politique" component={Politique} />
            </>
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="MesCalculs" component={MesCalculs} />
              <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
              <Stack.Screen name="Politique" component={Politique} />
              <Stack.Screen name="SingleCalcul" component={SingleCalcul} />
              <Stack.Screen name="AjouterCalcul" component={AjouterCalcul} />
              <Stack.Screen name="Profil" component={Profil} />
              <Stack.Screen name="ProfilOthers" component={ProfilOthers} />
              <Stack.Screen name="MesPersonnels" component={MesPersonnels} />
              <Stack.Screen name="AjouterPersonnel" component={AjouterPersonnel} />
              <Stack.Screen name="AjouterClient" component={AjouterClient} />
              <Stack.Screen name="MesFermes" component={MesFermes} />
              <Stack.Screen name="AjouterFerme" component={AjouterFerme} />
              <Stack.Screen name="MesClients" component={MesClients} />
              <Stack.Screen name="SingleFarm" component={SingleFarm} />
              <Stack.Screen name="SingleSerre" component={SingleSerre} />
              <Stack.Screen name="AjouterSerre" component={AjouterSerre} />
              <Stack.Screen name="NouvellesDemandes" component={NouvellesDemandes} />
              <Stack.Screen name="SingleDemande" component={SingleDemande} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
