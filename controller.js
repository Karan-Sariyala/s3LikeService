const fs = require("fs");
const path = require("path");
const Busboy = require("busboy");

const basePath = path.join(__dirname, "buckets");

const controller = {
 
  // Get api for listing buckets
  listBuckets: async (req, res) => {
    try {
      const uploadsPath = path.join(basePath);
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath);
      }
      const buckets = fs.readdirSync(uploadsPath);
      res.json(buckets);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Get api for listing files by bucket name
  listObjects: async (req, res) => {
    try {
      const { bucketName } = req.params;
      const bucketPath = path.join(basePath, bucketName);
      if (fs.existsSync(bucketPath)) {
        const files = fs.readdirSync(bucketPath);
        res.json(files);
      } else {
        res.status(404).send("Bucket not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Post api for uploading files to bucket
  postObject: async (req, res) => {
    const busboy = Busboy({ headers: req.headers });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const bucketName = req.query.bucketName;
      const saveTo = path.join(
        basePath,
        bucketName,
        filename.filename
      );
      //Check if folder exists if not create one
      if (!fs.existsSync(path.dirname(saveTo))) {
        fs.mkdirSync(path.dirname(saveTo), { recursive: true });
      }
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on("finish", () => {
      res.writeHead(200, { Connection: "close" });
      res.end("File uploaded successfully");
    });
    req.pipe(busboy);
  },

  // Get api for retrieving files by name
  getObject: async (req, res) => {
    try {
      const { bucketName, objectName } = req.params;
      const filePath = path.join(basePath, bucketName, objectName);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send("File not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  // Delete api for deleting files
  deleteObject: async (req, res) => {
    try {
      const { bucketName, objectName } = req.params;
      const filePath = path.join(basePath, bucketName, objectName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send(`File ${objectName} deleted from bucket ${bucketName}`);
      } else {
        res.status(404).send("File not found");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = controller;
