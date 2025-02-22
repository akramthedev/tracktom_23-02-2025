import React, { useState,useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,TextInput
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation  } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {ENDPOINT_URL} from "../App";
import axios from "axios";   
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Keyboard } from 'react-native';






export default function AjouterSerre({route}) {
    const [fontsLoaded] = useFonts({
        'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
        'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
        "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
        "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
        "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
    });
  



           
    
        const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    
        useEffect(() => {
            const keyboardDidShowListener = Keyboard.addListener(
                'keyboardDidShow',
                () => {
                    setIsKeyboardVisible(true);
                }
            );
            const keyboardDidHideListener = Keyboard.addListener(
                'keyboardDidHide',
                () => {
                    setIsKeyboardVisible(false);
                }
            );
        
            // Clean up listeners on unmount
            return () => {
                keyboardDidHideListener.remove();
                keyboardDidShowListener.remove();
            };
        }, []);
    
        



    const navigation = useNavigation();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [NameSerre,setNameSerre] = useState("");
    const [Nombre_Tiges_Total,setNombre_Tiges_Total] = useState("");
    const [PoidsMoyen,setPoidsMoyen] = useState("");

    const { idFerme } = route.params;
    const [isLoading,setloading] = useState(false);
 






    const handleSubmit = async () => {

        let NTT = 0;
        let PM = 0;

        if (!NameSerre) {
            Alert.alert("Le nom de la serre est obligatoire.");
            return;
        }



        if(Nombre_Tiges_Total === ""){
            NTT = 1;  
        }
        else{
            NTT = parseInt(Nombre_Tiges_Total);
        }


        if(PoidsMoyen === ""){
            PM = 1;  
        }
        else{
            PM = parseFloat(PoidsMoyen);
        }

        try{
            setloading(true);
            const token = await AsyncStorage.getItem('Token');

            let data = {
                name : NameSerre, 
                ferme_id : idFerme, 
                nbr_tiger : NTT, 
                poids_fruit : PM
            }

            console.log("data" , data);

            const resp = await axios.post(`${ENDPOINT_URL}serres`, data, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log("resp Serre ===>" ,resp);
            if(resp.status === 201){
                console.log(resp.data);
                setNameSerre("");
                setNombre_Tiges_Total("");
                setPoidsMoyen("");
                setloading(false);
                navigation.goBack();
            }
            else{
                setloading(false);
                Alert.alert("Une erreur est survenue lors de la création de la serre.");
            }
          }
    
        catch(e){
            setloading(false);
            Alert.alert("Une erreur est survenue lors de la création de la serre.");
            console.log(e.data);
            console.warn(e.message);
        }

    }

   
    
    

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000); 
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs}s`;
    };

    
     


    if (!fontsLoaded) {
        return null;
    }


    return (

        <>


        <PopUpNavigate 
            isPopupVisible={isPopupVisible}
            setIsPopupVisible={setIsPopupVisible}  
        />


        <View style={styles.container}>


            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.returnButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#141414" />
                </TouchableOpacity>
                <Text style={styles.title}>Nouvelle Serre</Text>
                <TouchableOpacity 
                    onPress={() => setIsPopupVisible(!isPopupVisible)}
                    style={styles.elipsisButton}
                >                    
                    <Ionicons name="menu" size={24} color="#141414" />
                </TouchableOpacity>
            </View>


            <View style={styles.formContainer}>

                <Text style={styles.label}>
                    Nom&nbsp;<Text style={styles.highlight} >*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    value={NameSerre}
                    onChangeText={setNameSerre}
                    placeholder="Entrez la superficie..."
                    keyboardType="default"
                />




                <Text style={styles.label}>
                    Nombre de tiges par mètre
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder='Entrez le nombre de tiges par mètre..'
                    keyboardType="numeric"
                    value={Nombre_Tiges_Total.toString()}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text)) { 
                            setNombre_Tiges_Total(text); 
                        } else {
                        Alert.alert("Erreur", "Veuillez entrer uniquement des chiffres.");
                        }
                    }}
                />


                
 

              





                <Text style={styles.label}>
                    Poids moyen de fruit (en gramme)
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez le poids moyen de fruit..."
                    keyboardType="numeric"
                    value={PoidsMoyen.toString()}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text)) { 
                        setPoidsMoyen(text); 
                        } else {
                        Alert.alert("Erreur", "Veuillez entrer uniquement des chiffres.");
                        }
                    }}
                />

                



            </View>

            {
                !isKeyboardVisible && 
                <TouchableOpacity style={styles.createButton} onPress={handleSubmit} disabled={isLoading} >
                {
                    isLoading ? 
                    <>
                    <Text style={styles.createButtonText}>Traitement en cours...</Text>
                    </>
                    :
                    <>
                    <Ionicons name="add" size={18} color="#fff" />
                    <Text style={styles.createButtonText}>Créer la nouvelle serre</Text>
                    </>
                }
                </TouchableOpacity>
            }
        </View>
        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 30,
        paddingBottom: 0,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,      paddingBottom : 0

    },
    returnButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "flex-start",
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'InriaBold',
        fontSize: 22,
        color: '#141414',
    },
    elipsisButton: {
        width: 40,
        height: 40,
        padding: 0,
        alignItems: "flex-end",
        justifyContent: 'center',
    },
    formContainer: {
        marginTop: 20,
    },
    label: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
        marginBottom: 10,
    },
    required: {
        color: '#BE2929',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        height : 50,
        marginBottom: 20,
    },
    picker: {
        fontFamily: 'Inter',
        color: '#141414',
    },
    button: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        height : 50,
        alignItems : "center",
        justifyContent : "center",
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    videoInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    videoInfoText: {
        fontFamily : 'Inter',
        fontSize: 14,
        color: '#141414',
        marginBottom: 5,
    },
    boldText: {
        fontFamily: 'InterBold',
    },
    createButton: {
        backgroundColor: '#BE2929',
        borderRadius: 8,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        left: 20,
    },
    createButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#fff',
        marginLeft: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },

    highlight: {
        color: '#BE2929',
        fontFamily: 'InterBold',
      },
});
