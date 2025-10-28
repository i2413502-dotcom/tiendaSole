const express = require('express')
const router = express.Router()
const { supabase } = require('../db') // tu db.js con la conexión a Supabase

// ✅ Obtener todos los productos con su categoría y una imagen
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id, nombre, precio,
        categoria:categoria_id (nombre),
        imagenes:imagenes_productos (url)
      `)
      .order('id', { ascending: false })

    if (error) throw error

    // Tomamos solo la primera imagen como "principal"
    const productos = data.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      categoria: p.categoria ? p.categoria.nombre : 'Sin categoría',
      imagen: p.imagenes.length > 0 ? p.imagenes[0].url : null
    }))

    res.json(productos)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
})

// ✅ Registrar un nuevo producto con categoría e imagen
router.post('/', async (req, res) => {
  const { nombre, precio, categoria, imagen } = req.body
  if (!nombre || !precio || !categoria || !imagen) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    // Buscar o crear categoría
    let { data: catRows, error: catError } = await supabase
      .from('categorias')
      .select('id')
      .eq('nombre', categoria)
      .maybeSingle()

    if (catError) throw catError

    let categoria_id
    if (!catRows) {
      const { data: newCat, error: newCatError } = await supabase
        .from('categorias')
        .insert([{ nombre: categoria }])
        .select('id')
        .single()
      if (newCatError) throw newCatError
      categoria_id = newCat.id
    } else {
      categoria_id = catRows.id
    }

    // Insertar producto
    const { data: prod, error: prodError } = await supabase
      .from('productos')
      .insert([{ nombre, precio, categoria_id }])
      .select('id')
      .single()
    if (prodError) throw prodError

    // Insertar imagen
    const { error: imgError } = await supabase
      .from('imagenes_productos')
      .insert([{ url: imagen, producto_id: prod.id }])
    if (imgError) throw imgError

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al registrar producto' })
  }
})

// ✅ Eliminar producto por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar producto' })
  }
})

// ✅ Editar producto por ID
// 📌 Editar producto
router.put('/:id', async (req, res) => {
  const { nombre, precio, categoria_id, imagen_url } = req.body;

  if (!nombre || !precio || !categoria_id || !imagen_url) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const { data, error } = await supabase
      .from('productos')
      .update({ nombre, precio, categoria_id, imagen_url })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar producto' });
  }
});


// ✅ Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { data: prod, error } = await supabase
      .from('productos')
      .select(`
        id, nombre, precio,
        categoria:categoria_id (nombre),
        imagenes:imagenes_productos (url)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' })

    res.json({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      categoria: prod.categoria ? prod.categoria.nombre : 'Sin categoría',
      imagenes: prod.imagenes.map(img => img.url)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener producto' })
  }
})

module.exports = router

