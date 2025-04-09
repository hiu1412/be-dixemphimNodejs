import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import env from '../common/env.js';

// Cấu hình AWS S3 Client
const s3 = new S3Client({
    region: env.S3_REGION,
    credentials: {
        accessKeyId: env.IAM_ACCESS_KEY,
        secretAccessKey: env.IAM_SECRET_KEY,
    },
});

// Hàm upload file lên S3
const uploadFileToS3 = async (file) => {
    try {
        // Tạo tên file duy nhất
        const fileName = `${uuidv4()}-${file.originalname}`;

        // Cấu hình thông tin file để upload
        const params = {
            Bucket: env.S3_BUCKET_NAME, // Tên bucket
            Key: `uploads/${fileName}`, // Tên file trong bucket
            Body: file.buffer, // Nội dung file
            ContentType: file.mimetype, // Loại file (image/jpeg, image/png, ...)
        };

        // Upload file lên S3
        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Trả về URL của file đã upload
        return `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        throw new Error(`Lỗi khi upload file lên S3: ${error.message}`);
    }
};

export { uploadFileToS3 };