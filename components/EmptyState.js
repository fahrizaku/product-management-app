// components/EmptyState.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const EmptyState = ({
  title = "Belum ada data",
  message = "Belum ada produk yang ditambahkan",
  actionText = "Tambah Produk",
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D1D1F",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EmptyState;
