import * as multer from 'multer';

export const multerDiskUploader = (
  destination: string,
): multer.StorageEngine => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname.replace(/ /g, ''));
    },
  });
  return storage;
};

export const memoryUploader = (): multer.StorageEngine => {
  return multer.memoryStorage();
};
