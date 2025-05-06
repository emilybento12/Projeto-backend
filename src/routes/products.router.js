import { Router } from 'express'
import ProductManager from '../dao/ProductManager.js'

const router = Router()
const manager = new ProductManager()

// Rota para listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await manager.getAll()
    res.json(products)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
})

// Rota para adicionar um novo produto
router.post('/', async (req, res) => {
  try {
    const created = await manager.addProduct(req.body)
    res.status(201).json(created)
  } catch (error) {
    console.error("Erro ao adicionar produto:", error)
    res.status(500).json({ error: 'Erro ao adicionar produto' })
  }
})

// Rota para buscar um produto pelo ID
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params
    const product = await manager.getById(String(pid))  // Chama a função com id como string
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }
    res.json(product)
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error)
    res.status(500).json({ error: 'Erro ao buscar produto por ID' })
  }
})

//Rota para atualizar um produto
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await manager.updateProduct(pid, updateData); // <- corrigido
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Produto não encontrado para atualização' });
    }
    res.status(200).json({ message: 'Produto atualizado com sucesso', product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Delete

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const deleted = await manager.deleteProduct(pid);
    if (!deleted) {
      return res.status(404).json({ error: 'Produto não encontrado para exclusão' });
    }
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

export default router
