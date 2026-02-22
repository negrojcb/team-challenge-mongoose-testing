const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Middleware para obtener post por ID
async function getPost(req, res, next) {
  let post;

  try {
    post = await Post.findById(req.params._id);
    if (post == null) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

// POST /create -> crear publicación
router.post("/create", async (req, res) => {
  try {
    const { title, body } = req.body;

    // validación simple
    if (!title || !body) {
      return res.status(400).json({ message: "title y body son obligatorios" });
    }

    const post = new Post({ title, body });
    const newPost = await post.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET / -> traer todas las publicaciones
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /id/:_id -> buscar por id
router.get("/id/:_id", getPost, (req, res) => {
  res.json(res.post);
});

// GET /title/:title -> buscar por título
router.get("/title/:title", async (req, res) => {
  try {
    const posts = await Post.find({ title: req.params.title });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /id/:_id -> actualizar publicación
router.put("/id/:_id", getPost, async (req, res) => {
  if (req.body.title != null) {
    res.post.title = req.body.title;
  }

  if (req.body.body != null) {
    res.post.body = req.body.body;
  }

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /id/:_id -> eliminar publicación
router.delete("/id/:_id", getPost, async (req, res) => {
  try {
    await res.post.deleteOne();
    res.json({ message: "Post eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EXTRA: paginación de 10 en 10
// GET /postsWithPagination?page=1
router.get("/postsWithPagination", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
