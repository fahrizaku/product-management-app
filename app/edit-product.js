// app/edit-product.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../components/LoadingSpinner";
import { getProduct, updateProduct } from "../services/api";

export default function EditProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { id } = useSearchParams();

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      setInitialLoading(true);
      const product = await getProduct(id);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
      });
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal memuat data produk", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama produk wajib diisi";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Nama produk minimal 3 karakter";
    }

    if (!formData.price) {
      newErrors.price = "Harga wajib diisi";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Harga harus berupa angka positif";
    }

    if (!formData.stock) {
      newErrors.stock = "Stok wajib diisi";
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stok harus berupa angka non-negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateProduct(id, {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });

      Alert.alert("Berhasil", "Produk berhasil diperbarui", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Gagal memperbarui produk");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Memuat data produk..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Produk *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                placeholder="Masukkan nama produk"
                placeholderTextColor="#999"
                maxLength={100}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Harga (Rp) *</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                value={formData.price}
                onChangeText={(value) => updateFormData("price", value)}
                placeholder="Masukkan harga produk"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {errors.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Stok *</Text>
              <TextInput
                style={[styles.input, errors.stock && styles.inputError]}
                value={formData.stock}
                onChangeText={(value) => updateFormData("stock", value)}
                placeholder="Masukkan jumlah stok"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {errors.stock && (
                <Text style={styles.errorText}>{errors.stock}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Menyimpan..." : "Perbarui Produk"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "white",
    color: "#1D1D1F",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
