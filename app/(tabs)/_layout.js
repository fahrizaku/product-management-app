// app/
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BarChart3, Package, Settings } from "lucide-react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 16), // Use safe area bottom
          paddingHorizontal: 16,
          height: 60 + Math.max(insets.bottom, 16), // Dynamic height based on safe area
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerStatusBarHeight: insets.top, // Proper status bar handling
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
