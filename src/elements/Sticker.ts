import IStickerOptions from './interface/IStickerOptions';

import ElementTypes from '../enums/ElementTypes';

import Image from './Image';

class Sticker extends Image {

    public editable?: boolean;  //贴图样式是否可编辑

    public constructor(options: IStickerOptions) {
        super(options, ElementTypes.Sticker);
    }

    /**
     * 渲染图像XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
     public renderXML(parent: any) {
        const sticker = super.renderXML(parent);
        sticker.att('editable', this.editable);
        return sticker;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const sticker = super.renderOldXML(parent, resources, global);
        sticker.att('editable', this.editable);
        return sticker;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            editable: this.editable
        };
    }

    public static isInstance(value: any) {
        return value instanceof Sticker;
    }
}

export default Sticker;
