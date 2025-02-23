import React from 'react';
import { View, Image, Text } from 'react-native';



const SplashScreen = () => {
  return (
    <View style={{  height : '100%', width : "100%", alignItems : "center", justifyContent : "center", backgroundColor : "white"  }} >
            <Image
              style={{
                height : 209,  
                width : 209, 
              }}
              source={require('../assets/logot.png')}     
            />    
    </View>  
  );
};

 

export default SplashScreen;