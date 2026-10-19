# Ferretech

Tienda online de ferretería hecha con React (Vite) y JSX. Es la conversión del proyecto `Trabajo-desarrollo-fullstack-2` (HTML + CSS + JavaScript) a la misma estructura de proyecto que `Ev2-real-main`, manteniendo todas las funcionalidades originales: catálogo con buscador, carrito con control de stock, registro e inicio de sesión, recuperación de contraseña con código y panel de administrador para gestionar el catálogo.

**Aún no incluye pruebas.** El entorno de testing (Vitest + Testing Library + jsdom) ya está configurado igual que en `Ev2-real-main`, listo para agregar los tests después.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite (normalmente `http://localhost:5173`). Para comprobar la compilación de producción:

```bash
npm run build
npm run preview
```

```bash
npm run test
npm run test -- --coverage
```

## Rutas

| Ruta | Página | Equivale a |
| --- | --- | --- |
| `/` | `Home` | `index.html` |
| `/admin` | `AdminHome` | `index_admin.html` |
| `/carrito` | `Cart` | `carrito.html` |
| `/login` | `Login` | `login.html` |
| `/ingreso` | `Register` | `ingreso.html` |
| `/ingreso-admin` | `AdminLogin` | `ingreso_admin.html` |
| `/restablecer` | `ResetPassword` | `restablecer.html` |

## Estructura

```text
public/img/                 Imágenes de productos y el ícono del carrito
src/
├── main.jsx                Punto de entrada (BrowserRouter)
├── App.jsx                 Rutas de la aplicación
├── styles.css              Estilos originales, sin cambios
├── components/             Piezas reutilizables
├── pages/                  Una página por cada HTML original
├── context/                Estado compartido de catálogo y carrito
├── services/               Lógica de datos sobre localStorage
├── data/                   Productos iniciales
└── tests/                  Configuración de Vitest (sin tests todavía)
```

## Componentes y comportamientos

| Componente | Qué hace |
| --- | --- |
| `Layout` | Envuelve las páginas con `Header` y `Footer`. Con `showNav` muestra "Mi cuenta" y el carrito. |
| `Header` | Marca, enlace a la cuenta y carrito con contador de unidades. |
| `Footer` | Horario, marca y ubicación. |
| `Hero` | Banner de bienvenida del catálogo. |
| `Catalog` | Buscador por nombre y grilla de productos. Con `admin` cambia las acciones de cada tarjeta. |
| `ProductCard` | Muestra imagen, estado de stock, detalles y precio. Permite agregar al carrito (deshabilitado sin stock) o, en modo admin, editar y dar de baja. |
| `AdminProductForm` | Botón "+ Agregar producto" que despliega el formulario de alta. |
| `CartItem` | Fila del carrito con cantidad (+ / −), subtotal y botón para quitar. |
| `TiendaProvider` | Mantiene productos y carrito en memoria, sincronizados con `localStorage`. Se usa con `useTienda()`. |

## Equivalencias con el proyecto original

| Original | React |
| --- | --- |
| `js/productos.js` | `data/productos.js` (datos iniciales) y `services/productos.js` (stock, precios, alta, edición y baja) |
| `js/carrito.js` | `services/carrito.js`, `context/TiendaContext.jsx` y `components/CartItem.jsx` |
| `js/login.js` y `js/login_admin.js` | `services/auth.js` |
| `js/catalogo.js` | `components/Catalog.jsx`, `ProductCard.jsx` y `AdminProductForm.jsx` |
| Header, footer y hero repetidos en cada HTML | `components/Header.jsx`, `Footer.jsx`, `Hero.jsx` y `Layout.jsx` |
| `styles/styles.css` | `src/styles.css` |
| `img/` | `public/img/` |
| SweetAlert2 desde CDN | paquete npm `sweetalert2` |

Los nombres de las funciones de `services/` (`obtenerProductos`, `agregarAlCarrito`, `validarLogin`…), las claves de `localStorage` y los mensajes de las alertas son los mismos que en el original.

## Datos y persistencia

Todo funciona en el navegador, sin API. Los datos se guardan en `localStorage`:

| Clave | Contenido |
| --- | --- |
| `productos` | Catálogo (se crea con los 3 productos iniciales) |
| `carrito` | Productos agregados con su cantidad |
| `usuarios` | Clientes registrados |
| `admin` | Administradores |
| `usuarioActual` | Sesión iniciada |

El código de recuperación de contraseña se guarda en `sessionStorage` (`codigoRecuperacion`).

Cuentas de prueba: cliente `Mauricio` / `1234` y administrador `Admin` / `1234`.

## Diferencias con el original

- **Formulario de alta de producto:** ahora permanece oculto hasta pulsar "+ Agregar producto". En el original el CSS (`display: flex`) anulaba el atributo `hidden`, así que el formulario se veía siempre.
- **Buscador:** el filtro se mantiene al agregar al carrito o al editar productos. Antes el listado volvía a mostrar todos los productos aunque el texto siguiera escrito.
- **Carrito entre pestañas:** el contador también se actualiza cuando el carrito cambia en otra pestaña.
- **Finalizar compra:** con el carrito vacío ya no muestra "¡Compra simulada con éxito!"; avisa que el carrito está vacío. En el original la compra "se concretaba" aunque no hubiera productos.
- **Navegación:** las páginas son rutas de una sola aplicación, por lo que ya no se recarga el sitio al cambiar de página. Las rutas desconocidas redirigen al inicio.

## Url en la nube

- https://trabajo-desarrollo-fullstack-ev-2.vercel.app
