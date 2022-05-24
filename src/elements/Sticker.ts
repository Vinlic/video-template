import IStickerOptions from './interface/IStickerOptions';

import ElementTypes from '../enums/ElementTypes';

import Image from './Image';
import util from '../util';

class Sticker extends Image {

    public editable?: boolean;  //贴图样式是否可编辑
    public distortable?: boolean;  //贴图是否可变形

    public constructor(options: IStickerOptions) {
        super(options, ElementTypes.Sticker);
        util.optionsInject(this, options, {
            editable: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            distortable: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
        }, {
            editable: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            distortable: (v: any) => util.isUndefined(v) || util.isBoolean(v),
        });
    }

    /**
     * 渲染图像XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
     public renderXML(parent: any) {
        const sticker = super.renderXML(parent);
        sticker.att('editable', this.editable);
        sticker.att('distortable', this.distortable);
        return sticker;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const sticker = super.renderOldXML(parent, resources, global);
        sticker.att('editable', this.editable);
        sticker.att('distortable', this.distortable);
        return sticker;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            editable: this.editable,
            distortable: this.distortable
        };
    }

    public static isInstance(value: any) {
        return value instanceof Sticker;
    }
}

export default Sticker;
