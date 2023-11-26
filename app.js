const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const Busboy = require("busboy");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Post Api for Uploading a file :
app.post("/upload", (req, res) => {
  const busboy = Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const bucketName = req.query.bucketName;
    const saveTo = path.join(__dirname, 'buckets', bucketName, filename.filename);

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
});

// Get Api for Retrieving a file :
app.get("/bucket/:bucketName/:objectName", (req, res) => {
  const { bucketName, objectName } = req.params;
  const filePath = path.join(__dirname, 'buckets', bucketName, objectName);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// Delete Api for Removing a file :
app.delete("/bucket/:bucketName/:objectName", (req, res) => {
  const { bucketName, objectName } = req.params;
  const filePath = path.join(__dirname, 'buckets', bucketName, objectName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.send(`File ${objectName} deleted from bucket ${bucketName}`);
  } else {
    res.status(404).send("File not found");
  }
});

// Get Api for Listing all the files in a bucket:
app.get("/bucket/:bucketName", (req, res) => {
  const { bucketName } = req.params;
  const bucketPath = path.join(__dirname, 'buckets', bucketName);
  if (fs.existsSync(bucketPath)) {
    const files = fs.readdirSync(bucketPath);
    res.json(files);
  } else {
    res.status(404).send("Bucket not found");
  }
});

// Get Api for Listing all the Buckets :
app.get("/buckets", (req, res) => {
  const uploadsPath = path.join(__dirname, 'buckets');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }
  const buckets = fs.readdirSync(uploadsPath);
  res.json(buckets);
});
