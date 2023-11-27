const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.get('/buckets', controller.listBuckets);
router.get('/bucket/:bucketName', controller.listObjects);
router.post('/upload', controller.postObject);
router.get('/bucket/:bucketName/:objectName', controller.getObject);
router.delete('/bucket/:bucketName/:objectName', controller.deleteObject);

module.exports = router;
