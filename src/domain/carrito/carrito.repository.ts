import { Injectable } from '@nestjs/common';
import { Producto, PRODUCTS } from '../producto/products.data';

@Injectable()
export class CarritoRepository {
  private cartItems: Producto[] = [];

  addProduct(productId: number): Producto | null {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    this.cartItems.push(product);
    return product;
  }

  getCart(): Producto[] {
    return this.cartItems;
  }
}
