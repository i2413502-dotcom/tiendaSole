document.getElementById('verProductosBtn').onclick = mostrarProductos;
document.getElementById('verCategoriasBtn').onclick = mostrarCategorias;
document.getElementById('agregarProductoBtn').onclick = mostrarFormularioProducto;
document.getElementById('agregarCategoriaBtn').onclick = mostrarFormularioCategoria;

let usuarioLogueado = null;

// Mostrar/ocultar botones según login
function actualizarBarra() {
  document.getElementById('logoutBtn').style.display = usuarioLogueado ? 'inline-block' : 'none';
  document.getElementById('loginBtn').style.display = usuarioLogueado ? 'none' : 'inline-block';
  document.getElementById('agregarProductoBtn').style.display = usuarioLogueado ? 'inline-block' : 'none';
  document.getElementById('agregarCategoriaBtn').style.display = usuarioLogueado ? 'inline-block' : 'none';
}

// Mostrar login
document.getElementById('loginBtn').onclick = mostrarLogin;
document.getElementById('logoutBtn').onclick = function() {
  usuarioLogueado = null;
  actualizarBarra();
  mostrarProductos(); // 🔹 refrescar productos al cerrar sesión
};

function mostrarLogin() {
  document.getElementById('loginContainer').style.display = 'block';
  document.getElementById('registroContainer').style.display = 'none';
  document.getElementById('contenido').style.display = 'none';
  actualizarBarra();
}
function mostrarRegistro() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('registroContainer').style.display = 'block';
  document.getElementById('contenido').style.display = 'none';
  actualizarBarra();
}
function mostrarContenido() {
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('registroContainer').style.display = 'none';
  document.getElementById('contenido').style.display = 'block';
  actualizarBarra();
  mostrarProductos();
}

document.getElementById('mostrarRegistroBtn').onclick = mostrarRegistro;
document.getElementById('mostrarLoginBtn').onclick = mostrarLogin;

document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      usuarioLogueado = data.usuario;
      mostrarContenido();
    } else {
      alert(data.error || 'Error al iniciar sesión');
    }
  });
};

document.getElementById('registroForm').onsubmit = function(e) {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));
  fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      alert('Registro exitoso, ahora puedes iniciar sesión');
      mostrarLogin();
    } else {
      alert(data.error || 'Error al registrar');
    }
  });
};

