export const validarProducto = (req, res, next) => {
    const { corte, stockKilos, precio } = req.body;

    // Si falta el nombre o el stock es negativo, lo rebotamos
    if (!corte || typeof stockKilos !== 'number' || stockKilos < 0) {
        return res.status(400).json({ 
            error: "Datos inválidos", 
            detalle: "El nombre del corte es obligatorio y el stock debe ser un número positivo." 
        });
    }

    // Si todo está OK, le damos el "gancho" para que pase
    console.log(`✅ Producto validado: ${corte}`);
    next();
};