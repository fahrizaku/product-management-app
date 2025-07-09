import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Daftar Produk",
            headerTitle: "Manajemen Produk",
          }}
        />
        <Stack.Screen
          name="add-product"
          options={{
            title: "Tambah Produk",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="edit-product"
          options={{
            title: "Edit Produk",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="product-detail"
          options={{
            title: "Detail Produk",
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
