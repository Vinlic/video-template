import ICanvasOptions from './interface/ICanvasOptions';
import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Canvas extends Element {
    public configSrc = ''; //画布配置路径
    public dataSrc = ''; //画布数据路径

    public constructor(options: ICanvasOptions, type: ElementTypes = ElementTypes.Canvas) {
        super(options, type);
        util.optionsInject(
            this,
            options,
            {},
            {
                configSrc: (v: any) => util.isString(v),
                dataSrc: (v: any) => util.isString(v),
            },
        );
    }

    /**
     * 渲染画布XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const canvas = super.renderXML(parent);
        canvas.att('configSrc', this.configSrc);
        canvas.att('dataSrc', this.dataSrc);
        return canvas;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const canvas = super.renderOldXML(parent, resources, global);
        canvas.att('optionsPath', this.configSrc);
        canvas.att('dataPath', this.dataSrc);
        return canvas;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            optionsPath: this.configSrc,
            dataPath: this.dataSrc
        };
    }

    public static isInstance(value: any) {
        return value instanceof Canvas;
    }
}

export default Canvas;
