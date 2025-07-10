import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Package,
  Banknote,
  AlertTriangle,
  XCircle,
  Trophy,
  AlertCircle,
  Crown,
} from "lucide-react-native";
import { getProducts } from "../../services/api";
import { useGlobalRefresh } from "../../utils/globalRefresh";
import { formatCurrency } from "../../utils/formatCurrency";
import LoadingSpinner from "../../components/LoadingSpinner";

// Fungsi untuk mempersingkat angka besar
const formatShortCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  } else if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}Jt`;
  } else if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  } else {
    return formatCurrency(amount);
  }
};

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const router = useRouter();
  const globalRefreshTrigger = useGlobalRefresh();
  const insets = useSafeAreaInsets();

  const loadData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getProducts();
      setProducts(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (productData) => {
    const totalProducts = productData.length;
    const totalValue = productData.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    const lowStockProducts = productData.filter(
      (product) => product.stock > 0 && product.stock <= 5
    ).length;
    const outOfStockProducts = productData.filter(
      (product) => product.stock === 0
    ).length;

    setStats({
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
    });
  };

  useEffect(() => {
    loadData();
  }, [globalRefreshTrigger]);

  const getTopProductsData = () => {
    return products
      .map((product) => ({
        ...product,
        totalValue: product.price * product.stock,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return products
      .filter((product) => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  };

  const getTopExpensiveProducts = () => {
    return products.sort((a, b) => b.price - a.price).slice(0, 3);
  };

  if (loading) {
    return <LoadingSpinner message="Memuat dashboard..." />;
  }

  const topProducts = getTopProductsData();
  const lowStockProducts = getLowStockProducts();
  const expensiveProducts = getTopExpensiveProducts();

  // Calculate max value for bar chart scaling
  const maxValue = topProducts.length > 0 ? topProducts[0].totalValue : 1;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 60 + Math.max(insets.bottom, 16) + 20 }, // Dynamic bottom padding
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: "#3B82F6" }]}>
              <Package size={24} color="#FFFFFF" style={styles.statIcon} />
              <Text style={styles.statNumber}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Total Produk</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#10B981" }]}>
              <Banknote size={24} color="#FFFFFF" style={styles.statIcon} />
              <Text style={styles.statNumber}>
                {formatShortCurrency(stats.totalValue)}
              </Text>
              <Text style={styles.statLabel}>Nilai Inventory</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: "#F59E0B" }]}>
              <AlertTriangle
                size={24}
                color="#FFFFFF"
                style={styles.statIcon}
              />
              <Text style={styles.statNumber}>{stats.lowStockProducts}</Text>
              <Text style={styles.statLabel}>Stok Rendah</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: "#EF4444" }]}>
              <XCircle size={24} color="#FFFFFF" style={styles.statIcon} />
              <Text style={styles.statNumber}>{stats.outOfStockProducts}</Text>
              <Text style={styles.statLabel}>Habis</Text>
            </View>
          </View>
        </View>

        {/* Top Products Chart */}
        {topProducts.length > 0 && (
          <View style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Trophy size={22} color="#3B82F6" />
              <Text style={styles.chartTitle}>
                Top Produk (Nilai Inventory)
              </Text>
            </View>

            <View style={styles.barChartContainer}>
              {topProducts.map((product, index) => {
                const barWidth = (product.totalValue / maxValue) * 100;
                const isTop = index === 0;

                return (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.barItem}
                    onPress={() =>
                      router.push(`/product-detail?id=${product.id}`)
                    }
                  >
                    <View style={styles.barInfo}>
                      <Text style={styles.barLabel} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.barValue}>
                        {formatShortCurrency(product.totalValue)}
                      </Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${barWidth}%`,
                            backgroundColor: isTop ? "#3B82F6" : "#10B981",
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.barRank}>
                      <Text style={styles.barRankText}>#{index + 1}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Low Stock Products */}
        {lowStockProducts.length > 0 && (
          <View style={styles.listCard}>
            <View style={styles.cardHeader}>
              <AlertCircle size={22} color="#F59E0B" />
              <Text style={styles.listTitle}>Produk Stok Rendah</Text>
            </View>
            {lowStockProducts.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.listItem,
                  index === lowStockProducts.length - 1 && styles.listItemLast,
                ]}
                onPress={() => router.push(`/product-detail?id=${product.id}`)}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemName}>{product.name}</Text>
                  <View style={styles.stockContainer}>
                    <Package size={14} color="#64748B" />
                    <Text style={styles.listItemStock}>
                      Stok: {product.stock} unit
                    </Text>
                  </View>
                </View>
                <Text style={styles.listItemPrice}>
                  {formatCurrency(product.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Expensive Products */}
        {expensiveProducts.length > 0 && (
          <View style={styles.listCard}>
            <View style={styles.cardHeader}>
              <Crown size={22} color="#8B5CF6" />
              <Text style={styles.listTitle}>Produk Termahal</Text>
            </View>
            {expensiveProducts.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.listItem,
                  index === expensiveProducts.length - 1 && styles.listItemLast,
                ]}
                onPress={() => router.push(`/product-detail?id=${product.id}`)}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemName}>{product.name}</Text>
                  <View style={styles.stockContainer}>
                    <Package size={14} color="#64748B" />
                    <Text style={styles.listItemStock}>
                      Stok: {product.stock} unit
                    </Text>
                  </View>
                </View>
                <Text style={styles.listItemPrice}>
                  {formatCurrency(product.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: "center",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  barChartContainer: {
    gap: 16,
  },
  barItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  barInfo: {
    flex: 1,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  barValue: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  barTrack: {
    flex: 2,
    height: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  barFill: {
    height: "100%",
    borderRadius: 12,
    minWidth: 4,
  },
  barRank: {
    minWidth: 32,
    height: 32,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  barRankText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B82F6",
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemContent: {
    flex: 1,
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 6,
    lineHeight: 22,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  listItemStock: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  listItemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: -0.2,
  },
});
