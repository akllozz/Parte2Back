const {
    leerPost,
    escribirPost,
    actualizarPost,
    eliminarPost,
    likePost,
  } = require("./consultas");

  const express = require("express"); 
  const cors = require("cors"); 
  const bodyParser = require("body-parser");
  const fs = require("fs");
  
  const app = express(); 
  app.use(bodyParser.json());
  app.use(cors()); 
  const port = 3000; 
  

  app.use(express.json());
  app.use(cors());
  

  app.listen(port, () => console.log("Servidor escuchando en puerto 3000"));
  

  app.get("/posts", async (req, res) => {
    try {
      const posts = await leerPost();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  
  app.post("/posts", async (req, res) => {
    const { titulo, img, descripcion } =
      req.body;
    try {
      await escribirPost(titulo, img, descripcion);
      res.status(201).json({ message: "Post creado" });
    } catch (error) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });
  

  app.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { titulo, url, descripcion } = req.body;
    try {
      const updatedPost = await actualizarPost(id, titulo, url, descripcion);
      res.json(updatedPost);
    } catch (error) {
      res
        .status(error.message === "Post no encontrado" ? 404 : 500)
        .json({ error: error.message });
    }
  });
  

  app.put("/posts/like/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const updatedPost = await likePost(id);
      res.json(updatedPost);
    } catch (error) {
      res
        .status(error.message === "Post no encontrado" ? 404 : 500)
        .json({ error: error.message });
    }
  });
  

  app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedPost = await eliminarPost(id);
      res.json({ message: "Post eliminado", post: deletedPost });
    } catch (error) {
      res
        .status(error.message === "Post no encontrado" ? 404 : 500)
        .json({ error: error.message });
    }
  });