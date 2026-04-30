import { Router } from 'express';
import StockManager from '../StockManager.js';
import { validarProducto } from '../middlewares/validarProducto.js';

// 1. PRIMERO definimos el router y el manager
const router = Router();
const manager = new StockManager('./stock.json');

// 2. DESPUÉS definimos las rutas (el orden acá no importa tanto, pero siempre después de definir el router)

// Ruta GET para ver todo
router.get('/', async (req, res) => {
    const stock = await manager.getStock();
    res.json(stock);
});

// Ruta POST protegida por el middleware (¡Acá va la validación!)
router.post('/', validarProducto, async (req, res) => {
    const { corte, stockKilos, precio } = req.body;
    const nuevo = await manager.addProduct({ corte, stockKilos, precio, fecha: new Date() });
    res.status(201).json(nuevo);
});

// 3. AL FINAL exportamos
export default router;