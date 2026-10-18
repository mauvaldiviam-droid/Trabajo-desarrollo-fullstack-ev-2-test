# Ferretech

Tienda online de ferretería hecha con React (Vite) y JSX. Es la conversión del proyecto `Trabajo-desarrollo-fullstack-2` (HTML + CSS + JavaScript) a la misma estructura de proyecto que `Ev2-real-main`, manteniendo todas las funcionalidades originales: catálogo con buscador, carrito con control de stock, registro e inicio de sesión, recuperación de contraseña con código y panel de administrador para gestionar el catálogo. El proyecto incluye además una suite de pruebas automatizadas con Vitest y Testing Library.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| React 19 | Interfaz (componentes funcionales y hooks) |
| React Router 7 | Navegación entre páginas sin recargar el sitio |
| Vite 7 | Servidor de desarrollo y compilación |
| SweetAlert2 | Aviso emergente al agregar un producto al carrito |
| Vitest 5, Testing Library y jsdom | Pruebas de componentes, páginas y servicios |

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite (normalmente `http://localhost:5173`).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compilación de producción en `dist/` |
| `npm run preview` | Sirve la compilación de producción para comprobarla |
| `npm run test` | Ejecuta las pruebas en modo observación (se vuelven a correr al guardar cambios) |
| `npm run test -- --run` | Ejecuta las pruebas una sola vez |
| `npm run test -- --coverage` | Ejecuta las pruebas una vez y genera el reporte de cobertura |

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

Cualquier otra ruta redirige al inicio. Las rutas `/`, `/admin` y `/carrito` muestran el menú completo (cuenta y carrito); las páginas de acceso muestran el header solo con la marca.

## Estructura

```text
index.html                  Documento base de Vite (carga las fuentes desde Google Fonts)
vite.config.js              Plugin de React y configuración de Vitest (entorno jsdom)
public/img/                 Imágenes de productos y el ícono del carrito
src/
├── main.jsx                Punto de entrada (BrowserRouter)
├── App.jsx                 Rutas de la aplicación
├── styles.css              Estilos de la tienda (paleta grafito, concreto y amarillo)
├── components/             Piezas reutilizables
├── pages/                  Una página por cada HTML original
├── context/                Estado compartido de catálogo y carrito
├── services/               Lógica de datos sobre localStorage
├── data/                   Productos iniciales
└── tests/                  Pruebas con Vitest y Testing Library
```

Las tipografías (Oswald, Inter y JetBrains Mono) se cargan desde Google Fonts. Sin conexión a internet se usan las de respaldo definidas en `styles.css` (Arial Narrow, Arial y Courier New).

## Componentes y comportamientos

| Componente | Qué hace |
| --- | --- |
| `Layout` | Envuelve las páginas con `Header` y `Footer`. Con `showNav` muestra "Mi cuenta" y el carrito. |
| `Header` | Marca con eslogan, enlace a la cuenta y carrito con contador de unidades. |
| `Footer` | Horario, marca y ubicación. |
| `Hero` | Banner de bienvenida del catálogo. |
| `Catalog` | Buscador por nombre y grilla de productos. Con `admin` cambia las acciones de cada tarjeta: "Editar" pide el nuevo precio y stock, y "Dar de baja" pide confirmación antes de quitar el producto. |
| `ProductCard` | Muestra imagen, estado de stock, detalles y precio. Permite agregar al carrito (deshabilitado sin stock) o, en modo admin, editar y dar de baja. |
| `AdminProductForm` | Botón "+ Agregar producto" que despliega el formulario de alta. Si se deja la foto vacía usa `img/descarga.png`, y si se deja la descripción vacía usa "Sin descripción.". |
| `CartItem` | Fila del carrito con cantidad (+ / −), subtotal y botón para quitar. |
| `TiendaProvider` | Mantiene productos y carrito en memoria, sincronizados con `localStorage`. Se usa con `useTienda()`. |

### Estado de stock

Cada tarjeta muestra el estado según las unidades disponibles:

| Stock | Etiqueta |
| --- | --- |
| 0 | Agotado |
| 1 a 9 | Pocas unidades |
| 10 o más | En stock |

### Stock y carrito

El stock del catálogo se descuenta en cuanto el producto entra al carrito y se devuelve si sale de él:

| Acción | Efecto en el stock |
| --- | --- |
| Agregar al carrito (o botón +) | Descuenta 1 unidad. No hace nada si el producto no tiene stock. |
| Botón − | Devuelve 1 unidad. Si era la última, el producto sale del carrito. |
| Quitar | Devuelve todas las unidades de ese producto. |
| Vaciar carrito | Devuelve todas las unidades del carrito. |
| Finalizar compra | Vacía el carrito y deja el stock descontado. Con el carrito vacío solo avisa. |

El stock nunca baja de cero.

## Datos y persistencia

Todo funciona en el navegador, sin API. Los datos se guardan en `localStorage`:

| Clave | Contenido |
| --- | --- |
| `productos` | Catálogo (se crea con los 3 productos iniciales) |
| `carrito` | Productos agregados con su cantidad |
| `usuarios` | Clientes registrados |
| `admin` | Administradores |
| `usuarioActual` | Sesión iniciada |

