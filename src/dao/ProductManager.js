import fs from 'fs/promises'
import path from 'path'

//const filePath = path.resolve('src/data/products.json')
const filePath = path.resolve('src/data/products.json')
console.log("CAMINHO DO JSON:", filePath)

export default class ProductManager {
  constructor() {
    this.path = filePath // agora o caminho está disponível como this.path
  }
  async getAll() {
    try {
      const data = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error("Erro ao ler os produtos:", error)
      return []  // Retorna uma lista vazia em caso de erro
    }
  }

  async getById(id) {
    try {
      const products = await this.getAll()
      return products.find(p => p.id.toString() === id.toString())
    } catch (error) {
      console.error("Erro ao buscar produto por ID:", error)
      return null
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getAll()
      const newProduct = { id: Date.now().toString(), ...product }
      products.push(newProduct)
      await fs.writeFile(this.path, JSON.stringify(products, null, 2))
      return newProduct
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      throw error  // Repassa o erro
    }
  }

  async updateProduct(id, updateData) {
    try {
      const products = await this.getAll(); // Lê todos os produtos
      const index = products.findIndex(p => p.id === id); // Encontra o índice do produto
  
      if (index === -1) {
        return null; // Produto não encontrado
      }
  
    
  
      // Atualiza o produto no índice encontrado
      products[index] = { ...products[index], ...updateData };
  
      // Escreve o novo array no arquivo
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  
      return products[index]; // Retorna o produto atualizado
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  }
  
  //alterando conf inicial

  async deleteProduct(id) {
    try {
      const products = await this.getAll()
      const filtered = products.filter(p => p.id !== id)
      if (filtered.length === products.length) return false

      await fs.writeFile(this.path, JSON.stringify(filtered, null, 2))
      return true
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      return false
    }
  }

}
