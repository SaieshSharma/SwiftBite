import { create } from 'zustand';

export interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
}

export interface CartItemType {
    id: string; // menu item id
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
}

export interface CartStore {
    items: CartItemType[];
    addItem: (item: Omit<CartItemType, "quantity">) => void;
    removeItem: (id: string, customizations?: CartCustomization[]) => void;
    increaseQty: (id: string, customizations?: CartCustomization[]) => void;
    decreaseQty: (id: string, customizations?: CartCustomization[]) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

// Helper function to compare customizations
const areCustomizationsEqual = (a: CartCustomization[], b: CartCustomization[]): boolean => {
    if (a.length !== b.length) return false;
    return a.every((customA) => 
        b.some((customB) => 
            customA.id === customB.id && 
            customA.name === customB.name && 
            customA.price === customB.price
        )
    );
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    
    addItem: (item) => {
        const existingItemIndex = get().items.findIndex(
            (i) => i.id === item.id && areCustomizationsEqual(i.customizations ?? [], item.customizations ?? [])
        );

        if (existingItemIndex > -1) {
            set({
                items: get().items.map((i, index) =>
                    index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
                ),
            });
        } else {
            set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
    },

    removeItem: (id, customizations = []) => {
        set({
            items: get().items.filter(
                (i) =>
                    !(
                        i.id === id &&
                        areCustomizationsEqual(i.customizations ?? [], customizations)
                    )
            ),
        });
    },

    increaseQty: (id, customizations = []) => {
        set({
            items: get().items.map((i) =>
                i.id === id &&
                areCustomizationsEqual(i.customizations ?? [], customizations)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },

    decreaseQty: (id, customizations = []) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id &&
                    areCustomizationsEqual(i.customizations ?? [], customizations)
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0),
        });
    },

    clearCart: () => set({ items: [] }),

    getTotalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

    getTotalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
