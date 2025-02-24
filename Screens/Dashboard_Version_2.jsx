import React, { useState, useEffect } from 'react';
import CustomizedPieChart from '../Components/CustomizedPieChart'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,ImageBackground,
  TouchableOpacity,
  Modal,Image,
  Alert,
  Linking
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';  
import { useFonts } from 'expo-font';
import { ENDPOINT_URL } from '../App';
import axios from "axios";
import PopUpNavigate from "../Components/PopUpNavigate";
import { BarChart} from "react-native-gifted-charts";
import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { useNavigation } from '@react-navigation/native';
import {DOWNLOAD_URL} from "../App";




 
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



//hello ?, 


function formatPoids(kg) {
  // Ensure kg is a valid number
  if (!kg || isNaN(kg) || kg === undefined || kg === null ) {
    return '0 Kg';  // Return a default value instead of '--'
  }

  let KKGG = parseFloat(kg);
  
  if (KKGG >= 500) {
    return (KKGG / 1000).toFixed(1) + ' t';
  } else {
    return KKGG.toFixed(1) + ' Kg';
  }
}


function formatNumberK(num) {
  if (typeof num !== "number" || isNaN(num) || num == null || num === undefined || num === "" || num === 0) {
      return "0";
  }
  return num > 9999 ? Math.floor(num / 1000) + "K+" : num.toString();
}




const classColors = {
  classe_A: "#5D9B4B", // Dark Red
  classe_B: "#8DC63F", // Tomato
  classe_C: "#B9D92D", // Orange
  classe_D: "#FFA500", // Green Yellow
  classe_E: "#FF4D00", // Dark Green
  classe_F: "#D32F2F", // Dark Green
};

 
 




