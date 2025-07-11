// app/(tabs)/products.js
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, X, Plus, RefreshCw } from "lucide-react-native";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import { useProducts } from "../../hooks/useProducts";

export default function ProductList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef(null);
  const { products, loading, refreshing, error, removeProduct, refresh } =
    useProducts();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    return products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower) ||
        product.price?.toString().includes(searchQuery)
      );
    });
  }, [products, searchQuery]);

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

  const handleSearchClear = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchContainerPress = () => {
    searchInputRef.current?.focus();
  };

  if (loading) {
    return <LoadingSpinner message="Memuat daftar produk..." />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <RefreshCw size={18} color="#FFFFFF" />
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.fab,
            { bottom: 80 + Math.max(insets.bottom, 24) + 20 },
          ]}
          onPress={handleAddProduct}
        >
          <Plus size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableWithoutFeedback onPress={handleSearchContainerPress}>
            <View
              style={[
                styles.searchInputContainer,
                isSearchFocused && styles.searchInputFocused,
              ]}
            >
              <Search size={22} color="#9CA3AF" />
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Cari produk..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                blurOnSubmit={false}
                selectTextOnFocus={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleSearchClear}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={18} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Results Count */}
        {searchQuery.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {filteredProducts.length} hasil ditemukan
              {searchQuery && ` untuk "${searchQuery}"`}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} onDelete={handleDeleteProduct} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          contentContainerStyle={
            filteredProducts.length === 0
              ? styles.emptyContainer
              : [
                  styles.listContainer,
                  { paddingBottom: 80 + Math.max(insets.bottom, 24) + 100 },
                ]
          }
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <EmptyState
                title="Tidak Ada Hasil"
                message={`Tidak ditemukan produk yang cocok dengan "${searchQuery}"`}
                actionText="Bersihkan Pencarian"
                onAction={handleSearchClear}
              />
            ) : (
              <EmptyState
                title="Belum Ada Produk"
                message="Mulai dengan menambahkan produk pertama Anda"
                actionText="Tambah Produk"
                onAction={handleAddProduct}
              />
            )
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
        />

        <TouchableOpacity
          style={[
            styles.fab,
            { bottom: 80 + Math.max(insets.bottom, 24) + 20 },
          ]}
          onPress={handleAddProduct}
        >
          <Plus size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  searchContainer: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minHeight: 48,
    gap: 12,
  },
  searchInputFocused: {
    backgroundColor: "#FFFFFF",
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    padding: 0,
    fontWeight: "400",
    minHeight: 24,
  },
  clearButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "400",
    letterSpacing: 0.2,
  },
  listContainer: {
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  errorMessage: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
