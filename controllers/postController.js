const connection = require('../config/db');
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const createPost = (req, res) => {
  const { title, detail,writer } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const query = 'INSERT INTO posts (title, detail, image, writer) VALUES (?, ?, ?, ?)';
  connection.query(query, [title, detail, imageUrl,writer], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, title, detail, image: imageUrl });
  });
};

const getPosts = (req, res) => {
  connection.query("SELECT * FROM posts", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error retrieving posts");
    }
    return res.status(200).json(results);
  });
};

const deletePost = (req, res) => {
  const postId = req.params.id;

  connection.query("DELETE FROM posts WHERE id = ?", [postId], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting post");
    }

    if (results.affectedRows === 0) {
      return res.status(404).send("Post not found");
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  });
};

const createConmment = (req, res) => {
    const postId = req.params.id;
    const { comment, writer } = req.body;

    const query = 'INSERT INTO comments (post_id, comment, writer) VALUES (?, ?, ?)';
    connection.query(query, [postId, comment, writer], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, postId, comment, writer });
    });
  };
  const getComment = (req, res) => {
    connection.query("SELECT * FROM comments", (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving posts");
      }
      return res.status(200).json(results);
    });
  };
  const getCommentById = (req, res) => {
    const postId = req.params.id; // Assuming the postId comes from the request parameters
    connection.query("SELECT * FROM comments WHERE post_id = ?", [postId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving comments");
      }
  
      if (results.length === 0) {
        return res.status(404).send("No comments found for this post");
      }
  
      return res.status(200).json(results); // Return the comments for the specified post
    });
};

  const getPostDetail = (req, res) => {
    const postId = req.params.id;
  
    connection.query("SELECT * FROM posts WHERE id = ?", [postId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error retrieving post");
      }
  
      if (results.length === 0) {
        return res.status(404).send("Post not found");
      }
  
      return res.status(200).json(results[0]); // Assuming you want to return just one post
    });
  };
  
module.exports = {
  createPost,
  getPosts,
  deletePost,
  createConmment,
  getComment,
  getPostDetail,
  getCommentById,
  upload
};
