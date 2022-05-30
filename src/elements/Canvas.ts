import ICanvasOptions from './interface/ICanvasOptions';
import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Canvas extends Element {

    public chartId = ''; //图表唯一ID
    public configSrc = ''; //画布配置路径
    public dataSrc = ''; //画布数据路径
    public config = null;  //画布配置
    public data = null;  //画布数据
    public duration?: number; //画布播放时长
    public poster?: string;  //画布封面图

    public constructor(options: ICanvasOptions, type: ElementTypes = ElementTypes.Canvas, ...values: any[]) {
        super(options, type, ...values);
        util.optionsInject(this, options, {
            duration: (v: any) => !util.isUndefined(v) ? Number(v) : undefined
        }, {
            chartId: (v: any) => util.isString(v),
            configSrc: (v: any) => util.isString(v),
            dataSrc: (v: any) => util.isString(v),
            duration: (v: any) => util.isUndefined(v) || util.isNumber(v),
            poster: (v: any) => util.isUndefined(v) || util.isString(v)
        });
        if(/^base64\:/.test(this.configSrc))
            this.config = JSON.parse(util.decodeBASE64(this.configSrc.substring(7)));
        else if(/^json\:/.test(this.configSrc))
            this.config = JSON.parse(this.configSrc.substring(5));
        if(/^base64\:/.test(this.dataSrc))
            this.data = JSON.parse(util.decodeBASE64(this.dataSrc.substring(7)));
        else if(/^json\:/.test(this.dataSrc))
            this.data = JSON.parse(this.dataSrc.substring(5));
    }

    /**
     * 渲染画布XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const canvas = super.renderXML(parent);
        canvas.att('chartId', this.chartId);
        canvas.att('poster', this.poster);
        canvas.att('duration', this.duration);
        canvas.att('configSrc', this.config ? "base64:" + util.encodeBASE64(this.config) : this.configSrc);
        canvas.att('dataSrc', this.data ? "base64:" + util.encodeBASE64(this.data) : this.dataSrc);
        return canvas;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const canvas = super.renderOldXML(parent, resources, global);
        canvas.att('chartId', this.chartId);
        canvas.att('poster', this.poster);
        canvas.att('duration', this.duration ? util.millisecondsToSenconds(this.duration) : undefined);
        canvas.att('optionsPath', this.config ? "base64:" + util.encodeBASE64(this.config) : this.configSrc);
        canvas.att('dataPath', this.data ? "base64:" + util.encodeBASE64(this.data) : this.dataSrc);
        return canvas;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            chartId: this.chartId,
            poster: this.poster,
            duration: this.duration ? util.millisecondsToSenconds(this.duration) : undefined,
            optionPath: this.configSrc,
            dataPath: this.dataSrc,
            optionJson: this.config,
            dataJson: this.data
        };
    }

    public static isInstance(value: any) {
        return value instanceof Canvas;
    }
}

export default Canvas;
