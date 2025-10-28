const express = require('express')
const router = express.Router()
const { supabase } = require('../db') // conexión a Supabase

// 📌 Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
})

// 📌 Crear categoría
router.post('/', async (req, res) => {
  const { nombre } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

  try {
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nombre }])
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear categoría' })
  }
})

// 📌 Eliminar categoría
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al eliminar categoría' })
  }
})

// 📌 Editar categoría
// 📌 Editar categoría
router.put('/:id', async (req, res) => {
  const { nombre } = req.body
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

  try {
    const { data, error } = await supabase
      .from('categorias')
      .update({ nombre })
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al editar categoría' })
  }
})

// 📌 Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
})

module.exports = router

