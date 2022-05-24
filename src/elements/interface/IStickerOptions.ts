import IImageOptions from './IImageOptions';

interface IStickerOptions extends IImageOptions {
    editable?: boolean | string;
    distortable?: boolean | string;
}

export default IStickerOptions;
