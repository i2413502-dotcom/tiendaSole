const express = require('express')
const router = express.Router()
const { supabase } = require('../db') // conexión a Supabase

// 📌 Obtener imágenes de un producto
router.get('/:producto_id', async (req, res) => {
  const { producto_id } = req.params
  try {
    const { data, error } = await supabase
      .from('imagenes_productos')
      .select('*')
      .eq('producto_id', producto_id)
      .order('id', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener imágenes' })
  }
})

// 📌 Agregar imagen
router.post('/', async (req, res) => {
  const { url, producto_id } = req.body
  if (!url || !producto_id) {
    return res.status(400).json({ error: 'Faltan datos: url y producto_id son requeridos' })
  }

  try {
    const { data, error } = await supabase
      .from('imagenes_productos')
      .insert([{ url, producto_id }])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al agregar imagen' })
  }
})

// 📌 Eliminar imagen
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('imagenes_productos')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar imagen' })
  }
})

module.exports = router
