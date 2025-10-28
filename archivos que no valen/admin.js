// Categoría
document.getElementById('formCategoria').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('cat_nombre').value;
  await fetch('/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  alert('Categoría guardada');
  cargarSelects();
});

// Producto
document.getElementById('formProducto').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = document.getElementById('prod_nombre').value;
  const precio = document.getElementById('prod_precio').value;
  const categoria_id = document.getElementById('prod_categoria').value;

  await fetch('/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, precio, categoria_id })
  });
  alert('Producto guardado');
  cargarSelects();
});

// Imagen
document.getElementById('formImagen').addEventListener('submit', async e => {
  e.preventDefault();
  const url = document.getElementById('img_url').value;
  const producto_id = document.getElementById('img_producto').value;

  await fetch('/imagenes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, producto_id })
  });
  alert('Imagen guardada');
});

// Cargar selects
async function cargarSelects() {
  const catRes = await fetch('/categorias');
  const categorias = await catRes.json();
  const selectCat = document.getElementById('prod_categoria');
  selectCat.innerHTML = categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

  const prodRes = await fetch('/productos');
  const productos = await prodRes.json();
  const selectProd = document.getElementById('img_producto');
  selectProd.innerHTML = productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('');
}

cargarSelects();
