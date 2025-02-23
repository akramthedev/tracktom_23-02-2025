import React, { useState, useRef, useCallback } from 'react';
import PopUpNavigate from "../Components/PopUpNavigate";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
    Image,Modal,
    TextInput,
    Alert
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons,Feather } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ENDPOINT_URL} from "../App";
import { useFonts } from 'expo-font';

function formateDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let hoursX = parseInt(hours);
    
    return `${hoursX}:${minutes} - ${day}/${month}/${year}`;
  }
  


export default function SingleFarm({route}) {
    const [fontsLoaded] = useFonts({
        'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
        'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
        "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
        "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
        "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
    });

    const navigation = useNavigation();
    const { id } = route.params;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const skeletonAnimation = useRef(new Animated.Value(0)).current;
    const [isModifyClicked, setisModifyClicked] = useState(false);
    const [isDeleteClicked, setisDeleteClicked] = useState(false);
    const [createdAt, setCreatedAt] = useState(null);
    const [serres , setSerres] = useState([]);
    const [fermeName , setFermeName ] = useState(null);
    const [commune,setcommune] = useState("");
    const [dataRecovery, setdataRecovery] = useState(false);

        

        useFocusEffect(
            useCallback(() => {
                const fetchData = async () => {
                    try {
                        Animated.loop(
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
          
                        const token = await AsyncStorage.getItem('Token');
          
                        const resp = await axios.get(`${ENDPOINT_URL}fermes/${id}`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
          
                        console.log("resp Ferme ===>", resp);
          
                        if (resp.status === 200) {
                            setFermeName(resp.data.fermes.nom_ferme);
                            setCreatedAt(resp.data.fermes.created_at);
                            setSerres(resp.data.fermes.serres);
                            setcommune(resp.data.fermes.commune);
                            setdataRecovery(resp.data.fermes);
                        }
                        
                         
                    } catch (e) {
                        console.log("error Ferme ===>", e);
                    } finally {
                        const timer = setTimeout(() => {
                            setIsLoading(false);
                        }, 167);
          
                        return () => clearTimeout(timer);
                    }
                };
          
                fetchData();
          
                return () => {};  // Cleanup function (optional)
            }, [id]) // Depend on `id` to refetch when it changes
          );
          


          const [isLoadingUpdate, setisLoadingUpdate] = useState(false);
          const [isCanceling, setisCanceling] = useState(false);




    const handleCancel = ()=>{
        setisCanceling(true);
        setFermeName(dataRecovery.nom_ferme);
        setcommune(dataRecovery.commune) 
        setisCanceling(false);
    }



    const handleSaveData = async()=>{


     
        if(fermeName === null || fermeName === "" || fermeName.length === 0){
            Alert.alert('Le champ Appelation ne peut pas etre vide.')
            return;
        }


        if(commune === null || commune === "" || commune.length === 0){
            Alert.alert('Le champ Appelation ne peut pas etre vide.')
            return;
        }



        setisLoadingUpdate(true);
        const token = await AsyncStorage.getItem('Token');
            try{
              let data = {
                nom_ferme : fermeName ? fermeName : "--", 
                commune : commune ? commune : "--"
              }
              
              const resp = await axios.put(`${ENDPOINT_URL}fermes/${id}`, data, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              if(resp.status === 200){
                setisLoadingUpdate(false);
                setisModifyClicked(false);
              }
              else{
                setisLoadingUpdate(false);
                Alert.alert("Une erreur est suvenue lors de la modification de la ferme.")
              }
            }
            catch(e){
                setisLoadingUpdate(false);
                console.log(e.message);
              Alert.alert("Une erreur est suvenue lors de la modification de la ferme.")     
            } 
       }


    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() =>{
                
                console.log(item);
                
                navigation.navigate('SingleSerre', { 
                    id: item.id,
                    created_at : item.created_at, 
                    nameSerre : item.name, 
                    poids_fruit : item.poids_fruit,
                    nbr_tiger : item.nbr_tiger,
                })

            }}
            style={styles.card}
            key={item.id}
        >
            <View style={styles.infosContainer}>
                <Text style={styles.kakakakakaka}>{item.name}</Text>
            </View>
            <View style={styles.carretRight}>
                <Ionicons name="chevron-forward" size={20} color="gray" />
            </View>
        </TouchableOpacity>
    );



    const handleDelete = async()=>{
        try{
            const token = await AsyncStorage.getItem('Token');
            const resp = await axios.delete(`${ENDPOINT_URL}fermes/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if(resp.status === 200){
              console.log("resp  =========>",resp);
              navigation.navigate("MesFermes")
            }
        }
        catch(e){
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
                        Cette action supprimera la ferme définitivement.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setisDeleteClicked(false)}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleDelete}
                            >
                                <Text style={styles.confirmButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <View style={styles.container}>
                <View style={styles.header}>
                    
                    
                {
                    !isLoading ?
                            <>
                            {
                                !isModifyClicked ? 
                                <>
                                    <View
                                        style={{
                                            position : "relative"
                                        }}
                                    >
                                        <TouchableOpacity 
                                            style={styles.addButton222}
                                            disabled={isLoadingUpdate}
                                            onPress={()=>{setisModifyClicked(true)}}
                                        >
                                            <Feather name="edit-2" size={17} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20, 
                                                backgroundColor: '#BE2929',
                                                borderWidth : 1,
                                                alignItems: 'center',
                                                borderColor : "#BE2929",
                                                justifyContent: 'center',
                                                position : "absolute", left : 48
                                            }}
                                            disabled={isLoadingUpdate || isLoading}
                                            onPress={()=>{
                                                setisDeleteClicked(true);
                                            }}  
                                        >
                                            <Feather name="trash" size={19} color="white" />
                                        </TouchableOpacity> 
                                    </View>
                                </>
                                :
                                <>
                                <View
                                        style={{
                                            position : "relative"
                                        }}
                                    >
                                        <TouchableOpacity 
                                            style={styles.addButton222}
                                            onPress={handleSaveData}  
                                            disabled={isLoadingUpdate}
                                        >
                                            <Feather name="check" size={17} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20, 
                                                backgroundColor: '#BE2929',
                                                borderWidth : 1,
                                                alignItems: 'center',
                                                borderColor : "#BE2929",
                                                justifyContent: 'center',
                                                position : "absolute", left : 48
                                            }}
                                            disabled={isCanceling}
                                            onPress={()=>{
                                                handleCancel();
                                                setisModifyClicked(false);
                                            }}  
                                        >
                                            <Feather name="x" size={19} color="white" />
                                        </TouchableOpacity> 
                                    </View>
                                </>
                            }
                            </>
                                    :
                                        <TouchableOpacity 
                                            style={styles.addButton2222}
                                        />
                }

                    <Text style={styles.title}>Détails Ferme</Text>
                    <TouchableOpacity
                        style={styles.elipsisButton}
                        onPress={() => setIsPopupVisible(!isPopupVisible)}
                    >
                        <Ionicons name="menu" size={24} color="#141414" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <>
                        

                        <View style={styles.skeletonDetailsContainer}>
                            <View style={styles.ViewLabel} />
                            <View style={styles.ViewLabel} />   
                            {[...Array(4)].map((_, index) => (
                                <View key={index} style={styles.skeletonRow}>
                                    <Animated.View
                                        style={[
                                            styles.skeletonLabel,
                                            {
                                                backgroundColor: skeletonBackground,
                                                width:
                                                    index === 0
                                                        ? '30%'
                                                        : index === 1
                                                        ? '23%'
                                                        : index === 2
                                                        ? '38%'
                                                        : '44%',
                                            },
                                        ]}
                                    />
                                    <Animated.View
                                        style={[
                                            styles.skeletonValue,
                                            {
                                                backgroundColor: skeletonBackground,
                                                width:
                                                    index === 0
                                                        ? '20%'
                                                        : index === 1
                                                        ? '49%'
                                                        : index === 2
                                                        ? '38%'
                                                        : '30%',
                                            },
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.skeletonSerresContainer}>
                            <Animated.View
                                style={[
                                    styles.skeletonTitle,
                                    { backgroundColor: skeletonBackground },
                                ]}
                            />
                            {[...Array(3)].map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.skeletonSerre,
                                        { backgroundColor: skeletonBackground },
                                    ]}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                       

                        <View style={styles.detailsContainer}>
                            <View style={styles.ViewLabel} />
                            <View style={styles.ViewLabel} />         
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Appelation :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{fermeName}</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez le nom..."
                                            value={fermeName}
                                            onChangeText={(text) => {
                                                setFermeName(text);  
                                            }}
                                        />
                                    }
                            </View>

                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Commune :</Text>
                                {
                                        !isModifyClicked ? 
                                        <Text style={styles.value}>{commune ? commune : "--"}</Text>
                                        :
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Entrez la commune..."
                                            value={commune}
                                            onChangeText={(text) => {
                                                setcommune(text);  
                                            }}
                                        />
                                    }
                            </View>
                            
                            <View style={styles.ViewLabel}>
                                <Text style={styles.TitleLabel}>Créée le :</Text>
                                <Text style={styles.value}>{createdAt ? formateDate(createdAt) : "--"}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.bottomBorder} />

                        <View style={styles.serresHeader}>
                            <Text style={styles.TitleLabel2462}>Serres associées : {serres.length}</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AjouterSerre',{ idFerme: id })}
                                style={styles.addSerre}
                            >
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={serres}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                        />
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
        marginTop: 0,
    },
    ViewLabel: {
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    bottomBorder : {
        borderBottomColor : "gainsboro", 
        borderBottomWidth : 1,
        marginBottom: 28,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    TitleLabel: {
        fontFamily : 'Inter',
        fontSize: 15,
        fontWeight : "bold",
        color: '#141414',
    },
    TitleLabel2: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
    },
    TitleLabel2462 :  {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#141414',
        fontWeight : "bold",
        width : 200,
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
        backgroundColor: '#FDECEC',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontFamily : 'Inter',
        fontSize: 15,
        color: '#BE2929',
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
        height : 40, 
        width : 40, 
        backgroundColor : "#BE2929",
        borderRadius : 100,
        alignItems : "center", 
        justifyContent : "center"
    },
    listContainer: {
        width : "100%", 
    },
    infosContainer : {
        width : "auto", 
        height : "auto",
        textAlign : "left",
    },
    card: {
        borderRadius: 0,
        height : 50,
        marginBottom : 0,
        alignItems : "center",
        paddingRight : 10,
        paddingLeft : 10,
        justifyContent : "space-between",
        flexDirection :"row",
    },
    kakakakakaka : {
        fontFamily : 'Inter',
        fontSize : 15
    },

    serresHeader : {
        marginBottom: 20,
        flexDirection: "row",
        alignItems : "center",
        justifyContent: "space-between",
    },
    skeletonImageContainer: { alignItems: 'center', marginBottom: 20 },
    skeletonProfileImage: { width: 106, height: 106, borderRadius: 15 },
    skeletonDetailsContainer: { marginBottom: 20 },
    skeletonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    skeletonLabel: { height: 15, borderRadius: 6 },
    skeletonValue: { height: 15, borderRadius: 6 },
    skeletonSerresContainer: { marginTop: 20 },
    skeletonTitle: { height: 20, width: '60%', borderRadius: 6, marginBottom: 15 },
    skeletonSerre: { height: 40, borderRadius: 6, marginBottom: 10 },

    addButton222: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#BE2929',
        alignItems: 'center',
        justifyContent: 'center',
      },
      addButton2222 : {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
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
            height : 40, 
            borderRadius : 7, 
            paddingLeft : 10, 
            paddingRight : 10
        },

});
