// utils/globalRefresh.js
import { useState, useEffect } from "react";

// Global state untuk trigger refresh
let refreshTrigger = 0;
const refreshCallbacks = new Set();

export const triggerGlobalRefresh = () => {
  refreshTrigger += 1;
  console.log("Global refresh triggered:", refreshTrigger);
  refreshCallbacks.forEach((callback) => {
    try {
      callback();
    } catch (error) {
      console.error("Error in refresh callback:", error);
    }
  });
};

export const useGlobalRefresh = () => {
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);

  useEffect(() => {
    const refreshCallback = () => {
      console.log("Refresh callback triggered");
      setLocalRefreshTrigger((prev) => prev + 1);
    };

    refreshCallbacks.add(refreshCallback);

    return () => {
      refreshCallbacks.delete(refreshCallback);
    };
  }, []);

  return localRefreshTrigger;
};
