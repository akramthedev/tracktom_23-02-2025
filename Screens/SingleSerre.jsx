import React, { useState, useEffect, useRef } from 'react';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useFonts } from 'expo-font';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from "axios";
import {ENDPOINT_URL} from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';






function formatDate(dateString) {
    const date = new Date(dateString); // Convert to Date object
  
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad if necessary
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (1-based)
    const year = date.getUTCFullYear(); // Get year
  
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }




export default function SingleSerre({route}) {



    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [cancel, setCancel] = useState(false);


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

    



    const [fontsLoaded] = useFonts({
        'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
        'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
        "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
        "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
        "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
    });



    const [isModifyClicked, setisModifyClicked] = useState(false);
    const [isDeleteClicked, setisDeleteClicked] = useState(false);
    const [appelation, setAppelation] = useState(null);
    const [Nombre__X, setNombre__X] = useState("");
    const [Nombre__XRecovery, setNombre__XRecovery] = useState("");
    const navigation = useNavigation();
    const { id, created_at, nameSerre, poids_fruit, nbr_tiger} = route.params; 
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const skeletonAnimation = useRef(new Animated.Value(0)).current;
    const [isDeleting, setisDeleting] = useState(false);
    const [PoidsMoyen, setPoidsMoyen] = useState("");
    const [PoidsMoyenRecovery, setPoidsMoyenRecovery] = useState("");



   
                

    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });









                 

    useEffect(() => {
        let animationLoop = null; // Initialize animationLoop as null
        let timer = null; // Initialize timer as null
    
        const fetchData = async () => {
            if (id) { // Only run if `id` is truthy
                try {
                    // Start the skeleton animation
                    animationLoop = Animated.loop(
                        Animated.sequence([
                            Animated.timing(skeletonAnimation, {
                                toValue: 1,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                            Animated.timing(skeletonAnimation, {
                                toValue: 0,
                                duration: 500,
                                useNativeDriver: true,
                            }),
                        ])
                    ).start();
    
                    // Simulate a delay (e.g., fetching data)
                    setIsLoading(false);
    
                    // Update state or perform other actions


                    let NT = 0;
                    if(nbr_tiger === null){
                        NT = 0;
                    }
                    else{
                        NT = parseInt(nbr_tiger);
                    }

                    let PF = 0;
                    if(poids_fruit === null){
                        PF = 0;
                    }
                    else{
                        PF = parseInt(poids_fruit);
                    }


                    setAppelation(nameSerre);
                    setPoidsMoyen(PF);
                    setPoidsMoyenRecovery(PF);
                    setNombre__X(NT);
                    setNombre__XRecovery(NT);

                } catch (error) {
                    console.error("Error fetching data:", error);
                    setIsLoading(false); // Stop loading in case of error
                    if (animationLoop) {
                        animationLoop.stop(); // Stop the animation on error
                    }
                }
            }
        };
    
        fetchData(); // Call the fetchData function
    
        // Cleanup function
        return () => {
            if (timer) {
                clearTimeout(timer); // Clear the timeout
            }
            if (animationLoop) {
                animationLoop.stop(); // Stop the animation
            }
        };
    }, [skeletonAnimation, id, nameSerre]); // Add dependencies




    const handleCanceld = ()=>{
        setCancel(true);
        setNombre__X(Nombre__XRecovery);
        setPoidsMoyen(PoidsMoyenRecovery);
        setAppelation(nameSerre);
        setCancel(false);
    }




 



 
    const [IsLoadingUpdates, setIsLoadingUpdates] = useState(false);

    
 
    const handleSaveData = async()=>{


        if(appelation.length === 0 || appelation === "" || appelation === null){
            Alert.alert("Le champ Appelation ne peut pas etre vide");
            return;
        }

        const XXX = Nombre__X ? parseInt(Nombre__X) || 0 : 0;
        const PM = PoidsMoyen ? parseInt(PoidsMoyen) || 0 : 0;


        setIsLoadingUpdates(true);
            const token = await AsyncStorage.getItem('Token');
        try{
              let data = {
                name: appelation?.toString() || "",
                nbr_tiger: XXX,
                poids_fruit: PM
            }
              
              const resp = await axios.put(`${ENDPOINT_URL}serres/${id}`, data, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                console.log("resp =====>",resp.data)
                setisModifyClicked(false);
                setIsLoadingUpdates(false);
              }
              else{
                setIsLoadingUpdates(false);
                Alert.alert('Une erreur est survenue lors de la modification de la serre.')
              }
            }
            catch(e){
                setIsLoadingUpdates(false);
              console.log(e.message);
              Alert.alert('Une erreur est survenue lors de la modification de la serre.')     
            } finally{
                setIsLoadingUpdates(false);
            }
       }

  
      

    const handleDelete = async ()=>{
        try{
            setisDeleting(true);
            const token = await AsyncStorage.getItem('Token');
            const resp = await axios.delete(`${ENDPOINT_URL}serres/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp.status === 200){
                setisDeleting(false);
                setisDeleteClicked(false);
                navigation.goBack();
            }
            else{
                setisDeleting(false);

                setisDeleteClicked(false);
                Alert.alert('Une erreur est survenue lors de la suppresion de la serre.');
            }
        }
        catch(e){
            setisDeleting(false);
            setisDeleteClicked(false);
            Alert.alert('Une erreur est survenue lors de la suppresion de la serre.');
            console.log(e.message);
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






            <Modal
                transparent={true}
                visible={isDeleteClicked}
                animationType="fade"
                onRequestClose={() => setisDeleteClicked(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                        Confirmer la suppression
                        </Text>
                        <Text style={styles.modalMessage}>
                        Cette action supprimera la serre définitivement.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                disabled={isDeleting}
                                onPress={() => setisDeleteClicked(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleDelete}
                                disabled={isDeleting}
                            >
                                <Text style={styles.confirmButtonText}>
                                {
                                    isDeleting ? "Suppression..."
                                    :
                                    "Supprimer"    
                                }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


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
                    <Text style={styles.title}>Détails Serre</Text>
                    <TouchableOpacity 
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                        style={styles.elipsisButton}
                    >
                        <Ionicons name="menu" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading ? (
                    <>
                        <View style={styles.skeletonContainer}>
                            {[...Array(4)].map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.skeletonRow,  
                                        { 
                                            backgroundColor: skeletonBackground,  
                                            width: index === 0 ? '30%' 
                                            : index === 1 ? '60%' 
                                            : index === 2 ? '40%'
                                            : index === 3 ? '70%'
                                            :  '37%'
                                            
                                        },
                                    ]}
                                />
                            ))}
                        </View>

                        
                        {/* Skeleton for Buttons */}
                        <View style={styles.skeletonButtonContainer}>
                            <Animated.View
                                style={[
                                    styles.skeletonButton,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            <Animated.View
                                style={[
                                    styles.skeletonButton,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                        </View>

                        
                    </>
                ) : (
                    <>

                        <View style={styles.detailsContainer}>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Appelation :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{appelation}</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez le nom..."
                                            value={appelation}
                                            onChangeText={(text) => {
                                                setAppelation(text);  
                                            }}
                                        />
                                    }
                            </View>
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Nombre de tiges par mètre :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{Nombre__X !== null && Nombre__X !== "" ? Nombre__X : 0} tiges</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez le nombre..."
                                            keyboardType="number-pad"
                                            onChangeText={(text) => {
                                                if (/^\d*$/.test(text)) { // Vérifie si le texte contient uniquement des chiffres
                                                setNombre__X(text); // Met à jour l’état
                                                } else {
                                                Alert.alert("Erreur", "Veuillez entrer uniquement des chiffres.");
                                                }
                                            }}
                                            value={Nombre__X.toString()}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        />
                                }
                            </View>


                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Poids moyen de fruit : </Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{PoidsMoyen !== null && PoidsMoyen !== "" ? PoidsMoyen : 0} grammes</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez le nombre..."
                                            keyboardType="number-pad"
                                            onChangeText={(text) => {
                                                if (/^\d*$/.test(text)) { // Vérifie si le texte contient uniquement des chiffres
                                                setPoidsMoyen(text); // Met à jour l’état
                                                } else {
                                                Alert.alert("Erreur", "Veuillez entrer uniquement des chiffres.");
                                                }
                                            }}
                                            value={PoidsMoyen.toString()}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        />
                                }
                            </View>


                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Date de création :</Text>
                                <Text style={styles.value}>
                                    {
                                        created_at && formatDate(created_at)
                                    }
                                </Text>
                            </View>
                        </View>

                        {
                            !isModifyClicked ? 
                            <>
                                <View
                            style={styles.buttonContainerX}
                        >
                            <TouchableOpacity style={styles.deleteButton2} 
                                onPress={()=>{
                                    setisDeleteClicked(true);
                                }}
                            >
                                <Text style={styles.deleteButtonText2} >
                                    Supprimer
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editButton}
                                onPress={()=>{
                                    setisModifyClicked(true);
                                }}
                            >
                                <Text style={styles.editButtonText} >
                                    Modifier la serre
                                </Text>
                            </TouchableOpacity>
                        </View>
                            </>
                            :
                            <>
                        <View   
                            style={styles.buttonContainerX}
                        >
                            {
                                !isKeyboardVisible && 
                                <TouchableOpacity  disabled={cancel} style={styles.deleteButton} 
                                    onPress={()=>{
                                        handleCanceld();
                                        setisModifyClicked(false);
                                    }}
                                >
                                    <Text style={styles.deleteButtonText} >
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            }
                            {
                                IsLoadingUpdates ? 
                                <TouchableOpacity  disabled={IsLoadingUpdates} style={styles.editButton}
                                >
                                    <Text style={styles.editButtonText} >
                                        Sauvegarde en cours...
                                    </Text>
                                </TouchableOpacity>
                                :
                                <>
                                {
                                    !isKeyboardVisible && 
                                    <TouchableOpacity style={styles.editButton}
                                        onPress={handleSaveData}
                                        disabled={IsLoadingUpdates}
                                    >
                                        <Text style={styles.editButtonText} >
                                            Sauvegarder
                                        </Text>
                                    </TouchableOpacity>
                                }
                                </>
                            }
                        </View>
                            </> 
                        }
 
                    </>
                )}
        </View>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 0,
        paddingHorizontal: 20,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingBottom : 0

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
    skeletonContainer: {
        marginTop: 20,
    },
    skeletonRow: {
        height: 20,
        borderRadius: 8,
        marginBottom: 15,
    },
    
    skeletonButtonContainer: {
        marginTop: 20,
    },
    skeletonButton: {
        height: 50,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%',
    },
    detailsContainer: {
        marginBottom: 20,
        marginTop: 30,
    },
    ViewLabel: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    TitleLabel: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    value: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
        textAlign: "right",
    },
    valueHighlight: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#BE2929',
        textAlign: "right",
    },
    buttonContainer: {
        marginTop: 20,
    },
    videoButton: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
        paddingVertical: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    videoButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    deleteButton: {
        backgroundColor: '#E6E6E6',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
    },
    deleteButton2: {
        backgroundColor: '#E6E6E6',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        width : "30%"
    },
    deleteButtonText2: {
        fontFamily : 'Inter',
        fontSize: 15,
    },
    imageContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 106,
        height: 106,
        borderRadius: 15,
    },
    HRHR2 : {
        width : '100%', 
        height : 1, 
        backgroundColor : "white", 
        marginBottom : 20,
    },
    HRHR : {
        width : '100%', 
        height : 1, 
        backgroundColor : "#E6E6E6", 
        marginBottom : 20,
    },
    addSerre : {
        height : 30, 
        width : 30, 
        backgroundColor : "#BE2929",
        borderRadius : 100,
        alignItems : "center", 
        justifyContent : "center"
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop : 20,
    },
    infosContainer : {
        width : "auto", 
        height : "auto",
        textAlign : "left",
        justifyContent : "center" 
    },
    buttonContainerX : {
        position : 'absolute',
        bottom : 20, 
        right : 20, 
        left : 20,
        flexDirection : "row", 
        justifyContent : "space-between"
    },
    deleteButton : {
        backgroundColor: '#FDECEC',
        borderRadius: 8,
        width : "30%",
        height : 52,
        alignItems : "center", 
        justifyContent : "center",
    },
    deleteButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#BE2929',
        textAlign : "center",
    },
    editButton: {
        backgroundColor: '#BE2929',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width : "66%",
        height : 52,
        alignItems : "center", 
        justifyContent : "center"
    },
    editButtonCustomize : {
        width : "100%",
    },
    editButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#fff',
        textAlign : "center"
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 18,
        paddingTop : 20,
        paddingBottom : 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily : 'Inter',
        fontSize: 18,
        fontWeight : "bold",
        color: '#141414',
        marginBottom: 10,
    },
    modalMessage: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E6E6E6',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    confirmButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#BE2929',
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: 'white',
    },
    
    input : {
        borderWidth : 1, 
        borderColor : "gainsboro",
        width : "50%", 
        fontFamily : "Inter",
        height : 40, 
        borderRadius : 7, 
        paddingLeft : 10, 
        paddingRight : 10
    },

});


