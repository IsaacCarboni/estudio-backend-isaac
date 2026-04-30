import express from 'express';
import { engine } from 'express-handlebars';
import stockRouter from './routes/stock.routes.js';
import StockManager from './StockManager.js';
import { uploader } from './middlewares/multer.js';

const app = express();
const PORT = 8080;
const manager = new StockManager('./stock.json');

// --- CONFIGURACIÓN DE HANDLEBARS CON HELPERS ---
app.engine('hbs', engine({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        // Este helper permite comparar el stock en la vista (ej: si es menor a 5)
        lt: (a, b) => a < b 
    }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views'); 

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 

// --- RUTAS DE VISTAS ---
app.get('/', async (req, res) => {
    try {
        const productos = await manager.getStock();
        
        // Calculamos el valor total de la mercadería en el mostrador
        // Usamos stockKilos para que el cálculo no dé error
const totalPesos = productos.reduce((acc, prod) => acc + (prod.precio * (prod.stockKilos || 0)), 0);
        res.render('index', { 
            productos,
            // Lo formateamos como moneda argentina para que tu viejo lo entienda de una
            valorTotalMostrador: totalPesos.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
        });
    } catch (error) {
        res.status(500).send("Error al cargar el mostrador");
    }
});

app.post('/api/stock/vender/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Buscamos el producto. Usamos parseInt para asegurar que el ID sea número.
        const producto = await manager.getProductById(parseInt(id));

        // IMPORTANTE: Usamos stockKilos que es como figura en tu JSON
        if (producto && producto.stockKilos > 0) {
            const nuevoStock = producto.stockKilos - 1;
            
            // Actualizamos usando el nombre correcto de la propiedad
            await manager.updateProduct(parseInt(id), { stockKilos: nuevoStock });
            
            console.log(`✅ Venta exitosa: 1kg de ${producto.corte}`);
            res.redirect('/'); 
        } else {
            res.status(400).send("No hay stock o el producto no existe");
        }
    } catch (error) {
        console.error("Error detallado:", error); // Esto te va a decir en la consola qué falló exactamente
        res.status(500).send("Error al procesar la venta");
    }
});

// --- RUTA PARA SUBIR FOTOS ---
app.post('/api/productos/imagen', uploader.single('thumbnail'), (req, res) => {
    try {
        if (!req.file) return res.status(400).send("No se seleccionó ninguna imagen.");
        console.log("📸 Foto guardada:", req.file.filename);
        res.redirect('/'); 
    } catch (error) {
        res.status(500).send("Error al subir la foto");
    }
});

app.use('/api/stock', stockRouter);

app.listen(PORT, () => console.log(`🚀 Alfa y Omega Online - Puerto ${PORT}`));