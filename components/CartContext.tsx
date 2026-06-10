"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

export type CartItem = {
  menuItemId: string;
  name: string;
  pricePlz: number;
  quantity: number;
  options?: string;
};

export type CartState = {
  restaurantId: string | null;
  restaurantSlug: string | null;
  restaurantName: string | null;
  items: CartItem[];
};

const initial: CartState = {
  restaurantId: null,
  restaurantSlug: null,
  restaurantName: null,
  items: [],
};

type Action =
  | { type: "SET_RESTAURANT"; restaurantId: string; slug: string; name: string }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "UPDATE_QUANTITY"; menuItemId: string; quantity: number }
  | { type: "REMOVE_ITEM"; menuItemId: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "SET_RESTAURANT":
      return {
        ...state,
        restaurantId: action.restaurantId,
        restaurantSlug: action.slug,
        restaurantName: action.name,
      };
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.menuItemId === action.item.menuItemId && i.options === action.item.options
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menuItemId === action.item.menuItemId && i.options === action.item.options
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.menuItemId !== action.menuItemId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === action.menuItemId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.menuItemId !== action.menuItemId) };
    case "CLEAR":
      return initial;
    default:
      return state;
  }
}

type CartContextValue = {
  state: CartState;
  addItem: (item: CartItem, restaurantId: string, slug: string, name: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
  totalPlz: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initial);
  const totalPlz = state.items.reduce((s, i) => s + i.pricePlz * i.quantity, 0);

  const addItem = (item: CartItem, restaurantId: string, slug: string, name: string) => {
    if (state.restaurantSlug && state.restaurantSlug !== slug) {
      if (typeof window !== "undefined" && !window.confirm("Koszyk z innej restauracji. Wyczyścić?")) return;
      dispatch({ type: "CLEAR" });
    }
    dispatch({ type: "SET_RESTAURANT", restaurantId, slug, name });
    dispatch({ type: "ADD_ITEM", item });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", menuItemId, quantity });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: "REMOVE_ITEM", menuItemId });
  };

  const clearCart = () => dispatch({ type: "CLEAR" });

  return (
    <CartContext.Provider
      value={{ state, addItem, updateQuantity, removeItem, clearCart, totalPlz }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
