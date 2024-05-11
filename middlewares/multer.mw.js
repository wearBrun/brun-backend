import multer from 'multer';

const storage = multer.diskStorage({});

const UploadFile = multer({ storage: storage });

export { UploadFile };