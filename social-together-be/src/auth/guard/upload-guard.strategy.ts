import { BadRequestException, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_DELETE_IMAGE } from '@decorator/customize';

@Injectable()
export class UploadAuthGuard {

    constructor(private reflector: Reflector) { }

    // Xem xét xem route có được đánh dấu là deleteImage hay không
    // Nếu có, thì xác thực user có quyền xóa ảnh hay không
    // Nếu không, thì bỏ qua guard này
    canActivate(context: ExecutionContext) {
        const isDeleteImage = this.reflector.getAllAndOverride<boolean>(IS_DELETE_IMAGE, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (!isDeleteImage) {
            return true; // Không phải route xóa ảnh, bỏ qua guard này
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.user?._id;

        const publicId = request.query.publicId; // từ @Query


        if (!publicId) {
            throw new BadRequestException('publicId is required');
        }

        // Kiểm tra xem userId có chứa publicId (ảnh) này không

        // Viết logic xóa ảnh sau. Chưa có cái để test
        // ....
        // ....

        return true;
    }

}
