import fs from 'fs/promises';
import path from 'path';

const cartsPath = path.resolve('src/data/carts.json');

class CartManager {
  constructor() {
    this.path = cartsPath;
  }

  // Método para criar um carrinho
  async createCart() {
    try {
      const newCart = { id: Date.now().toString(), products: [] };
      const carts = await this.getAll();
      carts.push(newCart);
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Erro ao criar carrinho:", error);
      throw error;
    }
  }

  // Método para obter todos os carrinhos
  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao ler os carrinhos:", error);
      return [];
    }
  }

  // Método para buscar um carrinho por id
  async getCartById(id) {
    try {
      const carts = await this.getAll();  
      return carts.find(cart => cart.id === id);  
    } catch (error) {
      console.log('Erro ao buscar carrinho:', error);
      throw new Error('Erro ao buscar carrinho');
  }
}

  // Método para adicionar um produto ao carrinho
  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) return null;

    const productExists = cart.products.find(p => p.id === productId);
    if (productExists) {
      productExists.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartManager;
