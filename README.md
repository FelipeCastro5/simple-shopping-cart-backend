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

## Tecnologías utilizadas
- **NestJS 11** – Framework principal.
- **TypeScript** – Tipado estático.
- **CQRS** – Patrón de separación de responsabilidades.
- **Swagger** – Documentación de la API.
- **RxJS** – Soporte de programación reactiva.

---
## Funcionalidades: Endpoints disponibles

### **Productos**
| Método | Endpoint     | Descripción                                    | Body | Respuesta exitosa |
|--------|--------------|------------------------------------------------|------|-------------------|
| **GET** | `/products` | Obtiene la lista de productos disponibles.     | —    | **200 OK** → Lista de productos:<br>`[{ id: number, name: string, price: number }]` |

---

### **Carrito**
| Método | Endpoint | Descripción                                             | Body | Respuesta exitosa |
|--------|----------|---------------------------------------------------------|------|-------------------|
| **POST** | `/cart` | Agrega un producto al carrito según su `productId`.    | ```json\n{ "productId": 1 }\n``` | **201 Created** → Producto agregado correctamente. |
| **GET** | `/cart` | Obtiene todos los productos en el carrito.              | —    | **200 OK** → Lista de productos:<br>`[{ id: number, name: string, price: number }]` |

---

**Notas**:
- Si el `productId` no existe, el endpoint `/cart` (POST) devolverá **400 Bad Request**.
- Los datos se almacenan **en memoria**, por lo que se reinician al reiniciar el servidor.
- Documentación interactiva disponible en Swagger:  

---

## Estructura del proyecto

```plaintext
src/
│   app.module.ts       # Módulo raíz
│   main.ts             # Punto de entrada
│
├───application         # Lógica de aplicación (CQRS)
│   ├───carrito
│   │   ├───commands    # Comandos del carrito
│   │   └───handlers    # Manejadores de los comandos
│   ├───producto
│   │   ├───commands    # Comandos de productos
│   │   └───handlers    # Manejadores de los comandos
│   └───utilities       # Utilidades y DTOs de respuesta
│
├───domain              # Capa de dominio
│   ├───carrito         # Lógica y repositorio en memoria del carrito
│   └───producto        # Datos estáticos de productos
│
└───presentation        # Capa de presentación (HTTP)
    ├───controllers     # Controladores de la API
    ├───dtos            # DTOs para Swagger y validaciones
    └───modules         # Módulos organizadores
```

---

## Instrucciones de instalación
### A. Requisitos de Node.js
Para ejecutar este proyecto localmente, necesitarás **Node.js** y **npm** instalados en tu máquina.  
Puedes descargar Node.js desde [https://nodejs.org](https://nodejs.org).

Se recomienda usar:
- **Node.js 20.x (LTS)**
- **npm 9.x**

###  B. Instalación del Repositorio localmente
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/FelipeCastro5/simple-shopping-cart-backend.git
   cd simple-shopping-cart-backend

2. **Instalar dependencias desde la carpeta razi del proyecto con el comando:**
    npm install

3. **Ejecución local desde la carpeta razi del proyecto con el comando:**
    npm run start

    - Backend disponible en: http://localhost:3000
    - Documentación Swagger: http://localhost:3000/swagger/#/
> ⚠️ Asegúrate de que este puertos estén libres antes de ejecutar ambos proyectos.