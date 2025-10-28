const express = require('express')
const router = express.Router()
const { supabase } = require('../db') // conexión a Supabase
const bcrypt = require('bcryptjs')

// 📌 Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    // Verificar si ya existe el email
    const { data: existe, error: existeError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existeError) {
      console.error('Error buscando email:', existeError)
      return res.status(500).json({ error: 'Error al verificar email' })
    }

    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insertar usuario
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password: hashedPassword }])
      .select('id, nombre, email')
      .single()

    if (error) {
      console.error('Error insertando usuario:', error)
      return res.status(500).json({ error: 'Error al registrar usuario' })
    }

    res.json({ ok: true, usuario: data })
  } catch (err) {
    console.error('Error inesperado:', err)
    res.status(500).json({ error: 'Error inesperado al registrar usuario' })
  }
})


// 📌 Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos' })
  }

  try {
    // Buscar usuario por email
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code === 'PGRST116') {
      // PGRST116 → no se encontró registro
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }
    if (error) throw error

    // Verificar contraseña
    const valid = await bcrypt.compare(password, usuario.password)
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' })

    // Simple sesión (en producción deberías usar JWT)
    req.session = { usuarioId: usuario.id, nombre: usuario.nombre }

    res.json({
      ok: true,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

module.exports = router
