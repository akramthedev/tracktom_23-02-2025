import React, { useState, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Animated,
    Alert,
    Dimensions
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from "axios";
import { ENDPOINT_URL } from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
const screenWidth = Dimensions.get("window").width;



function formateDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  let hoursX = parseInt(hours);

  if(hoursX === "24" || hoursX === 24){
    hoursX = "00"
  }
  
  return `${hoursX}:${minutes} - ${day}/${month}/${year}`;
}



export default function MesCalculs({ route }) {

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [DATA, setDATA] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  
    const animation = useRef(new Animated.Value(0)).current;  
    const [selectedButton, setSelectedButton] = useState('dateDesc');
    const navigation = useNavigation();
    const flatListRef = useRef(null);

    const [fontsLoaded] = useFonts({
      'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
      'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
      "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
      "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
      "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
  });



  


  const fetchData = async () => {
    try {
      startWavyAnimation(); 
      const token = await AsyncStorage.getItem('Token');
      const resp = await axios.get(`${ENDPOINT_URL}predictions`, {
        headers:{
          Authorization : `Bearer ${token}`
        }
      });
      if (resp.status === 200) {
        setDATA(resp.data);
      } else {
        setDATA([]);
      }
    } catch (e) {
      Alert.alert('Oups, une erreur est survenue lors de la récupération de vos données.');              
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  }




    useFocusEffect(
          useCallback(() => {  
            fetchData();
            return () => {};  
        }, [])
    );
  


    const sortByMostTomatoes = () => {
      const sorted = [...DATA].sort((a, b) => b.classeTotale - a.classeTotale);
      
      setDATA(sorted);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  
    const sortByDateAsc = () => {
      const sorted = [...DATA].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setDATA(sorted);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  
    const sortByDateDesc = () => {
      const sorted = [...DATA].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setDATA(sorted);
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }



    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 390,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 390,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };




    const renderItem = ({ item }) => (
      <TouchableOpacity 
        onPress={() => {
          navigation.navigate('SingleCalcul', { 
            id: item.id,
            classeTotale : item.classeTotale,
            created_at : item.created_at,
            nom_ferme : item.ferme.nom_ferme,
            commune : item.ferme.commune,
            ferme_id : item.ferme_id,
            serre_id : item.serre_id,
            nom_serre : item.serre.name,
            superficie : item.superficie,
            stemsDetected : item.stemsDetected,
            traitement_videos_sum_classe1 : item.traitement_videos_sum_classe1,
            traitement_videos_sum_classe2 : item.traitement_videos_sum_classe2,
            traitement_videos_sum_classe3 : item.traitement_videos_sum_classe3,
            traitement_videos_sum_classe4 : item.traitement_videos_sum_classe4,
            traitement_videos_sum_classe5 : item.traitement_videos_sum_classe5,
            traitement_videos_sum_classe6 : item.traitement_videos_sum_classe6,
            traitement_videos_sum_classe7 : item.traitement_videos_sum_classe7
          });
        }}
        style={styles.card}
        key={item.id}
      >
        <View style={styles.label}>
          <Text style={styles.value0}>Ferme : </Text>
          <Text style={styles.value}>{item.ferme ? item.ferme.nom_ferme : "---"}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Serre : </Text>
          <Text style={styles.value}>{item.serre? item.serre.name : "---"}</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Tomates détectées :</Text>
          <Text style={[styles.value, styles.highlight]}>{item.classeTotale} tomates</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Tiges détectées :</Text>
          <Text style={[styles.value, styles.highlight]}>{item.stemsDetected} tiges</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Nombre de mètres :</Text>
          <Text style={[styles.value, styles.highlight]}>{item.superficie ? item.superficie : "0"} mètres</Text>
        </View>
        <View style={styles.label}>
          <Text style={styles.value0}>Date du calcul : </Text>
          <Text style={styles.valueX}>{formateDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );











    
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
        {
          DATA && DATA.length >= 1 && 
          <View
          style={{
            position: "absolute",
            top: 58,
            left: screenWidth / 2 - 109,  
            width: 200,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter",
              fontSize: 13,
              color: "gray",
            }}
          >
            Total : {DATA.length}
          </Text>
        </View>
        }
          {
              !isLoading ? 
              <TouchableOpacity 
                style={styles.addButton}
                onPress={()=>{
                  navigation.navigate('AjouterCalcul')
                }}  
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity> 
                :
              <TouchableOpacity style={styles.addButton2} />
          }
          <Text style={styles.title}>
            Mes Calculs
          </Text>
          <TouchableOpacity 
            onPress={() => setIsPopupVisible(!isPopupVisible)}
            style={styles.elipsisButton}
          >
            <Ionicons name="menu" size={24} color="#141414" />
          </TouchableOpacity>
        </View>

       
        <View style={styles.filterContainer}>
          
          <TouchableOpacity onPress={() =>{ 
              setSelectedButton('dateDesc');
              if(selectedButton !== "dateDesc"){
                sortByDateDesc();
              }
            }} style={[styles.filterButton, selectedButton === 'dateDesc' && styles.selectedButton]}>
            <Text style={[styles.filterText, selectedButton === 'dateDesc' && styles.selectedText]} >Plus récent</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ 
              setSelectedButton('dateAsc');
              if(selectedButton !== "dateAsc"){
                sortByDateAsc();
              }
            }} style={[styles.filterButton, selectedButton === 'dateAsc' && styles.selectedButton]}>
            <Text style={[styles.filterText, selectedButton === 'dateAsc' && styles.selectedText]} >Plus ancien</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ 
              setSelectedButton('mostTomatoes');
              if(selectedButton !== "mostTomatoes"){
                sortByMostTomatoes();
              }
            }}
            
            style={[styles.filterButton, selectedButton === 'mostTomatoes' && styles.selectedButton]}>
            <Text style={[styles.filterText, selectedButton === 'mostTomatoes' && styles.selectedText]} >Plus de tomates</Text>
          </TouchableOpacity>
          
        </View>


        {isLoading ? (
            <View style={styles.skeletonContainer}>
                {[...Array(2)].map((_, index) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.skeletonCard,
                            {
                                opacity: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0.4],
                                }),
                            },
                        ]}
                    >
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel1}></Text>
                            <View style={styles.skeletonLine} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel2}></Text>
                            <View style={styles.skeletonLine2} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel3}></Text>
                            <View style={styles.skeletonHighlight} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel4}></Text>
                            <View style={styles.skeletonHighlight2} />
                        </View>
                        <View style={styles.skeletonRow}>
                            <Text style={styles.skeletonLabel5}></Text>
                            <View style={styles.skeletonLineShort} />
                        </View>
                    </Animated.View>
                ))}
            </View>
        ) : (
            <>
            {
              DATA.length === 0 ? 
              <View style={{
                        flex : 0.85, 
                        backgroundColor : "white", 
                        alignItems : "center", 
                        justifyContent : "center", 
                      }} >
                        
                        <Text style={{color : "gray", fontSize : 14, textAlign : "center"}}  >
                                    Aucune donnée...
                                  </Text>
                                  <Text style={{color : "gray", fontSize : 14, textAlign : "center", padding : 30, paddingTop : 13}}  >
                                    Créez votre première prédiction en cliquant sur le bouton en haut à gauche.
                                  </Text>
              </View>  
              :
            <>

             

              <FlatList
                  ref={flatListRef}
                  data={DATA}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                  refreshing={isLoading}
                  onRefresh={fetchData}
              />
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
      paddingBottom: 0 ,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
      paddingBottom : 15, 
      position : "relative"
    },
    addButton: {
      width: 30,
      height: 30,
      borderRadius: 20,
      backgroundColor: '#BE2929',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 22,
      color: '#141414',
      fontFamily : 'InriaBold'
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop : 20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom:20,
      shadowColor: 'gray',
      shadowOffset: { width: 0, height: 1 }, // Reduced height to bring shadow closer
      shadowOpacity: 0.04, // Reduced opacity to make the shadow lighter
      shadowRadius: 6, // Reduced radius to make the shadow sharper
      elevation: 4, // Reduced elevation for Android
      borderWidth : 1, 
      borderColor : "#f7f7f7"
    },
    label: {
      fontSize: 15,
      color: '#141414',
      fontWeight : "bold",
      fontFamily : 'Inter',
      marginBottom: 4,
      flexDirection  :"row",
      justifyContent : "space-between"
    },
    value: {
      fontSize: 15,
      color: '#141414',
      fontFamily : 'Inter',
      textAlign : "right"
    },
    valueX: {
      fontSize: 14,
      color: '#141414',
      fontFamily : 'Inter',
      textAlign : "right"
    },
    value0 : {
      fontSize: 15,
      color: '#141414',
      fontWeight : "bold",
      fontFamily : 'Inter',
    },
    highlight: {
      color: '#BE2929',
      fontFamily : 'Inter',
      fontWeight : "bold"
    },
    elipsisButton : {
      width: 40,
      height: 40,
      padding : 0,
      alignItems: "flex-end",
      justifyContent: 'center',
    },
    skeletonContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    
  

    skeletonContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
  },
  skeletonCard: {
      backgroundColor: '#f0f0f0',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
  },
  skeletonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  
  skeletonLine: {
      width: '50%',
      height: 10,
      backgroundColor: '#e0e0e0',    
      borderRadius: 6,
  },
  skeletonLineShort: {
      width: '40%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
  },
  skeletonHighlight: {
      width: '12%',
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
  },

  skeletonHighlight2: {
    width: '20%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
},skeletonLine2: {
  width: '35%',
  height: 10,
  backgroundColor: '#e0e0e0',    
  borderRadius: 6,
},
  skeletonLabel1: {
    width: '17%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,        
},

skeletonLabel2: {
  width: '13%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel3: {
  width: '44%',    
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel4: {
  width: '34%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
skeletonLabel5: {
  width: '38%',
  height: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 6,        
},
addButton2 : {
  width: 30,
  height: 30,
  borderRadius: 20,
  backgroundColor: 'white',
  alignItems: 'center',
  justifyContent: 'center',
},

filterContainer: {
  flexDirection: 'row',
  justifyContent: "space-between",
  marginBottom: 20,
  marginTop : 10, 
  paddingLeft : 20, 
  paddingRight : 20
},
filterButton: {
  padding: 10,
  paddingLeft : 12, paddingRight : 12, 
  backgroundColor: '#f5f5f5',
  borderRadius: 7,
},

selectedButton : {
  backgroundColor: '#BE2929',
  padding: 10,
  paddingLeft : 12, paddingRight : 12, 
  borderRadius: 7,

},
filterText: {
  color: '#141414',
  fontSize: 13.4,
  fontFamily : "Inter", 
  letterSpacing : -0.4
},


selectedText: {
  color: 'white',
  fontSize: 13.4,
  fontFamily : "Inter", 
  letterSpacing : -0.4
},

});