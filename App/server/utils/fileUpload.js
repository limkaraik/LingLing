const multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.wav' || ext !== '.mp3') {
      return cb(res.status(400).end('only wav, mp3 are allowed'), false);
    }
    cb(null, true);
  },
});

var fileUpload = multer({ storage: storage }).array('files', 10);

module.exports = { fileUpload };