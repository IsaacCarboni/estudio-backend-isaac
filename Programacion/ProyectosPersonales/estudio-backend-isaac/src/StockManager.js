import fs from 'fs'; // Importamos el "brazo mecánico" para tocar archivos

class StockManager {
    constructor(path) {
        this.path = path; // Le decimos dónde está el cuaderno (stock.json)
    }
// Método que te faltaba para buscar un producto específico
    async getProductById(id) {
        const stock = await this.getStock();
        const producto = stock.find(p => p.id === id);
        return producto || null; // Si lo encuentra lo da, si no, devuelve null
    }
    // PASO A: Leer lo que hay
    async getStock() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data); // Convierte el texto en una lista de verdad
        } catch (error) {
            return []; // Si el cuaderno no existe, devuelve lista vacía
        }
    }

    // PASO B: Agregar mercadería
    async addProduct(product) {
        const stock = await this.getStock(); // Primero leemos qué hay
        // Le ponemos un ID automático (el último + 1)
        product.id = stock.length > 0 ? stock[stock.length - 1].id + 1 : 1;
        stock.push(product); // Metemos el corte nuevo a la lista
        // Guardamos la lista actualizada en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(stock, null, 2));
        return product;
    }

    // PASO C: Descontar por venta (La magia)
    async sellProduct(id, kilosVendidos) {
        const stock = await this.getStock();
        const index = stock.findIndex(p => p.id === id); // Buscamos el corte por su ID

        if (index !== -1) {
            if (stock[index].stockKilos >= kilosVendidos) {
                stock[index].stockKilos -= kilosVendidos; // Restamos los kilos
                await fs.promises.writeFile(this.path, JSON.stringify(stock, null, 2));
                return { success: true, product: stock[index] };
            }
            return { success: false, message: "No alcanza el stock" };
        }
        return { success: false, message: "No se encuentra ese corte" };
    }

  async updateProduct(id, camposNuevos) {
    const stock = await this.getStock();
    // Buscamos en qué posición está el producto con ese ID
    const index = stock.findIndex(p => p.id === id);

    if (index !== -1) {
        // "Pisamos" los datos viejos con los nuevos usando el operador spread (...)
        stock[index] = { ...stock[index], ...camposNuevos, id };
        
        // Guardamos la lista completa de nuevo en el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(stock, null, 2));
        return { success: true, product: stock[index] };
    }
    return { success: false };
}

// PASO D: El Vigilante (Alertas de poco stock)
    async checkAlertas(limite) {
        const stock = await this.getStock();
        // Filtramos: "Dame solo los cortes que tengan menos o igual que el límite"
        return stock.filter(p => p.stockKilos <= limite);
    }

    // PASO E: El Contador (Balance de capital)
async getBalance() {
    const stock = await this.getStock();
    
    // Sumamos los kilos asegurándonos de que sean números reales
    const totalKilos = stock.reduce((acc, p) => acc + (Number(p.stockKilos) || 0), 0);
    
    // Calculamos la plata total bancándose cualquier nombre de campo (precio o precioKilo)
    const valorPesos = stock.reduce((acc, p) => {
        const precioActual = Number(p.precio || p.precioKilo || 0);
        const kilosActuales = Number(p.stockKilos || 0);
        return acc + (precioActual * kilosActuales);
    }, 0);

    return {
        total_kilos_en_camara: totalKilos.toFixed(2),
        valor_total_inventario: valorPesos,
        cantidad_de_cortes: stock.length,
        fecha_reporte: new Date().toLocaleString()
    };
}
}

export default StockManager;