const Router = require("express");
const router = new Router();
const fileController = require('../controller/file.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.post('/upload', authMiddleware(), fileController.uploadFile);
router.get('/list', authMiddleware(), fileController.listFiles);
router.delete('/delete/:id', authMiddleware(), fileController.deleteFile);
router.get('/:id', authMiddleware(), fileController.getFileDetails);
router.get('/download/:id', authMiddleware(), fileController.downloadFile);
router.put('/update/:id', authMiddleware(), fileController.updateFile);

module.exports = router;