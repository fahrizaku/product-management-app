import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 60 + Math.max(insets.bottom, 16) + 20 },
        ]}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplikasi</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Mengubah tema aplikasi</Text>
            </View>
            <Text style={styles.settingValue}>Segera Hadir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifikasi</Text>
              <Text style={styles.settingSubtitle}>
                Pengaturan pemberitahuan
              </Text>
            </View>
            <Text style={styles.settingValue}>Segera Hadir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Backup Data</Text>
              <Text style={styles.settingSubtitle}>Cadangkan data produk</Text>
            </View>
            <Text style={styles.settingValue}>Segera Hadir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Versi Aplikasi</Text>
              <Text style={styles.settingSubtitle}>
                Informasi versi saat ini
              </Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Bantuan</Text>
              <Text style={styles.settingSubtitle}>Panduan penggunaan</Text>
            </View>
            <Text style={styles.settingValue}>❯</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Hubungi Developer</Text>
              <Text style={styles.settingSubtitle}>
                Kirim feedback atau saran
              </Text>
            </View>
            <Text style={styles.settingValue}>❯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Aplikasi Manajemen Produk</Text>
          <Text style={styles.footerSubtext}>
            Dibuat dengan ❤️ untuk membantu bisnis Anda
          </Text>
        </View>
      </ScrollView>
    </View>
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
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D1D1F",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#F8F9FA",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  settingValue: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
