import React from 'react';
import { View, Image, Text } from 'react-native';



const SplashScreen = () => {
  return (
    <View style={{  height : '100%', width : "100%", alignItems : "center", justifyContent : "center", backgroundColor : "white"  }} >
            <Image
              style={{
                height : 50,  
                width : 50, 
              }}
              source={require('./loader.gif')}     
            />    
    </View>  
  );
};

 

export default SplashScreen;