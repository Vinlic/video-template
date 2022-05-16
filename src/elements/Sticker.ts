import IStickerOptions from './interface/IStickerOptions';

import ElementTypes from '../enums/ElementTypes';

import Image from './Image';

class Sticker extends Image {

    public constructor(options: IStickerOptions) {
        super(options, ElementTypes.Sticker);
    }

    public static isInstance(value: any) {
        return value instanceof Sticker;
    }
}

export default Sticker;
