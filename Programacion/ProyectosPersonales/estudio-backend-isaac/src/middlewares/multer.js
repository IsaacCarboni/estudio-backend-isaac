import multer from 'multer';
import path from 'path';

// Configuración de dónde y cómo se guardan los archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img'); // Las fotos se guardan en esta carpeta
    },
    filename: (req, file, cb) => {
        // Le ponemos un nombre único: tiempo-nombreoriginal
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro para que solo acepte imágenes (Seguridad que pide Coder)
const fileFilter = (req, file, cb) => {
    const validExtensions = ['.jpg', '.png', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (validExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, webp)'), false);
    }
};

export const uploader = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por foto
});