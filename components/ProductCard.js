// components/ProductCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Edit3,
  Trash2,
  Package,
  Calendar,
  Coins,
  Wallet,
  CreditCard,
  Banknote,
} from "lucide-react-native";
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
    if (stock === 0) return "#EF4444";
    if (stock <= 5) return "#F59E0B";
    return "#10B981";
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
      activeOpacity={0.95}
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
        <View style={styles.contentRow}>
          <Banknote size={18} color="#3B82F6" />
          <Text style={styles.productPrice}>
            {formatCurrency(product.price)}
          </Text>
        </View>

        <View style={styles.contentRow}>
          <Package size={16} color="#6B7280" />
          <Text style={styles.productStock}>Stok: {product.stock} unit</Text>
        </View>

        <View style={styles.contentRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.productDate}>
            Dibuat: {new Date(product.createdAt).toLocaleDateString("id-ID")}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEdit}
        >
          <Edit3 size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Trash2 size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 6,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  stockBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  cardContent: {
    marginBottom: 20,
    gap: 8,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: -0.2,
  },
  productStock: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
  productDate: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "400",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  editButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
});

export default ProductCard;
