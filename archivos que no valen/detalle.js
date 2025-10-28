const API_URL = "http://localhost:3000";

// Obtener parámetros de la URL (?id=)
const params = new URLSearchParams(window.location.search);
const productoId = params.get("id");

// Cargar datos del producto
async function cargarProducto() {
  const res = await fetch(`${API_URL}/productos`);
  const productos = await res.json();
  const producto = productos.find(p => p.id == productoId);

  if (producto) {
    document.getElementById("nombre").textContent = producto.nombre;
    document.getElementById("precio").textContent = `Precio: $${producto.precio}`;
    document.getElementById("categoria").textContent = producto.categoria;
  }
}

// Cargar imágenes del producto
async function cargarImagenes() {
  const res = await fetch(`${API_URL}/imagenes/${productoId}`);
  const imagenes = await res.json();

  const imagenesDiv = document.getElementById("imagenes");
  imagenes.forEach(img => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    col.innerHTML = `<img src="${img.url}" class="img-fluid rounded shadow">`;
    imagenesDiv.appendChild(col);
  });
}

// Inicializar
cargarProducto();
cargarImagenes();
