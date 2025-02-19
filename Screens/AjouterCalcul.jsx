import React, { useState , useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,TextInput,
    TouchableOpacity,
    Dimensions,
    Alert,Animated
} from 'react-native';
import PopUpNavigate from "../Components/PopUpNavigate";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import {ENDPOINT_URL} from "../App";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AjouterCalcul() {

    const navigation = useNavigation();
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
    const [videoUri, setVideoUri] = useState(null);
    const [videoInfo, setVideoInfo] = useState({ name: null, duration: null });
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [nombreMetre,setnombreMetre] = useState(666);
    const [allFermes , setAllFermes] = useState([]);

    const [isLoading , setisLoading] = useState(true);
    const [progressUpload , setProgressUpload ] = useState(0);
    const [loading , setLoading ] = useState(false);
    const [textUpload , setTestUpload ] = useState(null);
    const [filteredSerres, setFilteredSerres] = useState([]);
    const [allSerre , setAllSerre] = useState([]);


    const [fontsLoaded] = useFonts({
            'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
            'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
            "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
            "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
            "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
        });



    
    
    const skeletonAnimation = useRef(new Animated.Value(0)).current;


    const skeletonBackground = skeletonAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#e8e8e8', '#f5f5f5'],
    });

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




            useEffect(() => {
                const fetchDataFarms = async () => {
                    try {
                        setisLoading(true);
                        const token = await AsyncStorage.getItem('Token');
                        const resp = await axios.get(`${ENDPOINT_URL}fermes`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
            
                        if (resp.status === 200) {
                            setAllFermes(resp.data.fermes);
            
                            const extractedSerres = resp.data.fermes.flatMap(ferme =>
                                ferme.serres.map(serre => ({
                                    id: serre.id,
                                    nom: serre.name,
                                    fermeId: ferme.id,
                                    fermeNom: ferme.nom_ferme
                                }))
                            );
            
                            setAllSerre(extractedSerres);
                         }
            
                        await new Promise(resolve => setTimeout(resolve, 123));
                    } catch (e) {
                    } finally {
                        setisLoading(false);
                    }
                };
            
                fetchDataFarms();
            }, []);
        

   
    const selectVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Requise', 'Accès à la galerie requis pour sélectionner une vidéo.');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const videoUri = result.assets[0].uri;
            const duration = result.assets[0].duration; // Duration in ms
            const name = videoUri.split('/').pop(); // Extract file name from URI
            const width = result.assets[0].width; // Video width
            const height = result.assets[0].height; // Video height
            const type = result.assets[0].type; // File type (e.g., "video/mp4")
    
            setVideoUri(videoUri);
            setVideoInfo({
                name: name || 'Unknown Name',
                duration: formatDuration(duration),
                resolution: `${width} x ${height}`, // Display resolution
                type: type || 'Unknown Type', // Display file type
            });
        }
    };

    


    // Function to handle taking a video
    const takeVideo = async () => {
        console.log("run takeVideo ======>");
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is required to take a video.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });

        if (!result.canceled) {
            const videoUri = result.assets[0].uri;
            const duration = result.assets[0].duration; // Duration in seconds, from ImagePicker
            const name = videoUri.split('/').pop(); // Extract file name from URI

            setVideoUri(videoUri);
            setVideoInfo({
                name: name || 'Unknown Name',
                duration: formatDuration(duration),
            });
        }
    };

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000); 
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}m ${secs}s`;
    };


    

    const uploadVideoInChunks = async () => {
        
        if (!videoUri){
            Alert.alert("Veuillez sélectionner une vidéo pour continuer...");            
            return;
        }

        if (!selectedFarm){
            Alert.alert("Veuillez sélectionner une ferme pour continuer...");            
            return;
        }

        if (!selectedGreenhouse){
            Alert.alert("Veuillez sélectionner une serre pour continuer...");            
            return;
        }

        setLoading(true);
        setTestUpload("Envoi de la vidéo...");
        const token = await AsyncStorage.getItem('Token');
        
      
        const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB chunk size
      
        try {
          const fileInfo = await FileSystem.getInfoAsync(videoUri);
          const totalSize = fileInfo.size;
          const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
          const fileName = videoUri.split('/').pop();
          let offset = 0;
          let chunkIndex = 0;
      
          while (offset < totalSize) {
            // Read the chunk from the file
            const chunk = await FileSystem.readAsStringAsync(videoUri, {
              encoding: FileSystem.EncodingType.Base64,
              position: offset,
              length: Math.min(CHUNK_SIZE, totalSize - offset),
            });
      
            // Prepare form data for the chunk
            const formData = new FormData();
            formData.append('file', chunk);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', totalChunks);
            formData.append('fileName', fileName);
            formData.append('ferme_id', selectedFarm);
            formData.append('serre_id', selectedGreenhouse);
            formData.append('superficie', nombreMetre);
      
            // Send chunk to the server with progress tracking
            await axios.post(`${ENDPOINT_URL}upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
              onUploadProgress: (progressEvent) => {
                const chunkProgress = (progressEvent.loaded / progressEvent.total) * 100;
                const overallProgress =
                  ((chunkIndex + progressEvent.loaded / progressEvent.total) / totalChunks) * 100;
                console.log(`Chunk ${chunkIndex + 1}/${totalChunks} - Progress: ${chunkProgress.toFixed(2)}%`);
                console.log(`Overall Progress: ${overallProgress.toFixed(2)}%`);
                setProgressUpload(overallProgress.toFixed(2));
              },
            });
      
            offset += CHUNK_SIZE;
            console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded.`);
            chunkIndex++;
          }
      
          setProgressUpload(100);
          startWebSocketTracking();
          setSelectedFarm(null);
          setSelectedGreenhouse(null);
          setVideoInfo(null);
          setVideoUri(null);
          setnombreMetre(0);
          setProgressUpload(0);
          navigation.navigate("MesCalculs");
          
        } catch (error) {
          setLoading(false);
          console.error('Error uploading chunk', error);
          Alert.alert("Oups, une erreur est survenue lors du traitement de vos données.");
        }
      };
      

    const startWebSocketTracking = () => {
        setLoading(true);
        setTestUpload("Traitement des données en cours...");
        setProgressUpload(0);

        let fileName = videoUri.split('/').pop();
        if (fileName.endsWith('.mov')) {
          fileName = fileName.replace('.mov', '.mp4');
        }
        const ws = new WebSocket(`wss://ws-tracktom-test.pcs-agri.com/ws/${fileName}`);
    
        ws.onopen = () => {
          console.log('WebSocket connected');
        };
    
        ws.onmessage = (event) => {
          const percentage  = parseFloat(event.data);
          if (!isNaN(percentage)) {
            console.log(`Processing percentage: ${percentage}%`); 
            setProgressUpload(percentage);
          } else {
            console.log('Received non-numeric data:', event.data);
          }
        
          if (percentage === 100) {
            setLoading(false);
            ws.close();
          }
        };
    
        ws.onerror = (error) => {
            setLoading(false);
          console.error('WebSocket error:', error.message);
        };
    
        ws.onclose = () => {
            setLoading(false);
          console.log('WebSocket closed');

        };
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
            {loading ? (
                <>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.returnButton}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#141414" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Transfert de Vidéo</Text>
                        <TouchableOpacity 
                            onPress={() => setIsPopupVisible(!isPopupVisible)}
                            style={styles.elipsisButton}
                        >                    
                            <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.loadingContainer}>
                        <Text style={{
                            color : "gray", 
                            marginBottom : 6
                        }}>{textUpload}</Text>
                        <Text style={{
                            color : "gray", 
                            marginBottom : 6
                        }}>Cela pourrait prendre un moment.</Text>
                        <View style={styles.progressContainer}>
                            <View style={{height:15 , width:'100%',borderColor:"#eee",borderStyle:"solid",borderWidth:1,position:"relative"}}>
                                <View style={{height:13 , backgroundColor:"#BE2929" ,width:`${progressUpload} %`,position:"absolute"}}></View>
                            </View>
                            <Text>{progressUpload} %</Text>
                        </View>
                    </View>
                </>
            ):(
                <>
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.returnButton}
                            onPress={() => {
                                navigation.goBack();
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color="#141414" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Nouveau Calcul</Text>
                        <TouchableOpacity 
                            onPress={() => setIsPopupVisible(!isPopupVisible)}
                            style={styles.elipsisButton}
                        >                    
                            <Ionicons name="ellipsis-vertical" size={24} color="#141414" />
                        </TouchableOpacity>
                    </View>

                    {
                        isLoading ? 
                        <View style={styles.skeletonContainer}>   
                                                    {[...Array(4)].map((_, index) => (
                                                        <Animated.View
                                                            key={index}
                                                            style={[
                                                                styles.skeletonRow,  
                                                                { 
                                                                    backgroundColor: skeletonBackground,  
                                                                    width: index === 0 ? '100%' 
                                                                    : index === 1 ? '100%' 
                                                                    : index === 2 ? '100%'
                                                                    : index === 3 ? '100%'
                                                                    : index === 4 ? '100%'
                                                                    : index === 5 ? '100%'
                                                                    : index === 6 ? '100%'
                                                                    : index === 7 ? '100%' : "100%"
                                                                },
                                                            ]}
                                                        />
                                                    ))}
                                                </View>
                        :
                        <>
                        <View style={styles.formContainer}>

                            <Text style={styles.label}>Ferme <Text style={styles.required}>*</Text></Text>
                                                            
                                                            <View style={styles.pickerContainer}>
                                                                <Picker
                                                                    disabled={isLoading}
                                                                    selectedValue={selectedFarm}
                                                                    onValueChange={(itemValue) => {
                                                                        setSelectedFarm(itemValue); // Store the farm id
                                                                        const fermeChoisie = allFermes.find(f => f.id === itemValue);
                                                                        setFilteredSerres(fermeChoisie ? allSerre.filter(serre => serre.fermeId === fermeChoisie.id) : []);
                                                                    }}
                                                                    style={styles.picker}
                                                                >
                                                                    <Picker.Item label="Sélectionner une ferme..." value={null} />
                                                                    {allFermes.map((item) => (
                                                                        <Picker.Item key={item.id} label={item.nom_ferme} value={item.id} /> 
                                                                    ))}
                                                                </Picker>
                                                            </View>
                                
                                                            <Text style={styles.label}>Serre <Text style={styles.required}>*</Text></Text>
                                                            <View style={styles.pickerContainer}>
                                                                <Picker
                                                                    disabled={isLoading}
                                                                    selectedValue={selectedGreenhouse}
                                                                    onValueChange={(itemValue) => setSelectedGreenhouse(itemValue)}
                                                                    style={styles.picker}
                                                                >
                                                                    <Picker.Item label="Sélectionner une serre..." value={null} />
                                                                    {filteredSerres.length > 0 && (
                                                                        filteredSerres.map((item) => (
                                                                            <Picker.Item key={item.id} label={item.nom} value={item.id} />
                                                                        ))
                                                                    )}
                                                                </Picker>
                                                            </View>


 



                            <Text style={styles.label}>
                                Vidéo <Text style={styles.required}>*</Text>
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={takeVideo}>
                                <Text style={styles.buttonText}>Prendre une vidéo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={selectVideo}>
                                <Text style={styles.buttonText}>Importer depuis la gallerie</Text>
                            </TouchableOpacity>

                                
                            {videoUri && (
                                <View style={styles.videoInfoContainer}>
                                    <Text style={styles.videoInfoText}>
                                        <Text style={styles.boldText}>Vidéo bien sélectionnée.</Text>
                                    </Text>
                                    {videoInfo.duration && (
                                        <Text style={styles.videoInfoText}>
                                            <Text style={styles.boldText}>Durée :</Text> {videoInfo.duration}
                                        </Text>
                                    )}
                                </View>
                            )}

                                            

                            </View>

                            <TouchableOpacity style={styles.createButton} onPress={uploadVideoInChunks}>
                                <Ionicons name="add" size={18} color="#fff" />
                                <Text style={styles.createButtonText}>Créer le nouveau calcul</Text>
                            </TouchableOpacity>
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
        paddingTop: 30,
        paddingBottom: 0,
        paddingHorizontal: 20,
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
        fontSize: 22,
        color: '#141414',
        fontFamily: 'InriaBold',
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
        fontSize: 15,
        color: '#141414',
    },
    videoInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    videoInfoText: {
        fontSize: 14,
        color: '#141414',
        marginBottom: 5,
    },
    boldText: {
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
        fontSize: 15,
        color: '#141414',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      },
      progressContainer: {
        flexDirection: 'row', // Align text and icon in a row
        alignItems: 'center', // Center vertically
        margin: 12,
      },
      skeletonContainer: {
        marginTop: 20,
    },
    skeletonRow: {
        height: 40,
        borderRadius: 8,
        marginBottom: 15,
    },
});