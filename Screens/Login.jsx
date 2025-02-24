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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import axios from "axios";
import {ENDPOINT_URL} from "../App";
import { useAuth } from '../Helpers/AuthContext';




export default function Login({ route }) {
  

    const { setIsAuthenticated } = useAuth();

    const [email, setEmail] = useState('elmehdi.moubachir@pcs-agri.com');
    const [password, setPassword] = useState('elmehdi.moubachir@pcs-agri.com');
    const [messageError , setMessageError] = useState(null);
    const [modalVisibleError , setModalVisibleError] = useState(false);
    const [modalVisible , setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [fontsLoaded] = useFonts({
            'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
            'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
            "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
            "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
            "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
        });
  
    const navigation = useNavigation();

    const handleLogin = async () => {

      setLoading(true);
      if (!email || !password) {
        console.log("Enter email and password !");
        setMessageError("Enter email and password !");
        setModalVisibleError(true);
        setLoading(false);
        return;
      }

      try {
        const req = await axios.post(`${ENDPOINT_URL}login`, {
          email: email ,
          password: password,
        });
        console.log("req  ====>",req);

        if (req.status === 200) {
          setLoading(false);
         
   
          await AsyncStorage.setItem('Token', req.data.data.token);
          await AsyncStorage.setItem('created_at',req.data.data.user.created_at);
          if(req.data.data.user.user_type !== null && req.data.data.user.user_type !== undefined ){
            await AsyncStorage.setItem('user_type',req.data.data.user.user_type);
          }
          else{
            await AsyncStorage.setItem('user_type',"NotAdmin");
          }

          setModalVisibleError(false);
          setModalVisible(false);

          setTimeout(()=>{
            setIsAuthenticated(true);
          }, 111);

        }
        if (req.status === 204){
          setLoading(false);
          setMessageError("Nous traitons actuellement votre demande d'accès à l'application.");
          setModalVisible(true);
        }

      } catch (error) {
        setLoading(false);
        setMessageError("Error occurred while logging in.");
        setModalVisibleError(true);
        console.log("error  ====>",error);
      }
    }






    if (!fontsLoaded) {
        return null;
    }
    return (
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleError}
          onRequestClose={() => {
            setModalVisibleError(!modalVisibleError);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{messageError}</Text>
              <Pressable
                style={[styles.btnModel, styles.buttonClose]}
                onPress={() => setModalVisibleError(!modalVisibleError)}
              >
                <Text style={styles.textStyle}>Réessayez</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{messageError}</Text>
              <Pressable
                style={[styles.btnModel, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>D'accord</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
     
        <ImageBackground
          source={require('../images/akramm-min.jpg')}
          style={styles.background}
        >
        <View style={styles.overlay}>
            <Text style={styles.title}>Connectez-vous</Text>
            <Text style={styles.subtitle}>
            Votre espace personnalisé, à portée de main.
            </Text>

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

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={loading ? styles.buttonloading : styles.button}
                    onPress={handleLogin}
                >
              {
                loading ?  
                <>
                  <Text style={[styles.buttonText]}>
                    Authentification en cours...
                  </Text>  
                </>
                :
                <>
                  <Text style={styles.buttonText}>S'authentifier </Text>
                  <Ionicons name="chevron-forward" size={19} color="#fff" />
                </>
              }
                </TouchableOpacity>

                <Text 
                  style={styles.signupText}
                  onPress={async ()=>{
                    navigation.navigate('Register');
                  }}
                >
                    Pas de compte ? <Text style={styles.signupLink}>inscrivez-vous</Text>
                </Text>
            </View>
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
    objectFit : "contain"
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
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
    marginTop : 30
  },
  button: {
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
});
