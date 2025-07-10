import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProduct, deleteProduct } from "../services/api";
import { formatCurrency } from "../utils/formatCurrency";
import { triggerGlobalRefresh, useGlobalRefresh } from "../utils/globalRefresh";

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Use centralized global refresh system
  const globalRefreshTrigger = useGlobalRefresh();

  const loadProduct = async () => {
    try {
      setPageLoading(true);
      console.log("Loading product detail for ID:", id);
      const data = await getProduct(id);
      setProduct(data);
      console.log("Product detail loaded:", data);
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal memuat data produk", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setPageLoading(false);
    }
  };

  // Load product on mount and when global refresh triggered
  useEffect(() => {
    if (id) {
      console.log(
        "ProductDetail: globalRefreshTrigger changed:",
        globalRefreshTrigger
      );
      loadProduct();
    }
  }, [id, globalRefreshTrigger]);

  const handleEdit = () => {
    router.push(`/edit-product?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus "${product?.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(id);
      Alert.alert("Berhasil", "Produk berhasil dihapus", [
        {
          text: "OK",
          onPress: () => {
            // Trigger global refresh before navigating back
            console.log("Triggering global refresh from product-detail delete");
            triggerGlobalRefresh();
            router.replace("/");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal menghapus produk");
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Habis", color: "#FF3B30" };
    if (stock <= 5) return { text: "Stok Terbatas", color: "#FF9500" };
    return { text: "Tersedia", color: "#34C759" };
  };

  if (pageLoading) {
    return <LoadingSpinner message="Memuat detail produk..." />;
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produk tidak ditemukan</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const stockStatus = getStockStatus(product.stock);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.productName}>{product.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: stockStatus.color },
              ]}
            >
              <Text style={styles.statusText}>{stockStatus.text}</Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Harga</Text>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          </View>

          <View style={styles.stockSection}>
            <Text style={styles.stockLabel}>Stok Tersedia</Text>
            <Text style={styles.stock}>{product.stock} unit</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dibuat pada:</Text>
              <Text style={styles.infoValue}>
                {new Date(product.createdAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Terakhir diupdate:</Text>
              <Text style={styles.infoValue}>
                {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Produk:</Text>
              <Text style={styles.infoValue}>#{product.id}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Hapus Produk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  priceSection: {
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  stockSection: {
    marginBottom: 24,
  },
  stockLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  stock: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#1D1D1F",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  actionButtons: {
    gap: 12,
  },
  editButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
