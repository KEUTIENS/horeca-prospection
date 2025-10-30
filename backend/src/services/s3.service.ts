import AWS from 'aws-sdk';
import { logger } from '../utils/logger';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-3'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'horeca-prospection-attachments';

export class S3Service {
  static async getPresignedUploadUrl(
    filename: string,
    contentType: string,
    expiresIn: number = 300
  ): Promise<{ url: string; key: string }> {
    try {
      const key = `uploads/${Date.now()}-${filename}`;
      
      const url = s3.getSignedUrl('putObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Expires: expiresIn
      });

      return { url, key };
    } catch (error) {
      logger.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  static async getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const url = s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: expiresIn
      });

      return url;
    } catch (error) {
      logger.error('Error generating download URL:', error);
      throw error;
    }
  }

  static async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string
  ): Promise<string> {
    try {
      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType
      }).promise();

      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw error;
    }
  }

  static async deleteFile(key: string): Promise<void> {
    try {
      await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: key
      }).promise();

      logger.info(`File deleted: ${key}`);
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw error;
    }
  }

  static async listFiles(prefix: string, maxKeys: number = 100): Promise<string[]> {
    try {
      const response = await s3.listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        MaxKeys: maxKeys
      }).promise();

      return response.Contents?.map(obj => obj.Key!) || [];
    } catch (error) {
      logger.error('Error listing files:', error);
      throw error;
    }
  }
}



