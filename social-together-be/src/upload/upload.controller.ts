import { UploadAuthGuard } from '@auth/guard/upload-guard.strategy';
import { DeleteImage, Public } from '@decorator/customize';
import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from 'upload/upload.service';


@Controller('upload')
@ApiTags('upload')
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
  @DeleteImage() // Guard xóa ảnh
  @UseGuards(UploadAuthGuard)
  async deleteImage(@Query('publicId') publicId: string) {
    const result = await this.uploadService.deleteImage(publicId);

    return {
      message: 'Đã xóa ảnh thành công',
      result,
    };
  }


  @ApiOperation({ summary: 'Upload file video' })
  @ApiResponse({ status: 200, description: 'Đăng video thành công.' })
  @ApiBody({ type: 'multipart/form-data' })
  @Public()
  @Post('video')
  @UseInterceptors(FileInterceptor('file')) // bắt buộc
  async uploadVideo(@UploadedFile() file) {
    if (!file) throw new Error('File not found');
    const result = await this.uploadService.uploadVideo(file);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  @ApiOperation({ summary: 'Delete video' })
  @ApiResponse({ status: 202, description: 'Xóa video thành công.' })
  @ApiBody({ type: 'multipart/form-data' })
  @Public()
  @Delete('video')
  @DeleteImage() // Guard xóa video
  @UseGuards(UploadAuthGuard)
  async deleteVideo(@Query('publicId') publicId: string) {
    const result = await this.uploadService.deleteVideo(publicId);

    return {
      message: 'Đã xóa video thành công',
      result,
    };
  }

}