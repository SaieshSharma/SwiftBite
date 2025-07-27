import { useCartStore } from "@/store/cart.store";
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    return (
        <SafeAreaView className="bg-white h-full">
            <View className="flex-1 px-5 pt-5">
                <Text className="h3-bold text-dark-100 mb-5">Your Cart</Text>
                
                {totalItems === 0 ? (
                    <View className="flex-1 flex-center">
                        <Text className="paragraph-medium text-gray-200">Your cart is empty</Text>
                    </View>
                ) : (
                    <View className="flex-1">
                        <FlatList
                            data={items}
                            renderItem={({ item }) => (
                                <View className="cart-item">
                                    <View className="flex flex-row items-center gap-x-3">
                                        <View className="cart-item__image">
                                            <Text className="paragraph-bold">{item.name[0]}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="base-bold text-dark-100">{item.name}</Text>
                                            <Text className="paragraph-bold text-primary mt-1">
                                                ${item.price} x {item.quantity}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="base-bold text-dark-100">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            keyExtractor={(item) => `${item.id}-${item.quantity}`}
                        />
                        
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">Payment Summary</Text>
                            <View className="flex-between flex-row my-1">
                                <Text className="paragraph-medium text-gray-200">
                                    Total Items ({totalItems})
                                </Text>
                                <Text className="paragraph-bold text-dark-100">
                                    ${totalPrice.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default Cart