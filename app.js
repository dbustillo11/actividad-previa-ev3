
const express = require("express");
const mariadb = require("mariadb");


const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "registroconf",
  connectionLimit: 5,
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.send("<h1>Bienvenid@ al servidor</h1>");
});

app.get("/loginconf", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id, nombre, apellido, email, pais, ocupacion, motivo FROM loginconf"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // release to pool
  }
});


// Ruta para manejar la solicitud del formulario
app.post('/loginconf', async (req, res) => {
    console.log(req.body);
  const { nombre, apellido, email, pais, ocupacion, interes } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO loginconf (nombre, apellido, email, pais, ocupacion, interes) VALUES (?, ?, ?, ?, ?, ?)',
      [req.body.nombre, req.body.apellido, req.body.email, req.body.pais, req.body.ocupacion, req.body.interes]
    );

    console.log('Usuario registrado:', result.insertId);
    res.send('<p>Registro exitoso</p>');
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
