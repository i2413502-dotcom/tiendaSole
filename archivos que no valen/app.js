// Cargar categorías en el menú
async function cargarCategorias() {
  const res = await fetch('/categorias');
  const categorias = await res.json();
  const menu = document.getElementById('menuCategorias');
  menu.innerHTML = '';

  // Enlace "Todos"
  const allBtn = document.createElement('button');
  allBtn.innerText = "Todos";
  allBtn.className = "px-4 py-2 bg-gray-300 rounded";
  allBtn.onclick = cargarProductos;
  menu.appendChild(allBtn);

  // Enlaces dinámicos
  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.innerText = cat.nombre;
    btn.className = "px-4 py-2 bg-blue-500 text-white rounded ml-2";
    btn.onclick = () => cargarProductosPorCategoria(cat.id);
    menu.appendChild(btn);
  });
}

// Mostrar todos los productos
async function cargarProductos() {
  const res = await fetch('/productos');
  const productos = await res.json();
  renderProductos(productos);
}

// Mostrar productos por categoría
async function cargarProductosPorCategoria(id) {
  const res = await fetch(`/productos/categoria/${id}`);
  const productos = await res.json();
  renderProductos(productos);
}

// Renderizar productos
function renderProductos(productos) {
  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = "p-4 bg-white rounded shadow max-w-xs";

    card.innerHTML = `
      <img src="${prod.imagen || 'https://via.placeholder.com/150'}" 
           alt="${prod.nombre}" 
           class="w-full h-auto rounded mb-3">
      <h3 class="text-lg font-bold">${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <p>Categoría: ${prod.categoria || "Sin categoría"}</p>
    `;

    lista.appendChild(card);
  });
}

// Inicializar
cargarCategorias();
cargarProductos();
