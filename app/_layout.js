// app/_
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false, // Hide header untuk tab navigation
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-product"
          options={{
            title: "Tambah Produk",
            presentation: "modal",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#007AFF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="edit-product"
          options={{
            title: "Edit Produk",
            presentation: "modal",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#007AFF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="product-detail"
          options={{
            title: "Detail Produk",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#007AFF",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
