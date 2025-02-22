import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {ENDPOINT_URL} from "../App";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Keyboard } from 'react-native';







export default function AjouterFerme({route}) {




    
const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
    'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
    "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
    "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
    "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
});


     const navigation = useNavigation();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [commune, setcommune] = useState("");
    const [appelation, setappelation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

 
    

       

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

    


        
        const handleSubmit = async () => {

            if (!appelation) {
                Alert.alert("Le champ `Nom` de ferme est obligatoire.")
                return;
            }

            setIsLoading(true);


            const formData = new FormData();
            formData.append('nom_ferme', appelation);
            formData.append('commune', commune ? commune : "--");
            formData.append('surface', 666);

            


            try{
                const token = await AsyncStorage.getItem('Token');
                
                const resp = await axios.post(`${ENDPOINT_URL}fermes`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }); 

                
                if(resp.status === 201){
                    setappelation("");
                    setcommune("");
                    setIsLoading(false);
                    navigation.navigate("MesFermes");
                }
                else{
                    setIsLoading(false);
                    Alert.alert('Une erreur est survenue lors de la création de la ferme.');
                }
              }
        
            catch(e){
                setIsLoading(false);
                Alert.alert('Une erreur est survenue lors de la création de la ferme.');
                console.log(e);
            } 

        }
    



    
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
                <Text style={styles.title}>Nouvelle Ferme</Text>
                <TouchableOpacity 
                    onPress={() => setIsPopupVisible(!isPopupVisible)}
                    style={styles.elipsisButton}
                >                    
                    <Ionicons name="menu" size={24} color="#141414" />
                </TouchableOpacity>
            </View>


            <View style={styles.formContainer}>


                <Text style={styles.label}>
                    Nom&nbsp;<Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                    style={styles.input}
                    value={appelation}
                    onChangeText={setappelation}
                    placeholder="Veuillez saisir l'appelation..."
                    keyboardType="default"
                />

 
                <Text style={styles.label}>
                    Commune
                </Text>
                <TextInput
                    style={styles.input}
                    value={commune}
                    onChangeText={setcommune}
                    placeholder="Veuillez saisir la localisation..."
                    keyboardType="default"
                />



 
            </View>

            {
                isLoading ? 
                <TouchableOpacity style={styles.createButton} disabled={isLoading} >
                    <Text style={styles.createButtonText}>Traitement en cours...</Text>
                </TouchableOpacity>
                :
                <>
                {
                    !isKeyboardVisible &&
                    <TouchableOpacity style={styles.createButton} onPress={handleSubmit} disabled={isLoading} >
                        <Ionicons name="add" size={18} color="#fff" />
                        <Text style={styles.createButtonText}>
                            {
                                isLoading ? "Traitement en cours..." : "Créer la nouvelle ferme"
                            }
                        </Text>
                    </TouchableOpacity>                    
                }
                </>
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
        fontFamily : 'InriaBold',
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
        color : "gray"
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

    deleteButton: {
        backgroundColor: '#BE2929',
        borderRadius: 50,
        height : 24, width : 24,
        alignItems: 'center',
        justifyContent: 'center',
        position : 'absolute',
        right : 0
    },

    required: {
        color: '#BE2929',
    },
});
