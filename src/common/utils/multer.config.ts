// src/common/utils/multer.config.ts
import { MulterModuleAsyncOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

interface MulterImageOptions {
  maxSize: number;
  allowedMimeTypes: string[];
}

export const multerConfigFactory = (
  folderName: string,
  options: MulterImageOptions,
): MulterModuleAsyncOptions => ({
  useFactory: async () => {
    // ใช้ UPLOAD_DEST จาก env หรือใช้ default เป็น ./uploads
    const uploadRoot = process.env.UPLOAD_DEST || './uploads';
    const uploadPath = path.join(uploadRoot, folderName);

    // ถ้าไม่มีโฟลเดอร์ ให้สร้างใหม่
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    return {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadPath),
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          // ตั้งชื่อไฟล์ใหม่เป็น UUID
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      limits: { fileSize: options.maxSize },
      fileFilter: (_req, file, cb) => {
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }
        cb(null, true);
      },
    };
  },
});