export default function DashBoard({ route }) {


  const navigation = useNavigation();
  const [unitéChoisie, setUnitéChoisie] = useState("kilogramme");
  const [unitéChoisieValue, setunitéChoisieValue] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);
  const [chartType, setChartType] = useState("Bar");
  const [selectedFarmIndex, setSelectedFarmIndex] = useState(-1);
  const [selectedGreenhouseIndex, setSelectedGreenhouseIndex] = useState(-1);
  const [NameSelectedFarm, setNameSelectedFarm] = useState("");
  const [NameSelectedSerre, setNameSelectedSerre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [tomatoColors, setTomatoColors] = useState({
    classe_A: 0,
    classe_B: 0,
    classe_C: 0,
    classe_D: 0,
    classe_E: 0,
    classe_F: 0
  });
  const [IsPopUp___Predictions___Visibile, setIsPopUp___Predictions___Visibile] = useState(false);
  const [selectedPredictions, setSelectedPredictions] = useState([]);
  const [selectedPredictionId, setSelectedPredictionId] = useState(null);
  const [selectedPredictionVideo, setselectedPredictionVideo] = useState(null);
  const [NameSelectedPrediction, setNameSelectedPrediction] = useState("all");
  const [rawTomatoCounts, setRawTomatoCounts] = useState({
    classe_A: 0,
    classe_B: 0,
    classe_C: 0,
    classe_D: 0,
    classe_E: 0,
    classe_F: 0
  });
  const [isLoadingCustomizingData, setIsLoadingCustomizingData] = useState(false);


  const defaultData = {
    totalTomatoes: 0,
    plants: 0,
    tomatoColors: {
      classe_A: 0,
      classe_B: 0,
      classe_C: 0,
      classe_D: 0,
      classe_E: 0,
      classe_F: 0
    },
    rawTomatoCounts: { 
      classe_A: 0, 
      classe_B: 0, 
      classe_C: 0, 
      classe_D: 0, 
      classe_E: 0, 
      classe_F: 0 
    }
  };


 





  const combineGreenhouseData = (greenhouse, predictionId) => {
    if (!greenhouse.predictions?.length) return JSON.parse(JSON.stringify(defaultData)); 
  
    if (predictionId) {
      const prediction = greenhouse.predictions.find(p => p.id === predictionId);
      if (!prediction) return JSON.parse(JSON.stringify(defaultData)); 
  
      const predictionColors = prediction.tomatoColors || {};
      const rawCounts = prediction.rawTomatoCounts || {};
  
      return {
        totalTomatoes: Math.round(prediction.totalTomatoes || 0),
        plants: prediction.plants || 0,
        tomatoColors: Object.fromEntries(
          Object.entries(predictionColors).map(([key, val]) => 
            [key, Math.round(typeof val === 'number' ? val : 0)]
          )
        ),
        rawTomatoCounts: Object.fromEntries(
          Object.entries(rawCounts).map(([key, val]) =>
            [key, typeof val === 'number' ? val : 0]
          )
        )
      };
    }
  
    return greenhouse.predictions.reduce((acc, prediction) => {
      const predColors = prediction.tomatoColors || {};
      const predRawCounts = prediction.rawTomatoCounts || {};
  
      acc.plants += Number(prediction.plants) || 0;
      acc.totalTomatoes += Number(prediction.totalTomatoes) || 0;
  
      Object.keys(acc.tomatoColors).forEach(key => {
        acc.tomatoColors[key] += Number(predColors[key]) || 0;
      });

      Object.keys(acc.rawTomatoCounts).forEach(key => {
        acc.rawTomatoCounts[key] += Number(predRawCounts[key]) || 0;
      });
  
      return acc;
    }, 
    JSON.parse(JSON.stringify(defaultData)));
  };


  





  
  

  const combineFarmData = (farm) => {
    if (!farm.serres?.length) return defaultData;
  
    return farm.serres.reduce((acc, serre) => {
      const greenhouseData = combineGreenhouseData(serre);
      acc.plants += greenhouseData.plants;
      acc.totalTomatoes += greenhouseData.totalTomatoes;
      
      Object.keys(acc.rawTomatoCounts).forEach(key => {
        acc.rawTomatoCounts[key] += greenhouseData.rawTomatoCounts[key];
      });
      
      Object.keys(acc.tomatoColors).forEach(key => {
        acc.tomatoColors[key] += greenhouseData.tomatoColors[key];
      });
      return acc;
    }, JSON.parse(JSON.stringify(defaultData))); 
  };






  
  const combineAllData = (data) => {
    return data.reduce((acc, farm) => {
      const farmData = combineFarmData(farm);
      acc.plants += farmData.plants;
      acc.totalTomatoes += farmData.totalTomatoes;
      
      // Add raw counts aggregation
      Object.keys(acc.rawTomatoCounts).forEach(key => {
        acc.rawTomatoCounts[key] += farmData.rawTomatoCounts[key];
      });
      
      Object.keys(acc.tomatoColors).forEach(key => {
        acc.tomatoColors[key] += farmData.tomatoColors[key];
      });
      return acc;
    }, JSON.parse(JSON.stringify(defaultData)));  
  };




  



  function RETURN__MERGED__DATA__OF__Farms__AND__PREDICTIONS(farmsResponse, predictionsResponse) {
    if (!farmsResponse || !predictionsResponse) {
      return [];
    }
  


 
    
    return farmsResponse.map((farm) => {
      
  
      const totalPredictionsForFarm = predictionsResponse.filter(
        (p) => parseInt(p.ferme_id) === parseInt(farm.id)
      ).length;
       
  
      const greenhouses = farm.serres.map((serre) => {
  
        const Z_PRIME = serre.poids_fruit && parseInt(serre.poids_fruit) !== 0
          ? parseInt(serre.poids_fruit)
          : 1;
  
        const X_PRIME = serre.nbr_tiger && parseInt(serre.nbr_tiger) !== 0
          ? parseInt(serre.nbr_tiger)
          : 1;
  
        const predictions = predictionsResponse.filter((p) => {
          const matchesFarm = parseInt(p.ferme_id) === parseInt(farm.id);
          const matchesSerre = parseInt(p.serre_id) === parseInt(serre.id);
          return matchesFarm && matchesSerre;
        });
  
  
        const processedPredictions = predictions.map((p) => {
  
          const Y_PRIME = p.superficie && parseInt(p.superficie) !== 0
            ? parseInt(p.superficie)
            : 1;
  
          const tomatoColors = {
            classe_A: Math.round(((parseInt(p.traitement_videos_sum_classe1) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
            classe_B: Math.round(((parseInt(p.traitement_videos_sum_classe2) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
            classe_C: Math.round(((parseInt(p.traitement_videos_sum_classe3) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
            classe_D: Math.round(((parseInt(p.traitement_videos_sum_classe4) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
            classe_E: Math.round(((parseInt(p.traitement_videos_sum_classe5) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
            classe_F: Math.round(((parseInt(p.traitement_videos_sum_classe6) || 0) * X_PRIME * Y_PRIME * Z_PRIME / 1000)),
          };
  
          

  
          const totalTomatoes = Object.values(tomatoColors).reduce((a, b) => a + b, 0);
  
          
          return {
            id: p.id,
            createdAt : p.created_at && p.created_at, 
            classeTotale : p.classeTotale && p.classeTotale,
            created_at : p.created_at && p.created_at,
            nom_ferme : p.ferme.nom_ferme && p.ferme.nom_ferme,
            commune : p.ferme.commune && p.ferme.commune,
            ferme_id : p.ferme_id && p.ferme_id , 
            serre_id : p.serre_id && p.serre_id,
            nom_serre : p.serre.name && p.serre.name,
            superficie : p.superficie && p.superficie,
            stemsDetected : p.stemsDetected && p.stemsDetected,
            videoName : p.videos.length !== 0 && p.videos[0],
            traitement_videos_sum_classe1 : p.traitement_videos_sum_classe1 &&  p.traitement_videos_sum_classe1,
            traitement_videos_sum_classe2 : p.traitement_videos_sum_classe2 &&  p.traitement_videos_sum_classe2,
            traitement_videos_sum_classe3 : p.traitement_videos_sum_classe3 &&  p.traitement_videos_sum_classe3,
            traitement_videos_sum_classe4 : p.traitement_videos_sum_classe4 &&  p.traitement_videos_sum_classe4,
            traitement_videos_sum_classe5 : p.traitement_videos_sum_classe5 &&  p.traitement_videos_sum_classe5,
            traitement_videos_sum_classe6 : p.traitement_videos_sum_classe6 &&  p.traitement_videos_sum_classe6,
            traitement_videos_sum_classe7 : p.traitement_videos_sum_classe7 &&  p.traitement_videos_sum_classe7,
            Y: Y_PRIME,
            tomatoColors,
            rawTomatoCounts: { 
              classe_A: parseInt(p.traitement_videos_sum_classe1) || 0,
              classe_B: parseInt(p.traitement_videos_sum_classe2) || 0,
              classe_C: parseInt(p.traitement_videos_sum_classe3) || 0,
              classe_D: parseInt(p.traitement_videos_sum_classe4) || 0,
              classe_E: parseInt(p.traitement_videos_sum_classe5) || 0,
              classe_F: parseInt(p.traitement_videos_sum_classe6) || 0,
            },
            totalTomatoes,
            plants: X_PRIME * Y_PRIME,
            X: X_PRIME,  
            Z: Z_PRIME,  
          };
        });
  
        return {
          id: parseInt(serre.id),
          name: serre.name,
          predictions: processedPredictions,  
          X: X_PRIME,
          Z: Z_PRIME,
        };
      });

      



      return {
        id: parseInt(farm.id),
        farmName: farm.nom_ferme,
        serres: greenhouses,
        totalPredictionsForFarm,
      };

    });
    
  }









  useEffect(() => {
    const fetchData = async () => {

      try {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('Token');

        const resp = await axios.get(`${ENDPOINT_URL}fermes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.status === 200) {
          const resp2 = await axios.get(`${ENDPOINT_URL}predictions`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (resp2.status === 200) {
            let farms = resp.data.fermes || []; 
            let predictions = resp2.data || []; 
          
            let MergedData = RETURN__MERGED__DATA__OF__Farms__AND__PREDICTIONS(farms.length > 0 ? farms : [], predictions.length > 0 ? predictions : []);
          
            setData(MergedData);

            //! MergedData.Length === length of allFarms aggregated with serres and predictions ...

            // but each farm has many predictions and each prediction has its unique number Y 

          }
        }
        else{
          setData([]);

        }
      } catch (e) {
        Alert.alert('Oups, une erreur est survenue lors de la récupération des données.');
      } finally {
        await new Promise(resolve => setTimeout(resolve, 111));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);








  const CustomizingData = async ()=>{
      
    setIsLoadingCustomizingData(true);


    if (data.length === 0) return;

      let newData;
      if (selectedFarmIndex === -1) {
        newData = combineAllData(data);
      } else if (selectedGreenhouseIndex === -1) {
        newData = combineFarmData(data[selectedFarmIndex]);
      } else {
        const greenhouse = data[selectedFarmIndex].serres[selectedGreenhouseIndex];
        newData = combineGreenhouseData(greenhouse, selectedPredictionId);
      }


      if(newData){
        if(newData.totalTomatoes){
          if(parseInt(newData.totalTomatoes) > 9999){
            setunitéChoisieValue(1000);
            setUnitéChoisie("tonnes.");
          }
          else{
            setUnitéChoisie("kilogramme.");
            setunitéChoisieValue(1);
          }
        }
      }

      const roundedColors = Object.fromEntries(
        Object.entries(newData.tomatoColors).map(([key, val]) => [key, Math.round(val)])
      );

      const roundedRawCounts = Object.fromEntries(
        Object.entries(newData.rawTomatoCounts).map(([key, val]) => [key, Math.round(val)])
      );

      setSelectedData({ ...newData, tomatoColors: roundedColors });
      setTomatoColors(roundedColors);
      setRawTomatoCounts(roundedRawCounts);

      setIsLoadingCustomizingData(false);

  }

 
  useEffect(() => {
  
    CustomizingData();

  }, [selectedFarmIndex, selectedGreenhouseIndex,selectedPredictionId, data]);






useEffect(() => {
  const fetchPredictions = () => {
    let predictions = [];
    
    if (selectedFarmIndex === -1) { // All farms
      data.forEach(farm => {
        farm.serres.forEach(serre => {
          predictions = [...predictions, ...serre.predictions];
        });
      });
    } else if (selectedGreenhouseIndex === -1) { // All greenhouses in selected farm
      predictions = data[selectedFarmIndex].serres.reduce((acc, serre) => {
        return [...acc, ...serre.predictions];
      }, []);
    } else { // Specific greenhouse
      predictions = data[selectedFarmIndex].serres[selectedGreenhouseIndex].predictions;
    }
    
    setSelectedPredictions(predictions);
  };

  if (data.length > 0) {
    fetchPredictions();
  }
}, [selectedFarmIndex, selectedGreenhouseIndex, data]);












  const downloadVideo = async () => {

    console.log(selectedPredictionVideo);

    try {


      const downloadUrl = `${DOWNLOAD_URL}${selectedPredictionVideo}`;
      
      await Linking.openURL(downloadUrl);
      Alert.alert('Téléchargement de la vidéo...');

    } catch (error) {
    console.error('Error opening video in browser:', error);
    Alert.alert("Une erreur est survenue lors du téléchargement de la vidéo...");
   }
  }
























const [fontsLoaded] = useFonts({
        'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
        'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
        "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
        "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
        "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
    });

      if (!fontsLoaded) {
        return null;
    }

  return (
    <>


       
          <PopUpNavigate  
              // setIsAuthenticated={setIsAuthenticated}
              isPopupVisible={isPopupVisible2}
              setIsPopupVisible={setIsPopupVisible2}   
          />
    


    {
      isLoading ? 
      <View style={{
        flex : 1, 
        backgroundColor : "white", 
        alignItems : "center", 
        justifyContent : "center", 
        flexDirection : "column"
      }} >

        {               
          !isPopupVisible2 && 
          <TouchableOpacity 
              onPress={() => setIsPopupVisible2(!isPopupVisible2)}
              disabled={isLoading}
              style={{

                position: "absolute", 
                right : 20, top : 50, backgroundColor : "white", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center"

              }} 
          >
            <Ionicons name="menu" size={23} color="black" style={{textAlign : "center"}}  />
          </TouchableOpacity> 
        }

        


          <View style={{flexDirection : "row", alignItems : "center", justifyContent : "center" }}>
            <Image
              style={styles.LoaderSvgImg}
              source={require('./loader.gif')}     
            />    
            <Text style={{fontFamily : "Inter", fontSize : 14, color :"#3e3e3e" }} >
              Chargement des données
            </Text>
          </View>


      </View>
      :
      <>
        
      {
         data && data.length !== 0 ? 
         <>
      
      <PopUpNavigate  
              // setIsAuthenticated={setIsAuthenticated}
              isPopupVisible={isPopupVisible2}
              setIsPopupVisible={setIsPopupVisible2}   
          />
    
      <Modal
        visible={isPopupVisible}
        animationType="fade" // Optional: A smoother transition
        transparent={true}
        onRequestClose={() => setIsPopupVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrez par ferme et serre :</Text>

            <Picker
              
              selectedValue={selectedFarmIndex}
              onValueChange={(value) => {
                setSelectedFarmIndex(value);
                setNameSelectedPrediction("all");
                setNameSelectedSerre("");
                setSelectedGreenhouseIndex(-1); 
                setSelectedPredictionId(null);
                setselectedPredictionVideo(null);
                if(value !== -1 && value !== "-1"){
                  let nameOfFarm = data[value]?.farmName;
                  setNameSelectedFarm(nameOfFarm);
                }
              }}
              style={{
                backgroundColor: '#F1F1F1',
                marginBottom: 10,
              }}            >
              <Picker.Item label="Toutes les Fermes" value={-1} />
              {data.map((farm, index) => (
                <Picker.Item key={farm.id} label={farm.farmName} value={index} />
              ))}
            </Picker>

            {selectedFarmIndex !== -1 && data[selectedFarmIndex]?.serres ? (
              <Picker
                selectedValue={selectedGreenhouseIndex}
                onValueChange={(value) => {
                  setSelectedGreenhouseIndex(value);
                  setSelectedPredictionId(null);
                  setselectedPredictionVideo(null);
                  setNameSelectedPrediction("all");
                  let nameOfSerre = data[selectedFarmIndex]?.serres[value]?.name;  
                  setNameSelectedSerre(nameOfSerre);
                }}
                style={{ backgroundColor: '#F1F1F1', marginBottom: 10 }}
              >
                <Picker.Item label="Toutes les serres" value={-1} />
                {data[selectedFarmIndex]?.serres.map((greenhouse, index) => (
                  <Picker.Item key={greenhouse.id} label={greenhouse.name} value={index} />
                ))}
              </Picker>
            ) : (
              <Text>&nbsp;</Text>
            )}



            <TouchableOpacity
              style={styles.closeButton}
              disabled={isLoadingCustomizingData || isLoading}
              onPress={() => {
                setIsPopupVisible(false);
                if(selectedFarmIndex !== -1 && selectedFarmIndex !== "-1"){
                  if(selectedGreenhouseIndex !== -1 && selectedGreenhouseIndex !== "-1"){
                    setIsPopUp___Predictions___Visibile(true);
                  }
                }
              }}
            >
              <Text style={styles.closeButtonText}>
                {
                  isLoadingCustomizingData ? "Enregistrement..." : "Enregistrer"
                }
              </Text>
            </TouchableOpacity>
          </View> 
        </View>
      </Modal>



      <Modal
        visible={IsPopUp___Predictions___Visibile}
        animationType="fade"  
        transparent={true}
        onRequestClose={() => setIsPopUp___Predictions___Visibile(false)}
      >
        <View style={styles.modalContainer2}>
          <View style={styles.modalContent2}>
            <TouchableOpacity
              style={styles.closeButton2}
              onPress={() => {
                setIsPopUp___Predictions___Visibile(false);
              }}
            >
              <Ionicons name="close" size={23} color="white" style={{textAlign : "center"}}  />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtrez par prédictions : </Text>
            {
              selectedPredictions.length === 0 ? 
              <View 
                style={{
                  height : 100, 
                  alignItems : "center", 
                  justifyContent : "center",
                }}
              >
                <Text style={{
                  color : "gray"
                }}  >
                  Aucune donnée
                </Text>
              </View>
              :
              <ScrollView>

                  <TouchableOpacity
                    style={{
                      alignItems : "center", 
                      flexDirection : "row", 
                      justifyContent : "space-between", 
                      borderBottomColor : "gainsboro", 
                      borderBottomWidth : 1, 
                      paddingBottom : 15, 
                      paddingTop: 15
                    }} 
                    onPress={() => {
                      setNameSelectedPrediction("all");
                      setSelectedPredictionId(null);
                      setselectedPredictionVideo(null);
                      setIsPopUp___Predictions___Visibile(false);
                    }}
                  >
                        <View>
                          <Text 
                              style={{
                                fontSize: 15,
                                fontFamily: "Inter",
                                color: NameSelectedPrediction === "all" ? "#BE2929" : "#141414",
                                fontWeight: "bold"
                              }}
                          >
                              Toutes les prédictions
                          </Text>
                        </View>
                        <View style={{
                          paddingRight : 10
                        }} >
                          <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={NameSelectedPrediction === "all" ? "#BE2929" : "gray"} 
                          />
                        </View>
                  </TouchableOpacity>


                {
                  selectedPredictions.map((predict, index)=>{
                    return(
                      <TouchableOpacity 
                        style={{
                          alignItems : "center", 
                          flexDirection : "row", 
                          justifyContent : "space-between", 
                          borderBottomColor : "gainsboro", 
                          borderBottomWidth : 1, 
                          paddingBottom : 13,
                          marginTop : 13

                        }}

                        onPress={()=>{
                          setIsPopUp___Predictions___Visibile(false);
                          setSelectedPredictionId(predict.id);
                          if(predict.videoName !== null && predict.videoName !== undefined){
                            setselectedPredictionVideo(predict.videoName);
                          }
                          setNameSelectedPrediction(`Prédiction ${index+1}`);
                          // navigation.navigate('SingleCalcul',
                          //   {
                          //     id: predict.id,
                          //     classeTotale : predict.classeTotale ? predict.classeTotale : 0,
                          //     created_at : predict.createdAt ? predict.createdAt : "",
                          //     nom_ferme : predict.nom_ferme ? predict.nom_ferme : "",
                          //     commune : predict.commune ? predict.commune : "",
                          //     ferme_id : predict.ferme_id ? predict.ferme_id : "",
                          //     serre_id : predict.serre_id ? predict.serre_id : "",
                          //     nom_serre : predict.nom_serre ? predict.nom_serre : "",
                          //     superficie : predict.superficie ? predict.superficie : 0,
                          //     stemsDetected : predict.stemsDetected ? predict.stemsDetected : 0,
                          //     traitement_videos_sum_classe1 : predict.traitement_videos_sum_classe1 ? predict.traitement_videos_sum_classe1 : 0,
                          //     traitement_videos_sum_classe2 : predict.traitement_videos_sum_classe2 ? predict.traitement_videos_sum_classe2 : 0,
                          //     traitement_videos_sum_classe3 : predict.traitement_videos_sum_classe3 ? predict.traitement_videos_sum_classe3 : 0,
                          //     traitement_videos_sum_classe4 : predict.traitement_videos_sum_classe4 ? predict.traitement_videos_sum_classe4 : 0,
                          //     traitement_videos_sum_classe5 : predict.traitement_videos_sum_classe5 ? predict.traitement_videos_sum_classe5 : 0,
                          //     traitement_videos_sum_classe6 : predict.traitement_videos_sum_classe6 ? predict.traitement_videos_sum_classe6 : 0,
                          //     traitement_videos_sum_classe7 : predict.traitement_videos_sum_classe7 ? predict.traitement_videos_sum_classe7 : 0
                          //   }                          
                          // )
                        }} key={index} >
                        <View 
                        >
                          <Text 
                            style={{
                              fontSize: 15,
                              fontFamily: "Inter",
                              color: NameSelectedPrediction === `Prédiction ${index+1}` ? "#BE2929" : "#141414",
                              fontWeight: "bold"
                            }}
                          >
                            Prédiction {index+1} 
                          </Text>
                          {
                            predict.createdAt && 
                            <Text style={{fontSize : 13, fontFamily : "Inter", color : "gray"}}>
                            {formateDate(predict.createdAt)}
                            </Text>
                          }
                        </View>
                        <View style={{
                          paddingRight : 10
                        }} >
                          <Ionicons 
                            name="chevron-forward" 
                            size={20} 
                            color={NameSelectedPrediction === `Prédiction ${index+1}` ? "#BE2929" : "gray"} 
                          />
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
              </ScrollView>
            }
            
 
          </View> 
        </View>
      </Modal>




    <View style={styles.container}>

      <ImageBackground
        source={require('../images/a.jpg')}  
        style={styles.backgroundImage}
      >

        {
          !isPopupVisible2 && 
          <TouchableOpacity 
            onPress={() => setIsPopupVisible2(!isPopupVisible2)}
            style={{

              position: "absolute", 
              right : 20, top : 50, backgroundColor :"rgba(0, 0, 0, 0.65)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center",
            }} 
        >
          <Ionicons name="menu" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 
        }


        {/* {
          !isPopupVisible2 && 
          <TouchableOpacity 
            style={{

              position: "absolute", 
              right : 20, top :100, backgroundColor :"rgba(0, 0, 0, 0.65)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center"

            }} 
        >
          <Ionicons name="build-outline" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 

        } */}


        <ScrollView horizontal contentContainerStyle={styles.cardsContent} >
          



        <View style={styles.cardContainer}>
            {/* Card for Total Tomatoes */}
            <View style={styles.card2}>
              <View  style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak2.png')} // Update to your desired icon
                  />
                </View>
                <Text style={styles.cardValue}>
                  {selectedData ? formatPoids(selectedData.totalTomatoes || 0) : "0 Kg"}
                </Text>
                <Text style={styles.cardTitle}>Quantité totale</Text>
              </View>
            </View>

          
            <View style={styles.card2}>
              <View  style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak3.png')} // Update to your desired icon
                  />
                </View>
                <Text style={styles.cardValue}>{selectedData && selectedData.plants ? formatNumberK(selectedData.plants) : "0"}</Text>
                <Text style={styles.cardTitle}>Total Tiges</Text>
              </View>
            </View>
          </View>




          
        </ScrollView>
        
      </ImageBackground>





      <View style={styles.buttonRow}>

        <View style={{
          alignItems : "center", 
          flexDirection : "row"
        }} >
        
          <TouchableOpacity
            style={[styles.toggleButton, chartType === "Bar" && styles.activeButton, styles.buttonbar]}
            onPress={() => setChartType("Bar")}
          >
            {
              chartType === "Bar" &&
            <Text style={{
              paddingTop : 3
            }} >
            
              <Ionicons name="checkmark" size={20} color="#fff" />
            &nbsp;
            </Text>
            }
            <Text style={[styles.toggleButtonText, chartType === "Bar" && styles.activeButtonText]}  >
              Histogramme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, chartType === "Pie" && styles.activeButton, styles.buttonPie]}
            onPress={() => setChartType("Pie")}
          >
            {
            chartType === "Pie" &&
            <Text style={{
              paddingTop : 3
            }} >
              <Ionicons name="checkmark" size={20} color="#fff" />
            &nbsp;
            </Text>
            }
            <Text style={[styles.toggleButtonText, chartType === "Pie" && styles.activeButtonText]} >
              Donut
            </Text>
          </TouchableOpacity>



        </View>

        <View style={{
          alignItems : "center", 
          flexDirection : "row"
        }} >
          {
            NameSelectedPrediction !== "all" && selectedPredictionId !== null && selectedPredictionVideo !== null && selectedPredictionVideo !== undefined && 
            <TouchableOpacity
              style={styles.ellipsisButton}
              onPress={() =>{
                downloadVideo();
              }}
              disabled={Array.isArray(data) && (data === null || data.length === 0) && (NameSelectedPrediction !== "all" && selectedPredictionId !== null )}
            >
              <Feather name="download" size={19} color="rgb(59, 59, 59)" style={{textAlign : "center"}} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={styles.ellipsisButton2}
            onPress={() => setIsPopupVisible(true)}
            disabled={Array.isArray(data) && (data === null || data.length === 0)}
          >
            <MaterialCommunityIcons name="filter" size={19} color="white" style={{textAlign : "center"}} />
          </TouchableOpacity>
        </View>
      </View>

      

    
    
    









      <ScrollView style={styles.chartContainer}>
        {chartType === "Bar" ? (
          
          <View style={{
            position : "relative", 
            flex : 1,
            alignItems: "center" 
          }}>
            


            {
              selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
              
              <View
                style={{
                  marginTop : 6
                }}  
              >
                <Text style={{
                  fontSize : 20, 
                  textAlign : "center",
                  fontFamily : "InriaBold",
                  color :"rgb(21, 21, 21)"
              }} >
                {
                  selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
                  <>
                  {NameSelectedFarm !== "" && NameSelectedFarm}
                  </>
                }
                {
                  selectedGreenhouseIndex !== -1 && selectedGreenhouseIndex !== "-1" && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedSerre !== "" && NameSelectedSerre }
                  </>
                }
                { (NameSelectedPrediction !== "" && NameSelectedPrediction !== null && NameSelectedPrediction !== "all") && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedPrediction}
                  </>
                }
                </Text>
              </View>
            }

            <View
              style={{
                marginBottom : 20,
                marginTop : 10
              }}            
            >
                <Text style={{
                  fontSize : 14, 
                  fontFamily : "Inter", 
                  color :"rgb(88, 88, 88)"
                }} >
                  Répartition des tomates en&nbsp;
                  <Text
                    style={{
                      fontSize : 14, 
                      fontFamily : "Inter", 
                      color :"#BE2929", 
                      fontWeight : "bold"
                  }} 
                  >
                  {unitéChoisie}
                </Text>
              </Text>
            </View>


            <BarChart
              data={Object.entries(tomatoColors).map(([key, value]) => {
                const letter = key.replace("classe_", ""); 
                const number = letter.charCodeAt(0) - 64;  

                // Ensure unitéChoisieValue is a valid number and not zero
                const divisor = unitéChoisieValue && unitéChoisieValue !== 0 ? unitéChoisieValue : 1;

                return {
                  value: Math.round((value / divisor) * 10) / 10,
                  frontColor: classColors[key] || "#CCCCCC",
                  label: `C${number.toString()}`,
                };
              })}
              barWidth={44}
              spacing={6}
              height={screenHeight * 0.328}
              width={screenWidth - 60}
              noOfSections={5}  
              yAxisThickness={0}  
              xAxisThickness={0}  
              xAxisLabelTextStyle={{ color: "gray", fontSize: 14 }}    
              showValuesAsTopLabel={true}
              topLabelTextStyle={{ color:"gray", fontSize:11, fontWeight: "bold" }} 
              yAxisTextStyle={{ fontSize:11, color: "gray", fontWeight: "bold" }}
            />



          </View>
        
            
        ) : (

          <>
          {
              selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
              
              <View
                style={{
                  marginTop : 6
                }}  
              >
                <Text style={{
                  fontSize : 20, 
                  textAlign : "center",
                  fontFamily : "InriaBold",
                  color :"rgb(21, 21, 21)"
              }} >
                {
                  selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
                  <>
                  {NameSelectedFarm !== "" && NameSelectedFarm}
                  </>
                }
                {
                  selectedGreenhouseIndex !== -1 && selectedGreenhouseIndex !== "-1" && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedSerre !== "" && NameSelectedSerre }
                  </>
                }
                { (NameSelectedPrediction !== "" && NameSelectedPrediction !== null && NameSelectedPrediction !== "all") && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedPrediction}
                  </>
                }
                </Text>
              </View>
            }
           

            <CustomizedPieChart
              tomatoColors={rawTomatoCounts}
            />          
          </>
        )}
      </ScrollView>

      
      <TouchableOpacity style={styles.createButton} onPress={()=>{
                navigation.navigate('AjouterCalcul')
              }}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.createButtonText}>Ajouter un nouveau calcul</Text>
              </TouchableOpacity>



    </View>

         </>
        :
        <>

        <View style={styles.container} >

       



<ImageBackground
        source={require('../images/a.jpg')}  
        style={styles.backgroundImage}
      >

        {
          !isPopupVisible2 && 
          <TouchableOpacity 
            onPress={() => setIsPopupVisible2(!isPopupVisible2)}
            style={{

              position: "absolute", 
              right : 20, top : 50, backgroundColor :"rgba(0, 0, 0, 0.65)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center",
            }} 
        >
          <Ionicons name="menu" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 
        }


        {/* {
          !isPopupVisible2 && 
          <TouchableOpacity 
            style={{

              position: "absolute", 
              right : 20, top :100, backgroundColor :"rgba(0, 0, 0, 0.65)", height : 40, width : 40, borderRadius : 50,zIndex :30, alignItems : "center", justifyContent : "center"

            }} 
        >
          <Ionicons name="build-outline" size={23} color="white" style={{textAlign : "center"}}  />
        </TouchableOpacity> 

        } */}


        <ScrollView horizontal contentContainerStyle={styles.cardsContent} >
          



        <View style={styles.cardContainer}>
            {/* Card for Total Tomatoes */}
            <View style={styles.card2}>
              <View  style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak2.png')} // Update to your desired icon
                  />
                </View>
                <Text style={styles.cardValue}>
                  {selectedData ? formatPoids(selectedData.totalTomatoes || 0) : "0 Kg"}
                </Text>
                <Text style={styles.cardTitle}>Quantité totale</Text>
              </View>
            </View>

          
            <View style={styles.card2}>
              <View  style={{ borderRadius: 10, height: "100%", width: "100%" }}>
                <View style={styles.cardIcon}>
                  <Image
                    style={styles.imageLoggo}
                    source={require('../images/ak3.png')} // Update to your desired icon
                  />
                </View>
                <Text style={styles.cardValue}>{selectedData && selectedData.plants ? formatNumberK(selectedData.plants) : "0"}</Text>
                <Text style={styles.cardTitle}>Total Tiges</Text>
              </View>
            </View>
          </View>




          
        </ScrollView>
        
      </ImageBackground>





      <View style={styles.buttonRow}>

        <View style={{
          alignItems : "center", 
          flexDirection : "row"
        }} >
        
          <TouchableOpacity
            style={[styles.toggleButton, chartType === "Bar" && styles.activeButton, styles.buttonbar]}
            onPress={() => setChartType("Bar")}
          >
            {
              chartType === "Bar" &&
            <Text style={{
              paddingTop : 3
            }} >
            
              <Ionicons name="checkmark" size={20} color="#fff" />
            &nbsp;
            </Text>
            }
            <Text style={[styles.toggleButtonText, chartType === "Bar" && styles.activeButtonText]}  >
              Histogramme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, chartType === "Pie" && styles.activeButton, styles.buttonPie]}
            onPress={() => setChartType("Pie")}
          >
            {
            chartType === "Pie" &&
            <Text style={{
              paddingTop : 3
            }} >
              <Ionicons name="checkmark" size={20} color="#fff" />
            &nbsp;
            </Text>
            }
            <Text style={[styles.toggleButtonText, chartType === "Pie" && styles.activeButtonText]} >
              Donut
            </Text>
          </TouchableOpacity>



        </View>

        <View style={{
          alignItems : "center", 
          flexDirection : "row"
        }} >
          {
            NameSelectedPrediction !== "all" && selectedPredictionId !== null && selectedPredictionVideo !== null && selectedPredictionVideo !== undefined && 
            <TouchableOpacity
              style={styles.ellipsisButton}
              onPress={() =>{
                downloadVideo();
              }}
              disabled={Array.isArray(data) && (data === null || data.length === 0) && (NameSelectedPrediction !== "all" && selectedPredictionId !== null )}
            >
              <Feather name="download" size={19} color="rgb(59, 59, 59)" style={{textAlign : "center"}} />
            </TouchableOpacity>
          }
          <TouchableOpacity
            style={styles.ellipsisButton2}
            onPress={() => setIsPopupVisible(true)}
            disabled={Array.isArray(data) && (data === null || data.length === 0)}
          >
            <MaterialCommunityIcons name="filter" size={19} color="white" style={{textAlign : "center"}} />
          </TouchableOpacity>
        </View>
      </View>

      

    
    
    









      <ScrollView style={styles.chartContainer}>
        {chartType === "Bar" ? (
          
          <View style={{
            position : "relative", 
            flex : 1,
            alignItems: "center" 
          }}>
            


            {
              selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
              
              <View
                style={{
                  marginTop : 6
                }}  
              >
                <Text style={{
                  fontSize : 20, 
                  textAlign : "center",
                  fontFamily : "InriaBold",
                  color :"rgb(21, 21, 21)"
              }} >
                {
                  selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
                  <>
                  {NameSelectedFarm !== "" && NameSelectedFarm}
                  </>
                }
                {
                  selectedGreenhouseIndex !== -1 && selectedGreenhouseIndex !== "-1" && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedSerre !== "" && NameSelectedSerre }
                  </>
                }
                { (NameSelectedPrediction !== "" && NameSelectedPrediction !== null && NameSelectedPrediction !== "all") && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedPrediction}
                  </>
                }
                </Text>
              </View>
            }

            <View
              style={{
                marginBottom : 20,
                marginTop : 10
              }}            
            >
                <Text style={{
                  fontSize : 14, 
                  fontFamily : "Inter", 
                  color :"rgb(88, 88, 88)"
                }} >
                  Répartition des tomates en&nbsp;
                  <Text
                    style={{
                      fontSize : 14, 
                      fontFamily : "Inter", 
                      color :"#BE2929", 
                      fontWeight : "bold"
                  }} 
                  >
                  {unitéChoisie}
                </Text>
              </Text>
            </View>


            <BarChart
              data={Object.entries(tomatoColors).map(([key, value]) => {
                const letter = key.replace("classe_", ""); 
                const number = letter.charCodeAt(0) - 64;  

                // Ensure unitéChoisieValue is a valid number and not zero
                const divisor = unitéChoisieValue && unitéChoisieValue !== 0 ? unitéChoisieValue : 1;

                return {
                  value: Math.round((value / divisor) * 10) / 10,
                  frontColor: classColors[key] || "#CCCCCC",
                  label: `C${number.toString()}`,
                };
              })}
              barWidth={44}
              spacing={6}
              height={screenHeight * 0.328}
              width={screenWidth - 60}
              noOfSections={5}  
              yAxisThickness={0}  
              xAxisThickness={0}  
              xAxisLabelTextStyle={{ color: "gray", fontSize: 14 }}    
              showValuesAsTopLabel={true}
              topLabelTextStyle={{ color:"gray", fontSize:11, fontWeight: "bold" }} 
              yAxisTextStyle={{ fontSize:11, color: "gray", fontWeight: "bold" }}
            />



          </View>
        
            
        ) : (

          <>
          {
              selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
              
              <View
                style={{
                  marginTop : 6
                }}  
              >
                <Text style={{
                  fontSize : 20, 
                  textAlign : "center",
                  fontFamily : "InriaBold",
                  color :"rgb(21, 21, 21)"
              }} >
                {
                  selectedFarmIndex !== -1 && selectedFarmIndex !== "-1" && 
                  <>
                  {NameSelectedFarm !== "" && NameSelectedFarm}
                  </>
                }
                {
                  selectedGreenhouseIndex !== -1 && selectedGreenhouseIndex !== "-1" && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedSerre !== "" && NameSelectedSerre }
                  </>
                }
                { (NameSelectedPrediction !== "" && NameSelectedPrediction !== null && NameSelectedPrediction !== "all") && 
                  <>
                  &nbsp;&nbsp;/&nbsp;&nbsp;{NameSelectedPrediction}
                  </>
                }
                </Text>
              </View>
            }
           

            <CustomizedPieChart
              tomatoColors={rawTomatoCounts}
            />          
          </>
        )}
      </ScrollView>
          
          

          <TouchableOpacity style={styles.createButton} onPress={()=>{
              navigation.navigate('AjouterCalcul')
            }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.createButtonText}>Ajouter un nouveau calcul</Text>
          </TouchableOpacity>

        </View>  


        

        </>

    }

      </>
    }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position : "relative"
  },
  
   

  card: {
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height : 150, width : "auto",
    minWidth : 140, 
    marginRight : 20, borderRadius :20, 
    backgroundColor :"rgba(0, 0, 0, 0.65)", 
  },


  card2: {
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    height : 150, width : "auto",
    minWidth : 100, 
    marginRight : 20, borderRadius :20, 
    backgroundColor :"rgba(0, 0, 0, 0.65)",
  },

  
   
  
  cardTitle: {
    color: "white",
    paddingLeft : 20,
    paddingRight : 20, 
    fontSize: 13,
  },

  cardIcon : {
    paddingLeft : 20,
    height : '35%',
    alignItems : "flex-start", justifyContent : "flex-end"
  },
  imageLoggo : {

    height : 33, width : 33, objectFit : "cover"

  },
  cardValue: {
    color: "#fff",
    fontSize: 33,
    paddingTop : 10,
    paddingLeft : 20,
    paddingRight : 20,
    fontFamily:  "InriaBold", height : "40%", textAlign : "left"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal : 20,
    marginTop : 20
  },
  toggleButton: {
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    width: "40%",
    minHeight : 40, 
    alignItems : "center",justifyContent : "center",
  },
  activeButton: {
    backgroundColor: "#BE2929",
    flexDirection : "row", 
    alignItems : "center"
  },
  toggleButtonText: {
    color: "#141414",
    fontSize: 14,
    fontFamily: "Inter",
  },
  activeButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter",
    alignItems : "center", 
    justifyContent : "center", 
    flexDirection : "row"
  },
  ellipsisButton: {
    borderRadius : 40, 
    height : 40, 
    width : 40,
    alignItems : "center",justifyContent : "center",
    backgroundColor : "#F1F1F1"
  },
  ellipsisButton2: {
    borderRadius : 40, 
    marginLeft : 10,
    height : 40, 
    width : 40,
    alignItems : "center",justifyContent : "center",
    backgroundColor : "#BE2929"
  },
  modalContainer: {
    flex: 1, // Covers the full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Ensures semi-transparent background
  },
  modalContainer2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Ensures semi-transparent background
  },
  modalContent: {
    width: "85%", // Adjusted width for better centering
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalContent2: {
    width: "93%", // Adjusted width for better centering
    backgroundColor: "#fff",
    padding: 0,
    paddingTop : 20, 
    paddingBottom : 0, 
    paddingRight : 0, 
    paddingLeft : 10, 
    borderRadius: 10,
    elevation: 5,
    maxHeight : 450,
    minHeight : 200, 
    position : "relative", 
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#141414",
    fontFamily: "Inter",
    fontWeight : "bold"

  },
  modalTitle2: {
    fontSize: 20,
    marginBottom: 30,
    color: "#141414",
    fontFamily: "Inter",
    fontWeight : "bold", 
  },
  closeButton: {
    backgroundColor: "#BE2929",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  closeButton2: {
    backgroundColor: "#BE2929",
    borderRadius: 500,
    position : "absolute", 
    right : 10, 
    top : 10, 
    height : 33, 
    width : 33, 
    alignItems: "center",
    justifyContent : "center", 
    zIndex : 99
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Inter",
  },
  chartContainer: {
    height : "44%",
    paddingHorizontal : 20,
    paddingTop : 20,
    position : 'relative'
  },
 
  chart: {
    
  },
  legendContainer: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 13,
    fontFamily : "Inter",
    color: "#141414",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position : "relative",
  },
  cardsContent: {
    flexDirection: "row", // Ensure horizontal layout
    justifyContent: "center", // Center the cards horizontally
    alignItems: "flex-end", // Align cards at the bottom
    paddingRight : 20, 
    paddingLeft : 20,
    paddingBottom : 20     
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  LoaderSvgImg : {
    height : 40,           //hello ? 
    width : 40, 
    zIndex : 99
  },

  createButton: {
    backgroundColor: '#BE2929',
    borderRadius: 8,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position : "absolute", 
    bottom :20,
    right : 20, 
    left : 20
  },


  createButtonText: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 8,
},

buttonPie : {
  width : 109, 
  marginLeft : 10
},
buttonbar : {
  width : "auto",
  paddingLeft : 15, 
  paddingRight : 15 
}
});