// app/index.js
import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { useProducts } from "../hooks/useProducts";

export default function ProductList() {
  const router = useRouter();
  const { products, loading, refreshing, error, removeProduct, refresh } =
    useProducts();

  const handleDeleteProduct = async (id) => {
    try {
      await removeProduct(id);
      Alert.alert("Berhasil", "Produk berhasil dihapus");
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal menghapus produk");
    }
  };

  const handleAddProduct = () => {
    router.push("/add-product");
  };

  if (loading) {
    return <LoadingSpinner message="Memuat daftar produk..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard product={item} onDelete={handleDeleteProduct} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={
          products.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        ListEmptyComponent={
          <EmptyState
            title="Belum Ada Produk"
            message="Mulai dengan menambahkan produk pertama Anda"
            actionText="Tambah Produk"
            onAction={handleAddProduct}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddProduct}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});
