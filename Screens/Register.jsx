import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import { saveToken, deleteToken, getToken } from '../Helpers/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import {ENDPOINT_URL} from "../App";
import axios from "axios";




export default function Register({ route }) {
  
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [fontsLoaded] = useFonts({
            'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
            'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
            "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
            "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
            "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
        });
  
    const navigation = useNavigation();

    const handleRegister = async () => {

      if (!email || !password) {
        console.log("Enter email and password !");
        return;
      }

      try {
        const req = await axios.post(`${ENDPOINT_URL}register`, {
          name: fullName,
          email: email,
          password: password,
          job: "IT",
          telephone: "123-456-7890",
          entreprise: "PCS AGRI",
          password_confirmation: password
        });
        console.log("req  ====>",req);

        if (req.status === 201) {

          // await AsyncStorage.setItem('token', req.data.token);
          // await AsyncStorage.setItem('userType',req.data.user.user_type);
          // navigation.navigate('MesCalculs');

        }

      } catch (error) {
        console.log("error  ====>",error);
      }

    }


    if (!fontsLoaded) {
        return null;
    }
    return (
        <ImageBackground
          source={require('../images/akram.jpg')}  
          style={styles.background}
        >
        <View style={styles.overlay}>
            <Text style={styles.title}>Rejoignez-nous !</Text>
            <Text style={styles.subtitle}>
                Améliorez vos rendements dès maintenant.
            </Text>

            
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Nom et prénom <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre nom et prénom..."
                placeholderTextColor="gray"
                value={fullName}
                onChangeText={setfullName}
            />
            </View>

            
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Adresse email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre email..."
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                Mot de passe <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Veuillez saisir votre mot de passe..."
                placeholderTextColor="gray"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            </View>
            <Text style={styles.infos}>
                En créant un compte, vous reconnaissez avoir lu et accepté notre politique.
            </Text>

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>S'inscrire maintenant</Text>
                    <Ionicons name="chevron-forward" size={19} color="#fff" />
                </TouchableOpacity>

                <Text 
                  style={styles.signupText}
                  onPress={async ()=>{
                    navigation.navigate('Login');
                  }}
                >
                    Déja un compte ? <Text style={styles.signupLink}>connectez-vous</Text>
                </Text>
            </View>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor : "black"
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.64)', 
    padding: 20,
    paddingBottom : 0, 
    paddingTop : 0,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'InriaBold',
    fontSize: 35,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  infos : {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#fff',
    marginBottom: 5,
    textAlign : "center"
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height : 48,
    paddingRight : 13,
    paddingLeft : 13,
    fontSize: 14,
    fontFamily: 'Inter',
  },
  lastContainer : {
    position : "absolute", 
    bottom : 20, 
    right : 20,
    left : 20
},
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#BE2929",
    borderRadius: 11,
    height : 53, 
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily : "Inter",
    fontSize : 16,
    marginBottom : 3,
    marginRight : 7, 
    fontWeight : "300"
  },
  signupText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#fff',
    fontWeight : "600",
    textDecorationLine: 'underline',
  },
});
