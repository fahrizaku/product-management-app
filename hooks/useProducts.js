// hooks/useProducts.js
import { useState, useEffect, useCallback } from "react";
import { getProducts, deleteProduct } from "../services/api";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
