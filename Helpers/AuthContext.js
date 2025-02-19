import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [triggerIt, settriggerIt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{

    const x = async ()=>{
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      try{
        const token = await AsyncStorage.getItem("Token");
        if(token){
          setIsAuthenticated(true);
        }
        else{
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
      catch(e){
        setIsLoading(false);
        setIsAuthenticated(false);
      }
      finally{
        //npx eas build -p android --profile preview
        setIsLoading(false);
      }
    }
    x();

  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, setIsAuthenticated, triggerIt, settriggerIt }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
