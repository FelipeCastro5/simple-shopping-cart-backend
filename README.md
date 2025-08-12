# Simple Shopping Cart - Backend

## Descripción y propósito
Este backend implementa una **API RESTful** que gestiona un listado de productos y un carrito de compras en memoria.  
Está diseñado como parte de la prueba técnica en la postulación al rol de Desarrollador Web en HoyTrabajas, con el objetivo de mostrar mis conocimientos en **NestJS** y arquitectura limpia (**CQRS**).

**Autor:** Daniel Felipe Castro Lizarazo  
**Propósito:** Proveer un backend sencillo que permita:
- Listar productos.
- Agregar productos al carrito.
- Consultar el contenido del carrito.

---

## 🛠 Tecnologías utilizadas
- **NestJS 11** – Framework principal.
- **TypeScript** – Tipado estático.
- **CQRS** – Patrón de separación de responsabilidades.
- **Swagger** – Documentación de la API.
- **RxJS** – Soporte de programación reactiva.

---

## 📂 Estructura del proyecto
src/
│ app.module.ts # Módulo raíz
│ main.ts # Punto de entrada
│
├───application # Lógica de aplicación (CQRS)
│ ├───carrito
│ │ ├───commands # Comandos del carrito
│ │ └───handlers # Manejadores de los comandos
│ ├───producto
│ │ ├───commands # Comandos de productos
│ │ └───handlers # Manejadores de los comandos
│ └───utilities # Utilidades y DTOs de respuesta
│
├───domain # Capa de dominio
│ ├───carrito # Lógica y repositorio en memoria del carrito
│ └───producto # Datos estáticos de productos
│
├───presentation # Capa de presentación (HTTP)
  ├───controllers # Controladores de la API
  ├───dtos # DTOs para Swagger y validaciones
  └───modules # Módulos organizadores

---

## ⚙️ Instrucciones de instalación
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/FelipeCastro5/simple-shopping-cart-backend.git
   cd simple-shopping-cart-backend

2. **Instalar dependencias**
    npm install

3. **Ejecución local**
    npm run start

    Backend disponible en: http://localhost:3000
  
    Documentación Swagger: http://localhost:3000/swagger/#/