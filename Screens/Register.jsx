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
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import axios from "axios";
import { ENDPOINT_URL } from '../App';




export default function Register({ route }) {
      
        const [fullName, setfullName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [phone, setPhone] = useState('');

        const [messageAxiosrequest , setmessageAxiosrequest] = useState(null);
        const [modalVisibleError , setModalVisibleError] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);
        const [modalVisible, setModalVisible] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
        const [loading, setloading] = useState(false);
    
    
    const [fontsLoaded] = useFonts({
      'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
      "Inter": require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
      "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
      "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
      "InterBold": require('../fonts/Inter_28pt-Medium.ttf'),
    }); 
    const navigation = useNavigation();

    const handleRegister = async () => {

      if (!email || !password || !phone || !confirmPassword) {
        Alert.alert("Veuillez remplir tous les champs !");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Les mots de passe ne sont pas identiques.");
        return;
      }
      setloading(true);

      try {
        const req = await axios.post(`${ENDPOINT_URL}register`, {
          name: fullName,
          email: email.toLowerCase(),
          password: password,
          job: "IT",
          telephone: phone.toString(),
          entreprise: "PCS AGRI",
          password_confirmation: password
        });

        console.warn(req.status);

        if (req.status === 201) {
          setloading(false);
          setEmail("");
          setPassword("");
          setfullName("");
          setConfirmPassword("");
          setPhone('');
          Alert.alert("Votre demande est en cours de traitement, On vous contacterai.")
        }
        else{
          setloading(false);
          Alert.alert("Oups, une erreur est survnue lors de la création de votre compte.")
        }

      } catch (error) {
        if(error.status === 422){
          setloading(false);
          console.log("Email already in use...");
        }
        else{
          setloading(false);
          Alert.alert("Oups, une erreur interne du serveur est survnue.")
        }
        console.log("error  ====>",error);
      } finally{
        setloading(false);
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
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <View style={styles.modalContainer}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{errorMessage}</Text>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => setModalVisible(false)}
                        >
                          <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
        <ImageBackground
          source={require('../images/akram.jpg')}  
          style={styles.background}
        >





        <View style={styles.overlay}>


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
                        <Text style={styles.modalText}>{messageAxiosrequest}</Text>
                        <Pressable
                          style={[styles.btnModel, styles.buttonClose]}
                          onPress={() => setModalVisibleError(!modalVisibleError)}
                        >
                          <Text style={styles.textStyle}>{messageAxiosrequest === "Votre demande est en cours de traitement, veuillez revenir d'ici 24H" ? "OK, bien noté" : "Réessayer"}</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>


            <Text style={styles.title}>Rejoignez-nous !</Text>
            <Text style={styles.subtitle}>
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

            
            {/* Champ Numéro de Téléphone */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Numéro de téléphone&nbsp;<Text style={{color : "red", fontSize : 16}} >*</Text></Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Entrez votre téléphone..."
                            placeholderTextColor="gray"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                          />
                        </View>
            
                        {/* Champ Mot de Passe */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Mot de passe&nbsp;<Text style={{color : "red", fontSize : 16}} >*</Text></Text>
                          <View style={styles.passwordContainer}>
                            <TextInput
                              style={styles.inputPassword}
                              placeholder="Entrez votre mot de passe..."
                              placeholderTextColor="gray"
                              secureTextEntry={!showPassword}
                              value={password}
                              onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                          </View>
                        </View>
            
                        {/* Champ Confirmation Mot de Passe */}
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Confirmez le mot de passe&nbsp;<Text style={{color : "red", fontSize : 16}} >*</Text></Text>
                          <View style={styles.passwordContainer}>
                            <TextInput
                              style={styles.inputPassword}
                              placeholder="Confirmez votre mot de passe..."
                              placeholderTextColor="gray"
                              secureTextEntry={!showConfirmPassword}
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="gray" />
                            </TouchableOpacity>
                          </View>
                        </View>


                        <Text style={styles.infos}>
                            En créant un compte, vous reconnaissez avoir lu et accepté&nbsp;
                            <Text 
                              style={styles.linkText} 
                              onPress={() => navigation.navigate('TermsAndConditions')}>
                              les conditions d'utilisation
                            </Text> et &nbsp;
                            <Text 
                              style={styles.linkText} 
                              onPress={() => navigation.navigate('Politique')}>
                              la politique de confidentialité
                            </Text>
                        </Text>

            <View style={styles.lastContainer} >
                <TouchableOpacity 
                    style={styles.button}
                    disabled={loading}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>
                      {
                        loading ? "Traitement en cours..." : "S'inscrire maintenant"
                      }
                    </Text>
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

        </>
    );
}





const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: screenWidth,
    height: screenHeight +40,
    backgroundColor: "black",
    objectFit : "cover"
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.64)', 
    padding: 20,
    paddingBottom : 0,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'InriaBold',
    fontSize: 35,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#fff',
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
  infos: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#fff',
    textAlign: "center"
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 48,
    padding: 13,
    fontSize: 14,
    fontFamily: 'Inter',
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 48,
    paddingLeft: 13,
    paddingRight: 10,
  },
  inputPassword: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter',
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
    fontSize: 16,
    marginRight: 7, 
  },

  lastContainer : {
    marginTop : 20
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


modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  width: 300,
  padding: 20,
  paddingRight : 6, 
  paddingLeft : 6, 
  backgroundColor: '#fff',
  borderRadius: 10,
  alignItems: 'center',
},
modalText: {
  fontSize: 15,
  color: '#333',
  textAlign: 'center',
  marginBottom: 10,
},
modalButton: {
  backgroundColor: "#BE2929",
  paddingVertical: 13,
  paddingHorizontal: 24,
  borderRadius: 8,
  marginTop : 13
},
modalButtonText: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "bold",
},
required : {
  color : "red"
},
linkText: {
  color : "white",
  textDecorationLine: 'underline',
  fontWeight: 'bold',
},

});

