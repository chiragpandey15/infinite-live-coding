const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, documentController.createDocument);
router.get('/', authMiddleware, documentController.getDocuments);
router.get('/:id/download', authMiddleware, documentController.downloadDocument);
router.put('/:id', authMiddleware, documentController.updateDocument);
router.get('/:id/versions', authMiddleware, documentController.getDocumentVersions);
router.get('/search', authMiddleware, documentController.searchDocuments);

module.exports = router;
