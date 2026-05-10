import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface AppState {
  user: any | null;
  cart: CartItem[];
  setUser: (user: any) => void;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      setUser: (user) => set({ user }),
      addToCart: (product, quantity = 1) => set((state) => {
        const existing = state.cart.find(i => i.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(i => i.id === product.id 
              ? { ...i, quantity: i.quantity + quantity } 
              : i)
          };
        }
        return {
          cart: [...state.cart, { 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            imageUrl: product.imageUrl, 
            quantity 
          }]
        };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(i => i.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(i => i.id === productId ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'organic-o-eats-storage',
    }
  )
);
