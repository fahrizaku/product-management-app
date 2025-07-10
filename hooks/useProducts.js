import { useState, useEffect, useCallback } from "react";
import { getProducts, deleteProduct } from "../services/api";
import { useGlobalRefresh } from "../utils/globalRefresh";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Use centralized global refresh system
  const globalRefreshTrigger = useGlobalRefresh();

  const loadProducts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log("Loading products...");
      const data = await getProducts();
      setProducts(data);
      console.log("Products loaded:", data.length);
    } catch (err) {
      setError(err.message);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const removeProduct = useCallback(async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Load products on mount and when global refresh triggered
  useEffect(() => {
    console.log(
      "useProducts: globalRefreshTrigger changed:",
      globalRefreshTrigger
    );
    loadProducts();
  }, [loadProducts, globalRefreshTrigger]);

  return {
    products,
    loading,
    refreshing,
    error,
    loadProducts,
    removeProduct,
    refresh: () => loadProducts(true),
  };
};
