// components/ProductCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { formatCurrency } from "../utils/formatCurrency";

const ProductCard = ({ product, onDelete }) => {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus "${product.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => onDelete(product.id),
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/edit-product?id=${product.id}`);
  };

  const handleViewDetail = () => {
    router.push(`/product-detail?id=${product.id}`);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "#FF3B30";
    if (stock <= 5) return "#FF9500";
    return "#34C759";
  };

  const getStockText = (stock) => {
    if (stock === 0) return "Habis";
    if (stock <= 5) return "Stok Terbatas";
    return "Tersedia";
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleViewDetail}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View
          style={[
            styles.stockBadge,
            { backgroundColor: getStockColor(product.stock) },
          ]}
        >
          <Text style={styles.stockBadgeText}>
            {getStockText(product.stock)}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
        <Text style={styles.productStock}>Stok: {product.stock} unit</Text>
        <Text style={styles.productDate}>
          Dibuat: {new Date(product.createdAt).toLocaleDateString("id-ID")}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 12,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    marginBottom: 16,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  productStock: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  productDate: {
    fontSize: 14,
    color: "#999",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProductCard;
