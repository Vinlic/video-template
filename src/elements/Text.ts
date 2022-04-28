import ITextOptions from './interface/ITextOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Text extends Element {
    public fontFamily?: string; //字体集名称
    public fontSize = 0; //字体大小
    public fontColor = ''; //字体颜色
    public fontWeight = 0; //字体粗细
    public fontStyle?: string; //字体风格
    public lineHeight = 0; //字体行高
    public wordSpacing = 0; //字间距
    public textAlign?: string; //文本对齐方式
    public lineWrap = false; //文本是否自动换行
    public effectType?: string; //文本动效类型
    public effectWordDuration?: number; //文本单字动效时长
    public effectWordInterval?: number; //文本单字间隔

    public constructor(options: ITextOptions) {
        super(options, ElementTypes.Text);
        util.optionsInject(
            this,
            options,
            {
                fontSize: (v: any) => Number(util.defaultTo(v, 32)),
                fontWeight: (v: any) => Number(util.defaultTo(v, 400)),
                fontColor: (v: any) => util.defaultTo(v, '#000'),
                lineHeight: (v: any) => Number(util.defaultTo(v, 1)),
                wordSpacing: (v: any) => Number(util.defaultTo(v, 0)),
                lineWrap: (v: any) => util.defaultTo(util.booleanParse(v), true),
                effectWordDuration: (v: any) => v && Number(v),
                effectWordInterval: (v: any) => v && Number(v),
            },
            {
                fontFamily: (v: any) => util.isUndefined(v) || util.isString(v),
                fontSize: (v: any) => util.isFinite(v),
                fontWeight: (v: any) => util.isFinite(v),
                fontStyle: (v: any) => util.isUndefined(v) || util.isString(v),
                fontColor: (v: any) => util.isString(v),
                lineHeight: (v: any) => util.isFinite(v),
                wordSpacing: (v: any) => util.isFinite(v),
                textAlign: (v: any) => util.isUndefined(v) || util.isString(v),
                lineWrap: (v: any) => util.isBoolean(v),
                effectType: (v: any) => util.isUndefined(v) || util.isString(v),
                effectWordDuration: (v: any) => util.isUndefined(v) || util.isFinite(v),
                effectWordInterval: (v: any) => util.isUndefined(v) || util.isFinite(v),
            },
        );
    }

    /**
     * 渲染文本XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const text = super.renderXML(parent);
        this.value && text.txt(this.value);
        text.att('fontFamily', this.fontFamily);
        text.att('fontSize', this.fontSize);
        text.att('fontWeight', this.fontWeight);
        text.att('fontStyle', this.fontStyle);
        text.att('fontColor', this.fontColor);
        text.att('lineHeight', this.lineHeight);
        text.att('wordSpacing', this.wordSpacing);
        text.att('textAlign', this.textAlign);
        text.att('lineWrap', this.lineWrap);
        text.att('effectType', this.effectType);
        text.att('effectWordDuration', this.effectWordDuration);
        text.att('effectWordInterval', this.effectWordInterval);
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const caption = super.renderOldXML(parent, resources, global);
        caption.att('fontFamily', this.fontFamily);
        caption.att('fontSize', this.fontSize);
        caption.att('bold', this.fontWeight > 400);
        caption.att('italic', this.fontStyle === 'italic');
        caption.att('fontColor', this.fontColor);
        caption.att('lineHeight', (this.lineHeight || 1) * this.fontSize);
        caption.att('wordSpacing', this.wordSpacing);
        caption.att('textAlign', this.textAlign);
        caption.att('lineWrap', this.lineWrap);
        caption.att('effectType', this.effectType);
        caption.att('effectWordDuration', this.effectWordDuration);
        caption.att('effectWordInterval', this.effectWordInterval);
        const text = caption.ele('text');
        text.txt(this.value);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            content: this.value,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            textAlign: this.textAlign,
            fontFamily: this.fontFamily,
            lineHeight: (this.lineHeight || 1) * this.fontSize,
            wordSpacing: this.wordSpacing,
            bold: this.fontWeight,
            italic: this.fontStyle === "italic" ? "italic" : undefined,
            effectType: this.effectType,
            effectWordDuration: util.isFinite(this.effectWordDuration) ? util.millisecondsToSenconds(this.effectWordDuration as number) : undefined,
            effectWordInterval: util.isFinite(this.effectWordInterval) ? util.millisecondsToSenconds(this.effectWordInterval as number) : undefined
        };
    }

    public static isInstance(value: any) {
        return value instanceof Text;
    }
}

export default Text;
