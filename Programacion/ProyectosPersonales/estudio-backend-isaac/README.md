🥩 Proyecto Alfa y Omega - Backend I
Este es el repositorio del proyecto Alfa y Omega, una aplicación de gestión de stock para carnicería. El objetivo de este entregable es demostrar la integración de un servidor Express con motores de plantillas, rutas modulares y gestión de archivos.

🚀 Tecnologías y Conceptos Aplicados
Express.js: Framework base para el servidor.

Handlebars (HBS): Motor de plantillas para renderizar vistas dinámicas (Layouts, Partials y Helpers).

Express Router: Modularización de rutas para un código escalable y limpio.

Multer: Middleware para la carga y validación de imágenes de productos.

Persistencia: Manejo de datos mediante archivos JSON (stock.json).

🛠️ Instalación y Configuración
Clonar el repositorio:

Bash
git clone https://github.com/IsaacCarboni/estudio-backend-isaac.git
Instalar dependencias:

Bash
   npm install
💻 Cómo ejecutar el proyecto
Para iniciar el servidor en modo desarrollo (usando nodemon o el script configurado):

Bash
npm start
El servidor corre por defecto en el puerto 8080 (o el que hayas configurado en app.js).

🧪 Pruebas de Endpoints (Criterios de Aceptación)
Vista Principal: Visitar http://localhost:8080/ para ver el listado de productos renderizado con Handlebars.

Carga de Archivos (Multer):

Ruta: POST /upload (o la ruta que definiste en tus routers).

Campo (Key): image (asegurarse de que coincida con el nombre usado en upload.single()).

Validación: El sistema verifica que el archivo sea una imagen y lo almacena en la carpeta public/img.