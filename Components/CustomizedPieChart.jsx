import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import * as GiftedCharts from 'react-native-gifted-charts';
import { useFonts } from 'expo-font';

const { width: screenWidth } = Dimensions.get("window");

const classColors = {
  classe_A: "#5D9B4B",
  classe_B: "#8DC63F",
  classe_C: "#B9D92D",
  classe_D: "#FFA500",
  classe_E: "#FF4D00",
  classe_F: "#D32F2F",
};



 







export default function CustomizedPieChart({ tomatoColors }) {


 

  const [fontsLoaded] = useFonts({
    'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
  });


  



  const totalTomatoes = Object.values(tomatoColors).reduce((sum, count) => sum + count, 0);

// Check if all values are 0
const isEmptyData = Object.values(tomatoColors).every(value => value === 0);

// Generate chartData for the pie chart
const chartData = isEmptyData
  ? [
      {
        value: 1, // Placeholder value
        color: "#f0f0f0", // Single color for empty data
        text: "0 Kg",
        percentage: "0%",
        onPress: () => {
          setSelectedValue("0%");
          setSelectedColor("#f0f0f0");
        },
      },
    ]
  : Object.entries(tomatoColors).map(([key, count]) => {
      const percentage = ((count / totalTomatoes) * 100).toFixed(1);
      return {
        value: count,
        color: classColors[key] || "#CCCCCC",
        text: `${count} Kg`,
        percentage: `${percentage}%`,
        onPress: () => {
          setSelectedValue(`${percentage}%`);
          setSelectedColor(classColors[key] || "#333");
        },
      };
    });

// Generate legend data (always show all 6 classes)
const legendData = Object.entries(classColors).map(([key, color], index) => {
  const count = tomatoColors[key] || 0; // Get the count for this class (default to 0 if missing)
  return {
    color: color,
    text: `${count} tomates`, // Display the count (even if 0)
    label: `Couleur ${index+1}`, 
  };
});





  // **Trouver la tranche avec le plus grand pourcentage**
  const maxSlice = chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0]);

  // **Définir la tranche la plus grande comme sélectionnée**
  const [selectedValue, setSelectedValue] = useState(maxSlice?.percentage || null);
  const [selectedColor, setSelectedColor] = useState(maxSlice?.color || "#333");




  const [animation] = useState(new Animated.Value(0));


  const animateChart = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 10, // Adjust animation duration
      useNativeDriver: true,
    }).start();
  };


  useEffect(() => {
    animateChart();
  }, [tomatoColors]);

 


  useEffect(() => {
    if (chartData.length > 0) {
      setSelectedValue(maxSlice.percentage);
      setSelectedColor(maxSlice.color);
    }
  }, [tomatoColors]);











  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { opacity: animation },
          { height: chartData.length >= 1 ? 200 : 30 }, 
        ]}
      >
        <GiftedCharts.PieChart
          data={chartData}
          donut
          radius={screenWidth / 4}
          innerRadius={50}
          centerLabelComponent={() =>
            selectedValue ? (
              <Text style={[styles.centerText, { color: selectedColor }]}>
                {selectedValue}
              </Text>
            ) : null
          }
        />
      </Animated.View>

      <View style={styles.legendContainer}>
        {legendData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={{ fontFamily: "Inter", fontSize: 13 }}>
                {item.label}  
              </Text>
            </View>
            <Text style={styles.legendText}>
              {item.text}  
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop : 10,
  },
  centerText: {
    fontFamily: "Inter",
    fontSize: 25,
    fontWeight: "bold",
  },
  legendContainer: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    width: "100%",
    justifyContent: "space-between",
  },
  colorBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#333",
  },
});
