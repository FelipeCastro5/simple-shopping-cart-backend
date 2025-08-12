export interface Producto {
  id: number;
  name: string;
  price: number;
}

export const PRODUCTS: Producto[] = [
  { id: 1, name: "Producto 1", price: 60 },
  { id: 2, name: "Producto 2", price: 100 },
  { id: 3, name: "Producto 3", price: 120 },
  { id: 4, name: "Producto 4", price: 70 },
];
