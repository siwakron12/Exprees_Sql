const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/add', postController.upload.single('image'), postController.createPost);
router.get('/', postController.getPosts);
router.delete('/:id', postController.deletePost);
router.post('/add/comment/:id',postController.createConmment );
router.get('/comment', postController.getComment);
router.get("/PostDetail/:id",postController.getPostDetail);
router.get("/Comment/:id",postController.getCommentById);
module.exports = router;
