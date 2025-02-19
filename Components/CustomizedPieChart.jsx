import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width: screenWidth } = Dimensions.get("window");

// Define a color mapping for the classes

const classColors = {
  classe_A: "#5D9B4B", // Dark Red
  classe_B: "#8DC63F", // Tomato
  classe_C: "#B9D92D", // Orange
  classe_D: "#FFA500", // Green Yellow
  classe_E: "#FF4D00", // Dark Green
  classe_F: "#D32F2F", // Dark Green
};

export default function CustomizedPieChart({ tomatoColors }) {
  // Prepare data for the Pie Chart
  const chartData = Object.entries(tomatoColors).map(([key, count], index) => ({
    name: `Couleur ${index + 1}`, // Keep the original key for class names
    tomatoes: count,
    color: classColors[key] || "#CCCCCC", // Use mapped color or fallback to gray
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      {/* Pie Chart */}
      <PieChart
        data={chartData}
        width={screenWidth - 40} // Adjust width
        height={screenWidth - 200} // Adjust height for circular shape
        accessor="tomatoes"
        backgroundColor="transparent"
        paddingLeft="15"
        hasLegend={true} // Hide legend from PieChart itself
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            
            <View
              style={{
                flexDirection : "row", 
                alignItems : "center"
              }}
            >
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text
                style={{fontFamily : "Inter", fontSize : 15}}
              >
                {item.name.replace("classe_", "Type ")}
              </Text>
            </View>

            <Text style={styles.legendText}>
              {item.tomatoes} tomates
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
  },
  chart: {
    marginVertical: 10,
  },
  legendContainer: {
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width : 300,  justifyContent : "space-between"
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: "#333",
    fontFamily : "Inter"
  },
});
