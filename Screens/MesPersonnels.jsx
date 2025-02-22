import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import axios from "axios";
import {ENDPOINT_URL} from "../App";
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenWidth = Dimensions.get("window").width;



function formateDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
  const year = date.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
}


export default function MesPersonnels({ route }) {
    


    const [isLoading, setIsLoading] = useState(true);
    const animation = useRef(new Animated.Value(0)).current;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [staff, setStaff] = useState(false);
    const [fontsLoaded] = useFonts({
      'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
      'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
      "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
      "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
      "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
  });

    const startWavyAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 399,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 399,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };




  //   useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             setIsLoading(true);
  //             startWavyAnimation();
  //         } finally {
  //             setIsLoading(false);
  //         }
  //     };
  //     fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true);
            startWavyAnimation();
            const token = await AsyncStorage.getItem('Token');
            console.log("token  =====>",token);

            const resp = await axios.get(`${ENDPOINT_URL}staff`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log("resp Ferme ===>" ,resp);
            if(resp.status === 200){
                console.log(resp.data[0]);
                setStaff(resp.data);
            }
        }catch(e){
              console.log("error Ferme ===>",e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
}, []);


    const navigation = useNavigation();


  
    const renderItem = ({ item }) => (
      <TouchableOpacity 
        onPress={()=>{
          navigation.navigate('ProfilOthers', 
            {
              id : item.id, 
              type : item.role.name, 
              fullName : item.user.name, 
              image : item.user.image, 
              email : item.user.email, 
              createdAt : item.created_at
            });
        }}
        style={styles.card}
        key={item.id}
      >
        <View style={styles.imageContainer}>
          <Image
              source={require('../images/avatar.jpg')}
              style={styles.imageInsider}
          />
        </View>
        <View style={styles.infosContainer}>
          <Text style={styles.textInfos1}>{item.user.name}</Text>
          <Text style={styles.textInfos2}>{item.user.email}</Text>
          <Text style={styles.textInfos2}>{item.user.created_at ? formateDate(item.user.created_at) : ""}</Text>
          {/* <Text style={styles.textInfos3}>{item.mobile}</Text> */}
        </View>
        <View style={styles.carretRight}>
          <Ionicons name="chevron-forward" size={20} color="gray" />
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
                                    staff && staff.length >= 1 && 
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
                                      Total : {staff.length}
                                    </Text>
                                  </View>
                                  }
          
          {
              !isLoading ? 
              <TouchableOpacity 
                style={styles.addButton}
                onPress={()=>{
                  navigation.navigate('AjouterPersonnel')
                }}  
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity> 
                :
              <TouchableOpacity style={styles.addButton2} />
          }

          <Text style={styles.title}>Mes Personnels</Text>
          <TouchableOpacity 
            onPress={() => setIsPopupVisible(!isPopupVisible)}
            style={styles.elipsisButton}
          >
            <Ionicons name="menu" size={24} color="#141414" />
          </TouchableOpacity>
        </View>
  
        


              {isLoading ? (
                  <View style={styles.skeletonContainer}>
                      {[...Array(3)].map((_, index) => (
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
                              <View style={styles.imageSkeletonContainer}>
                                  <View style={styles.skeletonCircle} />
                              </View>
                              <View style={styles.textSkeletonContainer}>
                                   <View style={styles.skeletonLine} />
                                  <View style={styles.skeletonLineShort} />
                                  <View style={styles.skeletonLineMedium} />
                                  <View style={styles.skeletonLineVeryShort} />
                              </View>
                          </Animated.View>
                      ))}
                  </View>
              ) : (




                                   <>
                                                            {
                                                              staff.length === 0 ? 
                                                              <View style={{
                                                                        flex : 0.85, 
                                                                        backgroundColor : "white", 
                                                                        alignItems : "center", 
                                                                        justifyContent : "center", 
                                                                      }} >
                                                                        <Text style={{color : "gray", fontSize : 14, textAlign : "center"}}  >
                                                                          Aucune donnée
                                                                        </Text>
                                                              </View>  
                                                              :
                                                              <FlatList
                                                                  data={staff}
                                                                  renderItem={renderItem}
                                                                  keyExtractor={(item) => item.id}
                                                                  contentContainerStyle={styles.listContainer}
                                                                  showsVerticalScrollIndicator={false}
                                                                />
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
      paddingTop : 30,
      paddingBottom: 0 ,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 20,
      position: "relative"
 
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
      fontFamily : 'InriaBold',
      fontSize: 22,
      color: '#141414',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop : 20,
    },
    card: {
      borderRadius: 0,
      textAlign : "center",
      height : "auto",
      flexDirection :"row",
      marginBottom: 34,
      shadowColor: 'gray',
    },
    infosContainer : {
      width : "auto", 
      height : "auto",
      textAlign : "left",
      justifyContent : "center"
    },
    textInfos1: {
      width : "100%", 
      textAlign : "left", 
      fontFamily : 'Inter',
      fontSize : 17,
      fontWeight : "bold",
      color :"rgb(78, 78, 78)" ,

  },
    textInfos2 : {
      width : "100%", 
      textAlign : "left", 
      fontFamily : 'Inter',
      fontSize : 15,
      color : "gray",
    },
    textInfos3 : {
      width : "100%", 
      textAlign : "left", 
      fontFamily : 'Inter',
      fontSize : 15,      
      color : "gray",
    },
    imageContainer : {
      height : 58,
      width : 58, 
      marginRight : 13, 
    },
    imageInsider : {
      height : 58,
      width : 58, 
      borderRadius : 100,
      objectFit :"cover",
    },


    carretRight : {
      height : "100%", 
      justifyContent : "center", 
      alignItems : "center", 
      position : "absolute", 
      right : 0
    },

    label: {
      fontFamily : 'Inter',
      fontSize: 15,
      color: '#141414',
      fontWeight : "600",
      marginBottom: 4,
      flexDirection  :"row",
      justifyContent : "space-between"
    },
    value: {
      fontFamily : 'Inter',
      fontSize: 15,
      color: '#141414',
      textAlign : "right"
    },
    value0 : {
      fontFamily : 'Inter',
      fontSize: 15,
      color: '#141414',
      fontWeight : "600",
    },
    highlight: {
      color: '#BE2929',
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
  skeletonCard: {
  backgroundColor: '#f0f0f0',
  borderRadius: 12,
  marginBottom: 16,
  height: 100,
  flexDirection: 'row',
  padding: 10,
},
imageSkeletonContainer: {
  width: 80,
  alignItems: 'center',
  justifyContent: 'center',
},
skeletonCircle: {
  height: 66,
  width: 66,
  borderRadius: 33,
  backgroundColor: '#e0e0e0',
},
textSkeletonContainer: {
  flex: 1,
  justifyContent: 'center',
  paddingLeft: 10,
},
  skeletonLine: {
    marginTop : 10,
    height: 13,
    width : "80%",
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '50%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineMedium: {
    width: '70%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8, 
  },
  skeletonLineVeryShort : {
    width: '30%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8, 
  },
  addButton2 : {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
    
});