// Mostrar productos con botones de eliminar, editar y ver detalle
function mostrarProductos() {
  fetch('/productos')
    .then(res => res.json())
    .then(data => {
      document.getElementById('contenido').innerHTML = `
        <div class="container mt-4">
          <h2>Productos</h2>
          <div class="row">
            ${data.map(p => `
              <div class="col-md-4 mb-3">
                <div class="card">
                  <img src="${p.imagen && p.imagen.startsWith('http') ? p.imagen : 'https://via.placeholder.com/200'}" class="card-img-top" alt="${p.nombre}" style="height:200px;object-fit:cover;">
                  <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">Precio: S/. ${parseFloat(p.precio).toFixed(2)}</p>
                    <span class="badge bg-secondary">${p.categoria || 'Sin categoría'}</span>
                    ${usuarioLogueado ? `
                      <div class="mt-2">
                        <button class="btn btn-info btn-sm" onclick="verProducto(${p.id})">Ver</button>
                        <button class="btn btn-warning btn-sm ms-2" onclick="editarProducto(${p.id})">Editar</button>
                        <button class="btn btn-danger btn-sm ms-2" onclick="eliminarProducto(${p.id})">Eliminar</button>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
}

// Mostrar formulario para agregar producto con categorías registradas
function mostrarFormularioProducto() {
  if (!usuarioLogueado) return; // Solo usuarios logueados pueden agregar
  fetch('/categorias')
    .then(res => res.json())
    .then(categorias => {
      document.getElementById('contenido').innerHTML = `
        <div class="container mt-4">
          <h2>Agregar Producto</h2>
          <form id="formAgregarProducto">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" name="nombre" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Precio</label>
              <input type="number" name="precio" class="form-control" step="0.01" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <select name="categoria" class="form-control" required>
                ${categorias.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Imagen (URL)</label>
              <input type="url" name="imagen" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-success">Guardar</button>
            <button type="button" class="btn btn-secondary ms-2" onclick="mostrarProductos()">Cancelar</button>
          </form>
        </div>
      `;
      document.getElementById('formAgregarProducto').onsubmit = function(e) {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target));
        fetch('/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(() => mostrarProductos());
      };
    });
}

// Mostrar formulario para agregar categoría
function mostrarFormularioCategoria() {
  if (!usuarioLogueado) return; // Solo usuarios logueados pueden agregar
  document.getElementById('contenido').innerHTML = `
    <div class="container mt-4">
      <h2>Agregar Categoría</h2>
      <form id="formAgregarCategoria">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input type="text" name="nombre" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-secondary ms-2" onclick="mostrarCategorias()">Cancelar</button>
      </form>
    </div>
  `;
  document.getElementById('formAgregarCategoria').onsubmit = function(e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    fetch('/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(() => mostrarCategorias());
  };
}

// Eliminar producto
window.eliminarProducto = function(id) {
  if (!usuarioLogueado) return; // Solo usuarios logueados pueden eliminar
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    fetch(`/productos/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => mostrarProductos());
  }
};

// Ver producto detalladamente
window.verProducto = function(id) {
  fetch(`/productos/${id}`)
    .then(res => res.json())
    .then(p => {
      const imagenes = Array.isArray(p.imagenes) && p.imagenes.length > 0
        ? p.imagenes.filter(url => url && url.startsWith('http'))
        : ['https://via.placeholder.com/200'];
      document.getElementById('contenido').innerHTML = `
        <div class="container mt-4">
          <h2>Detalle del Producto</h2>
          <div class="card mb-3 d-flex flex-row align-items-center">
            <div class="d-flex flex-row align-items-center">
              ${imagenes.map(url => `
                <img src="${url}" class="card-img-top me-3" alt="${p.nombre}" style="height:200px;width:200px;object-fit:cover;">
              `).join('')}
            </div>
            <div class="card-body">
              <h5 class="card-title">${p.nombre}</h5>
              <p class="card-text">Precio: S/. ${parseFloat(p.precio).toFixed(2)}</p>
              <span class="badge bg-secondary">${p.categoria || 'Sin categoría'}</span>
              <div class="mt-3">
                <button class="btn btn-secondary btn-sm" onclick="mostrarProductos()">Regresar</button>
              </div>
            </div>
            ${usuarioLogueado ? `
              <div class="ms-3 d-flex flex-column align-items-center">
                <span style="font-size:2rem;cursor:pointer;" title="Agregar imagen" onclick="mostrarFormularioImagen(${id})">➕</span>
              </div>
            ` : ''}
          </div>
          <div id="formImagenContainer"></div>
        </div>
      `;
    });
};

// Formulario para agregar imagen por URL
window.mostrarFormularioImagen = function(productoId) {
  document.getElementById('formImagenContainer').innerHTML = `
    <form id="formAgregarImagen" class="mt-3">
      <div class="input-group">
        <input type="url" name="url" class="form-control" placeholder="URL de la imagen" required>
        <button type="submit" class="btn btn-success btn-sm">Agregar</button>
      </div>
    </form>
  `;
  document.getElementById('formAgregarImagen').onsubmit = function(e) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    fetch('/imagenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: productoId, url: datos.url })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById('formImagenContainer').innerHTML = '';
      verProducto(productoId);
    });
  };
};

