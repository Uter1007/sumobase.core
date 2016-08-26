import {PhotoValidationException} from '../../../../core/error/models/photo.validation.exception';

/* tslint:disable */
const sizeOf = require('image-size');
/* tslint:enable */

export class UserAvatarValidator {

    public static validateImage(file: Express.Multer.File) {
        if (!this.checkFileType(file)) {
            throw new PhotoValidationException('File Type was not correct');
        }

        if (!this.checkDimensions(file)) {
            throw new PhotoValidationException('File Dimension were not correct');
        }

        return true;
    }

    private static checkFileType(file: Express.Multer.File) {
        return (/^image\/(gif|jpe?g|png)$/i).test(file.mimetype);
    }

    private static checkDimensions(file: Express.Multer.File) {
        const dimensions = sizeOf(file.path);

        if (dimensions.width > 512) {
            throw new PhotoValidationException('Width is too large');
        }

        if (dimensions.height > 512) {
            throw new PhotoValidationException('Heightis too large');
        }

        return true;

    }
}
