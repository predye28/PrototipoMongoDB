const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 3000; 

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos POST
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/prototipo', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

mongoose.connection.once('open', () => {
  console.log('Conexión a MongoDB establecida con éxito');
});

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    contrasena: String,
    nombre: String
  }, { collection: 'empleado' }); 
  
const Empleado = mongoose.model('Empleado', usuarioSchema);

app.post('/procesar_registro', async (req, res) => {
    try {
      //mongodb
      const nuevoEmpleado = new Empleado({
        usuario: req.body.usuario,
        contrasena: req.body.contrasena,
        nombre: req.body.nombre,
      });
      await nuevoEmpleado.save();
  
      res.redirect('/registro.html?registroExitoso=true');
  
    } catch (error) {
      console.error('Error al registrar el usuario en mongodb:', error);
      res.status(500).send('Error al registrar el usuario');
    }
});

app.post('/procesar_login', async (req, res) => {
    try {
      
      const { usuario, contrasena } = req.body;
  
      const EmpleadoEncontrado = await Empleado.findOne({ usuario, contrasena });
  
      if (EmpleadoEncontrado) {
  
        res.redirect('/lobby.html');
      } else {
        
        res.redirect('/index.html?loginError=true');
      }
    } catch (error) {
      console.error('Error al procesar el inicio de sesión:', error);
      res.status(500).send('Error al procesar el inicio de sesión');
    }
  });

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});