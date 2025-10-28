const API_URL = "http://localhost:3000";

// Cargar categorías en el select
async function cargarCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  const categorias = await res.json();

  const select = document.getElementById("categoria_id");
  select.innerHTML = ""; // limpiar opciones previas

  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.nombre;
    select.appendChild(option);
  });
}

// Manejo del formulario
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevoProducto = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    categoria_id: document.getElementById("categoria_id").value,
    imagen: document.getElementById("imagen").value
  };

  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto)
  });

  const data = await res.json();
  alert("✅ Producto agregado con éxito: " + data.nombre);

  e.target.reset();
});

// Inicializar
cargarCategorias();
