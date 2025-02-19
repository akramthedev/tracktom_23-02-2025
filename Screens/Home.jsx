import React, {useState,useEffect} from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Image, TouchableOpacity,StatusBar } from "react-native";
import * as Font from 'expo-font';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { saveToken, deleteToken, getToken } from '../Helpers/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {

  const [fontsLoaded] = useFonts({
    'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
    'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
    "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
    "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
    "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
});

    const navigation = useNavigation();
    

    //always must be the last 
    if (!fontsLoaded) {
      return null;  
    }
    return (
      <View style={styles.container}>
        
        <Image
          source={require("../images/img1m-min.png")}  
          style={styles.image}
        />

        <View
          style={styles.containerInsider}
        >
          <Text style={styles.title}>Gardez Le Contrôle Total</Text>
          <Text style={styles.title}>Sur Vos Tomates,</Text>
          <Text style={styles.subtitle}>Facilement et Efficacement.</Text>
          <TouchableOpacity  
            style={styles.button}
            onPress={async ()=>{
              //deleteToken();
              // await AsyncStorage.removeItem('userId');
              // await AsyncStorage.removeItem('type');
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.buttonText}>Gérer mes tomates</Text>
            <Ionicons name="chevron-forward" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  containerInsider: {
    flex: 1,
    alignItems: "baseline",
    paddingLeft : 20, 
    paddingRight : 20, 
    paddingTop : 15
  },
  title: {
    fontSize: 26,
    textAlign:"center",
    marginBottom: 5,
    width : "100%",
    color : "#141414" ,
    fontFamily : "InriaLight",
  },
  subtitle: {
    fontSize: 26,
    width : "100%",
    textAlign: "center",
    fontFamily : "serif",
    color: "#BE2929",
    fontStyle : "italic"
  },
  button: {
    backgroundColor: "#BE2929",
    borderRadius: 11,
    position : "absolute", 
    bottom : "10%", 
    right : 20,
    left : 20, 
    alignItems : "center",
    justifyContent: "center", 
    height : 53,
    flexDirection : "row"
  },
  buttonText: {
    color: "#fff",
    fontFamily : "Inter",
    fontSize : 16,
    marginBottom : 3,
    marginRight : 7, 
    fontWeight : "300"
  },
});


export default Home;