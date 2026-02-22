const express = require("express");
require("dotenv").config();

const connectDB = require("./config/config");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3000;

// conectar DB
connectDB();

// middleware
app.use(express.json());

// ruta base
app.get("/", (req, res) => {
  res.send("API de red social funcionando");
});

// rutas de posts
app.use("/posts", postRoutes);

// export para tests
module.exports = app;

// levantar server (excepto en test)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
