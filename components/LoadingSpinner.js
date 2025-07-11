// components/LoadingSpinner.js
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoadingSpinner = ({ message = "Memuat..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default LoadingSpinner;