El código de recuperación de contraseña se guarda en `sessionStorage` (`codigoRecuperacion`). Es de 6 dígitos y sirve una sola vez.

Cuentas de prueba: cliente `Mauricio` / `1234` y administrador `Admin` / `1234`.

Las imágenes con ruta relativa (por ejemplo `img/images.jpg`) se resuelven con `rutaImagen()`, que antepone la base de Vite; las URLs absolutas (`https:`, `data:`, `blob:` o que empiecen con `/`) se usan tal cual.

## Pruebas

Hay 103 casos de prueba repartidos en 14 archivos dentro de `src/tests/`:

| Archivo | Casos | Qué verifica |
| --- | --- | --- |
| `auth.test.js` | 15 | Cuentas por defecto, login de cliente y administrador, sesión, creación de cuentas, código de recuperación y cambio de contraseña |
| `carrito.test.js` | 13 | Total y conteo del carrito, agregar, quitar, eliminar, vaciar y finalizar compra, y su efecto en el stock |
| `productos.test.js` | 13 | Estado de stock, formato de precio, ids, carga inicial, ajuste de stock, alta, edición y baja, y `rutaImagen` |
| `App.test.jsx` | 11 | Cada ruta muestra su página, redirección de rutas desconocidas y flujos entre páginas |
| `Catalog.test.jsx` | 10 | Búsqueda, agregar al carrito y acciones de administrador (editar y dar de baja) |
| `Cart.test.jsx` | 7 | Carrito vacío, totales, +, −, quitar, vaciar y finalizar compra |
| `Header.test.jsx` | 5 | Marca, menú con y sin `showNav`, contador y navegación |
| `ProductCard.test.jsx` | 5 | Datos del producto, estado de stock y modo administrador |
| `Login.test.jsx` | 5 | Campos vacíos, credenciales válidas e inválidas |
| `ResetPassword.test.jsx` | 5 | Recuperación en dos pasos: usuario y código |
| `AdminProductForm.test.jsx` | 4 | Abrir y cancelar el formulario, valores por defecto y validación |
| `CartItem.test.jsx` | 4 | Datos de la fila y avisos de +, − y quitar |
| `Register.test.jsx` | 3 | Alta de cuenta, campos vacíos y usuario repetido |
| `AdminLogin.test.jsx` | 3 | Ingreso de administrador, credenciales inválidas y cliente sin permisos |

Algunos casos conservan el identificador de su plan de pruebas en el título: `CP-01` a `CP-05` (login y registro) y `NAV-01`, `NAV-02`, `NAV-03` y `NAV-05` (navegación).

Cómo están escritas:

- `localStorage` y `sessionStorage` se limpian entre casos para que cada prueba parta desde cero.
- `window.alert`, `window.confirm` y `window.prompt` se reemplazan con espías de Vitest para comprobar los mensajes y simular las respuestas del usuario.
- `sweetalert2` se simula con un mock, y `Math.random` se fija cuando hace falta un código de recuperación predecible.
- Las páginas se renderizan dentro de `MemoryRouter`, con `TiendaProvider` cuando usan el carrito o el catálogo.
- `src/tests/configTest.js` carga los matchers de `@testing-library/jest-dom`.

### Cobertura

`npm run test -- --coverage` genera el reporte en `coverage/` (carpeta ignorada por git); abre `coverage/index.html` para verlo. El último reporte generado dio:

| Statements | Branches | Functions | Lines |
| --- | --- | --- | --- |
| 96,87 % | 91,66 % | 97,41 % | 96,91 % |

Las carpetas `pages/` y `services/` están prácticamente al 100 %. El archivo con menos cobertura es `context/TiendaContext.jsx` (82,5 % de líneas y 27,3 % de ramas).

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

Los nombres de las funciones de `services/` (`obtenerProductos`, `agregarAlCarrito`, `validarLogin`…) y las claves de `localStorage` son los mismos que en el original. SweetAlert2 se usa solo para el aviso al agregar al carrito; el resto de los avisos usan `window.alert`, `window.confirm` y `window.prompt`.

## Diferencias con el original

- **Formulario de alta de producto:** ahora permanece oculto hasta pulsar "+ Agregar producto". En el original el CSS (`display: flex`) anulaba el atributo `hidden`, así que el formulario se veía siempre.
- **Buscador:** el filtro se mantiene al agregar al carrito o al editar productos. Antes el listado volvía a mostrar todos los productos aunque el texto siguiera escrito.
- **Carrito entre pestañas:** el contador también se actualiza cuando el carrito cambia en otra pestaña.
- **Finalizar compra:** con el carrito vacío ya no muestra "¡Compra simulada con éxito!"; avisa que el carrito está vacío. En el original la compra "se concretaba" aunque no hubiera productos.
- **Navegación:** las páginas son rutas de una sola aplicación, por lo que ya no se recarga el sitio al cambiar de página. Las rutas desconocidas redirigen al inicio.

## Url a la nube.

- trabajo-desarrollo-fullstack-ev-2-t.vercel.app
