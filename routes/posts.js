// #region variabili d'importazione
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts-controller.js');
// #endregion variabili d'importazione

// importazione index
router.get('/', postsController.index);

// importazione store C
router.post('/', postsController.store);

// importazione show R
router.get('/:slug', postsController.show);

// importazione update U
router.put('/:slug', postsController.update);

// importazione delete D
router.delete('/:slug', postsController.destroy);

// esportazione
module.exports = router;