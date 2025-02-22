import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons,Feather, MaterialCommunityIcons, MaterialIcons,SimpleLineIcons,Entypo, FontAwesome } from '@expo/vector-icons'; 
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import {useAuth} from "../Helpers/AuthContext";




export default function PopUpNavigate({isPopupVisible,setIsPopupVisible}) {

    const slideAnimation = useRef(new Animated.Value(screenWidth)).current;
    const navigation = useNavigation();
    const { setIsAuthenticated } = useAuth();
    const [isSuperAdmin, setisSuperAdmin] = useState(false);


    useEffect(() => {

            if (isPopupVisible) {
                Animated.timing(slideAnimation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            } else {
                Animated.timing(slideAnimation, {
                    toValue: screenWidth,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }
    }, [isPopupVisible]);



    useEffect(()=>{
        const x = async ()=>{
            try{
                const userType = await AsyncStorage.getItem('user_type');
                if(userType){
                    if(userType === "superadmin"){
                        setisSuperAdmin(true);
                    }
                    else{

                        setisSuperAdmin(false);
                    }
                }
                else{
                    setisSuperAdmin(false);
                }
            }
            catch(e){
                setisSuperAdmin(false);
                console.log(e.message);
            }
        }
        x();
    },[]);



    const logout = async () => {
        try{
            await AsyncStorage.removeItem('Token');
            await AsyncStorage.removeItem('user_type');
            setTimeout(()=>{
                setIsAuthenticated(false);
            }, 66);
        }
        catch(e){
            console.log("error logout ===>",e);
        } 
    }
    


    return(

                <Animated.View
                    style={[
                        styles.popupContainer,
                        { transform: [{ translateX: slideAnimation }] },
                    ]}
                >
                    <View
                        style={styles.headercloseButton}
                    >
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsPopupVisible(false)}
                        >
                            <Ionicons name="close" size={26} color="#141414" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView  style={styles.popupContent}>
        
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("Dashboard");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Ionicons name="analytics-outline" size={25} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>Tableau de Board</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>

         

        
                    {
                        isSuperAdmin === true && 
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("MesClients");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Ionicons name="people-outline" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Mes Clients
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>
                    }
                        
                        
        
                        {/* <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("AjouterClient");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Entypo name="plus" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Ajouter un Client
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity> */}
        
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("MesPersonnels");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Ionicons name="people-outline" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Mes Personnels
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>
        
                        {/* <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("AjouterPersonnel");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Entypo name="plus" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Ajouter un Personnel
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity> */}
        
                        
        
        
                        {/* <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("AjouterFerme");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Entypo name="plus" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Ajouter une Ferme
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity> */}
        

                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("MesCalculs");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <MaterialCommunityIcons name="square-root" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Mes Calculs
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>
        
        

                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("MesFermes");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Ionicons name="leaf-outline" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Mes Fermes
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>

                        
                        {/* <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("AjouterCalcul");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Entypo name="plus" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Ajouter un Calcul
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    navigation.navigate("Profil");
                                    setIsPopupVisible(false);
                                }
                            }
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Ionicons name="person-outline" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>Mon Profil</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>
        
                        <TouchableOpacity
                            onPress={logout}
                            style={styles.popupItem}
                        >
                            <View style={styles.popupItemInsider}>
                                <View
                                    style={{
                                        height : 30,
                                        width : 40,
                                        alignItems : "flex-start", 
                                        justifyContent : "center"
                                    }}
                                >
                                    <Feather name="power" size={24} color="#BE2929" />
                                </View>
                                <Text style={styles.popupText}>
                                    Déconnexion
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#141414" />
                        </TouchableOpacity>
        
        
                    </ScrollView>
                </Animated.View>
    );

}

    



const styles = StyleSheet.create({
    popupContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',  
        zIndex: 10, 
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    closeButton: {
        zIndex: 1001,
        width: 50,
        height: 50,
        padding: 0,
        alignItems : "flex-end",
        justifyContent: "flex-end",
    },
    headercloseButton : {
        flexDirection: 'row',
        alignItems: "flex-end",
        justifyContent : "flex-end",
        height : "10%",
        paddingHorizontal : 20,
    },
    popupContent: {
        height : "90%",
        paddingTop : "15%",
    },
    popupText: {
        color: '#141414',
        fontSize: 15,
        fontFamily: 'Inter',
    },
    popupItem : {
        height : 54,
        flexDirection : "row", 
        width : "100%",
        alignItems : "center",
        justifyContent : "space-between",
        paddingHorizontal : 40,
    },
    popupItemInsider : {
        flexDirection : "row", 
        alignItems : "center",
        justifyContent :"flex-start",

    }
});