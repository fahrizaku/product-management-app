import { useState, useEffect, useCallback } from "react";
import { getProducts, deleteProduct } from "../services/api";

// Global state untuk trigger refresh
let refreshTrigger = 0;
const refreshCallbacks = new Set();

export const triggerGlobalRefresh = () => {
  refreshTrigger += 1;
  refreshCallbacks.forEach((callback) => callback());
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  const loadProducts = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await getProducts();
      setProducts(data);
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

  // Setup global refresh listener
  useEffect(() => {
    const refreshCallback = () => {
      setLocalRefreshTrigger((prev) => prev + 1);
    };

    refreshCallbacks.add(refreshCallback);

    return () => {
      refreshCallbacks.delete(refreshCallback);
    };
  }, []);

  // Load products on mount and when refresh triggered
  useEffect(() => {
    loadProducts();
  }, [loadProducts, localRefreshTrigger]);

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
