import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import axios from "axios";
import {ENDPOINT_URL} from "../App";
import { useAuth } from '../Helpers/AuthContext';




export default function Home({ route }) {
  

    const [fontsLoaded] = useFonts({
            'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
            'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
            "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
            "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
            "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
        });
  
    const navigation = useNavigation();

    

    if (!fontsLoaded) {
        return null;
    }
    return (
      <>
        
        
        <ImageBackground
          source={require('../images/tomato.jpg')}
          style={styles.background}
        >
        <View style={styles.overlay}>
            

            {/* <Image
              source={require('../assets/logot.png')}
              style={styles.imageLogo}
            /> */}

            <Text style={styles.title}>TRACK TOM</Text>
            <Text style={styles.subtitle}>
            Votre allié technologique pour une estimation de récolte précise.

            </Text>

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={styles.button2}
                    onPress={()=>{
                      navigation.navigate('Login');
                    }}
                >
                  <Text style={styles.buttonText}>Connectez vous</Text>
                  <Ionicons name="chevron-forward" size={19} color="#fff"  style={{position : "absolute", top : 17, right : 20}} />
                </TouchableOpacity>
            </View>

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={styles.button}
                    onPress={()=>{
                      navigation.navigate('Register');
                    }}
                >
                  <Text style={styles.buttonText}>Créer un compte</Text>
                  <Ionicons name="chevron-forward" size={19} color="#fff"  style={{position : "absolute", top : 17, right : 20}} />
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle2}>
            © 2025 PCS AGRI - Tous droits réservés
            </Text>


        </View>
        </ImageBackground>
      </>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight +40,
    backgroundColor : "black", 
    objectFit : "cover"
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.80)', 
    padding: 20,
    paddingBottom : 20, 
    paddingTop : 0,
    position : "relative",
    justifyContent: "flex-end",
  },
  title: {
    fontFamily: 'InriaBold',
    fontSize: 45,
    color: 'white',
    textAlign: 'left',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 17,
    color: '#fff',
    textAlign: 'left',
    letterSpacing : -0.666,
    color : "rgb(211, 211, 211)",
    marginBottom: 80,
  },
  subtitle2: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#fff',
    marginTop : 50,
    textAlign: 'center',
    letterSpacing : -0.666,
    color : "rgb(211, 211, 211)",
    marginBottom: 30,
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"rgba(255, 0, 0, 0.18)",
    borderRadius: 11,
    borderWidth : 0, 
    borderColor : "transparent",
    height : 55, 
    marginTop: 16.167,
    position : "relative"
  },

  button2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"rgba(255, 0, 0, 0.5)",
    borderRadius: 11,
    borderWidth : 1, 
    borderColor:"rgba(255, 0, 0, 0.6)",
    height : 55, 
    marginTop: 20,
    position : "relative"
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
    fontSize: 13,
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
  buttonClose: {
    backgroundColor: "tomato",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 14,
    textAlign: "center",
  },
  btnModel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "red",
    borderRadius: 11,
    padding : 10,
  },
  textStyle:{
    color:"white"
  },
  buttonloading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#BE2929",
    borderRadius: 11,
    height : 53, 
    marginTop: 20,
  },
  imageLogo : {
    height : 66,
    width : 66, 
    objectFit : "cover", 
    borderRadius : 10, 
    position : "absolute", 
    top : 40, 
  }
});
