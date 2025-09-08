import { Public } from '@decorator/customize';
import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadService } from 'upload/upload.service';


@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }


  @ApiOperation({ summary: 'Upload file image' })
  @ApiResponse({ status: 200, description: 'Đăng ảnh thành công.' })
  @ApiBody({ type: 'multipart/form-data' })
  @Public()
  @Post('image')
  @UseInterceptors(FileInterceptor('file')) // <-- bắt buộc
  async uploadImage(@UploadedFile() file) {
    if (!file) throw new Error('File not found');
    const result = await this.uploadService.uploadImage(file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }


  @ApiOperation({ summary: 'Delete image' })
  @ApiResponse({ status: 202, description: 'Xóa ảnh thành công.' })
  @ApiBody({ type: 'multipart/form-data' })
  @Public()
  @Delete('image')
  async deleteImage(@Query('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('publicId is required');
    }

    const result = await this.uploadService.deleteImage(publicId);

    return {
      message: 'Đã xóa ảnh thành công',
      result,
    };
  }
}