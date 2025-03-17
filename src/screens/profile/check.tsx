import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import {
  initIAP,
  getProducts,
  purchaseProduct,
  handlePurchaseUpdates,
} from "./inAppPurchases";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initIAP();

    async function fetchProducts() {
      try {
        const items = await getProducts();
        setProducts(items);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();

    const purchaseListener = handlePurchaseUpdates((purchase) => {
    });

    return () => {
      purchaseListener.remove();
    };
  }, []);

  return (
    <View>
      <Text>In-App Purchases</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.price}</Text>
            <Button
              title="Buy"
              onPress={() => purchaseProduct(item.productId)}
            />
          </View>
        )}
      />
    </View>
  );
}
