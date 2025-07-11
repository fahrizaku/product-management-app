// app/(tabs)/_layout.js
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarChart3, Package, Settings } from "lucide-react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF", // Kembali ke warna normal
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Kembali ke putih
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingTop: 16, // Increase top padding untuk dorong icon ke atas
          paddingBottom: Math.max(insets.bottom + 16, 32), // More bottom space
          paddingHorizontal: 16,
          height: 80 + Math.max(insets.bottom, 24), // Taller height
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          // Remove shadows completely
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4, // Reduce gap between icon and label
          marginBottom: 8, // More space at bottom
        },
        tabBarIconStyle: {
          marginTop: 0, // Remove top margin to push icon up
          marginBottom: 2,
        },
        // Remove all press effects
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 0.7,
        tabBarItemStyle: {
          paddingVertical: 0, // Remove extra padding
          backgroundColor: "transparent",
          justifyContent: "center", // Center content
          alignItems: "center",
        },
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerStatusBarHeight: insets.top,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerTitle: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Produk",
          headerTitle: "Manajemen Produk",
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size || 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "Pengaturan",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size || 24} />
          ),
        }}
      />
    </Tabs>
  );
}
