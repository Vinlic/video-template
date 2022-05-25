import IImageOptions from './IImageOptions';

interface IStickerOptions extends IImageOptions {
    drawType?: string,
    editable?: boolean | string;
    distortable?: boolean | string;
}

export default IStickerOptions;