// Editar producto
// Función para editar producto
window.editarProducto = function(id) {
  Promise.all([
    fetch(`/productos/${id}`).then(res => res.json()),
    fetch('/categorias').then(res => res.json())
  ])
  .then(([producto, categorias]) => {
    document.getElementById('contenido').innerHTML = `
      <div class="container mt-4">
        <h2>Editar Producto</h2>
        <form id="formEditarProducto">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" id="nombreProducto" name="nombre" 
                   class="form-control" value="${producto.nombre}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Precio</label>
            <input type="number" id="precioProducto" name="precio" 
                   class="form-control" value="${producto.precio}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Imagen (URL)</label>
            <input type="text" id="imagenProducto" name="imagen_url" 
                   class="form-control" value="${producto.imagen_url || ''}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Categoría</label>
            <select id="categoriaProducto" name="categoria_id" class="form-select" required>
              ${categorias.map(cat => `
                <option value="${cat.id}" ${cat.id === producto.categoria_id ? "selected" : ""}>
                  ${cat.nombre}
                </option>
              `).join("")}
            </select>
          </div>
          <button type="submit" class="btn btn-warning">Guardar cambios</button>
          <button type="button" class="btn btn-secondary ms-2" onclick="mostrarProductos()">Cancelar</button>
        </form>
      </div>
    `;

    // Evento submit
    document.getElementById('formEditarProducto').onsubmit = function(e) {
      e.preventDefault();

      const nombre = document.getElementById('nombreProducto').value.trim();
      const precio = parseFloat(document.getElementById('precioProducto').value);
      const imagen_url = document.getElementById('imagenProducto').value.trim();
      const categoria_id = document.getElementById('categoriaProducto').value;

      fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, precio, categoria_id, imagen_url })
      })
      .then(res => {
        if (!res.ok) throw new Error("Error al actualizar producto");
        return res.json();
      })
      .then(() => {
        alert("Producto actualizado con éxito ✅");
        mostrarProductos();
      })
      .catch(err => console.error("Error:", err));
    };
  })
  .catch(err => console.error("Error cargando datos:", err));
};

// Mostrar categorías
function mostrarCategorias() {
  fetch('/categorias')
    .then(res => res.json())
    .then(categorias => {
      let html = `
        <div class="container mt-4">
          <h2>Categorías</h2>
          <ul class="list-group">
      `;

      categorias.forEach(cat => {
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${cat.nombre}
            <div>
              <button class="btn btn-sm btn-warning me-2" onclick="editarCategoria(${cat.id})">
                ✏️
              </button>
              <button class="btn btn-sm btn-danger" onclick="eliminarCategoria(${cat.id})">
                🗑️
              </button>
            </div>
          </li>
        `;
      });

      html += `</ul></div>`;
      document.getElementById('contenido').innerHTML = html;
    });
}

// Editar categoría
window.editarCategoria = function(id) {
  fetch(`/categorias/${id}`)
    .then(res => res.json())
    .then(categoria => {
      document.getElementById('contenido').innerHTML = `
        <div class="container mt-4">
          <h2>Editar Categoría</h2>
          <form id="formEditarCategoria">
            <div class="mb-3">
              <label class="form-label">Nombre de la categoría</label>
              <input type="text" id="nombreCategoria" name="nombre" class="form-control" 
                     value="${categoria.nombre}" required>
            </div>
            <button type="submit" class="btn btn-warning">Guardar cambios</button>
            <button type="button" class="btn btn-secondary ms-2" onclick="mostrarCategorias()">Cancelar</button>
          </form>
        </div>
      `;

      // Evento para enviar actualización
      document.getElementById('formEditarCategoria').onsubmit = function(e) {
        e.preventDefault();

        const nuevoNombre = document.getElementById('nombreCategoria').value.trim();

        fetch(`/categorias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nuevoNombre })
        })
        .then(res => {
          if (!res.ok) throw new Error("Error al actualizar");
          return res.json();
        })
        .then(() => {
          alert("Categoría actualizada con éxito ✅");
          mostrarCategorias();
        })
        .catch(err => console.error("Error:", err));
      };
    });
};

window.eliminarCategoria = function(id) {
  if (!usuarioLogueado) return;
  if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
    fetch(`/categorias/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => mostrarCategorias());
  }
};

actualizarBarra();
mostrarProductos();
