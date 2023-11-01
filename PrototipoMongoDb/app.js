const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 3000; 

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/prototipo', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

mongoose.connection.once('open', () => {
  console.log('Conexión a MongoDB establecida con éxito');
});

const EmpleadoSchema = new mongoose.Schema({
    usuario: String,
    contrasena: String,
    nombre: String
  }, { collection: 'empleado' }); 
  
const Empleado = mongoose.model('Empleado', EmpleadoSchema);

const productoSchema = new mongoose.Schema({
  numeroProducto: String,
  nombre: String,
  cantidad: String
}, { collection: 'producto' }); 

const Producto = mongoose.model('Producto', productoSchema);

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

app.post('/procesar_registroDocumento', async (req, res) => {
  try {
    //mongodb
    const nuevoProducto = new Producto({
      numeroProducto: req.body.numeroProducto,
      nombre: req.body.nombre,
      cantidad: req.body.cantidad,

    });
    await nuevoProducto.save();

    
    const mensaje = "El Producto se ha ingresado correctamente.";

      res.send(
        `<script>
          alert("${mensaje}");
          window.location.href = '/lobby.html';
        </script>`
      );
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Error al registrar el usuario');
  }
});

app.get('/obtenerProductos', async (req, res) => {
  try {
    const productos = await Producto.find({}, 'nombre'); 
    res.json(productos);

  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${port}`);
});