import IImageOptions from './IImageOptions';

interface IStickerOptions extends IImageOptions {
    editable?: boolean | string;
}

export default IStickerOptions;
