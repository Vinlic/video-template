import ITextOptions from './interface/ITextOptions';
import ITextEffectOptions from './interface/ITextEffectOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class TextEffect {
    public type = ''; //动效类型
    public wordDuration?: number; //动效单字时长
    public wordInterval?: number; //动效单字间隔
    public duration?: number;  //动效总时长
    public direction?: string;  //动效方向

    public constructor(options: ITextEffectOptions) {
        util.optionsInject(
            this,
            options,
            {
                wordDuration: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
                wordInterval: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
                duration: (v: any) => !util.isUndefined(v) ? Number(v) : undefined
            },
            {
                type: (v: any) => util.isString(v),
                wordDuration: (v: any) => util.isUndefined(v) || util.isFinite(v),
                wordInterval: (v: any) => util.isUndefined(v) || util.isFinite(v),
                duration: (v: any) => util.isUndefined(v) || util.isFinite(v),
                direction: (v: any) => util.isUndefined(v) || util.isString(v)
            },
        );
    }

    public toOptions() {
        return {
            type: this.type,
            wordDuration: util.isFinite(this.wordDuration) ? util.millisecondsToSenconds(this.wordDuration as number) : undefined,
            wordInterval: util.isFinite(this.wordInterval) ? util.millisecondsToSenconds(this.wordInterval as number) : undefined,
            duration: util.isFinite(this.duration) ? util.millisecondsToSenconds(this.duration as number) : undefined,
            direction: this.direction
        };
    }

    /**
     * 是否为文本动效实例
     *
     * @param {Object} value
     * @returns
     */
    public static isInstance(value: any) {
        return value instanceof TextEffect;
    }
}

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
    public textEnterEffect?: TextEffect;  //文本入场动效
    public textExitEffect?: TextEffect;  //文本出场动效
    public effectType?: string; //文本动效类型
    public effectWordDuration?: number; //文本单字动效时长
    public effectWordInterval?: number; //文本单字间隔
    public styleType?: string;  //文本风格类型
    public isSubtitle = false;  //文本是否字幕
    public textShadow: any = {};  //文本阴影对象
    public textStroke: any = {};  //文本描边对象
    public textBackground: any = {};  //文本背景对象
    public textFillColor?: string;  //文本填充色
    public fillColorIntension?: number;  //文本填充色强度

    public constructor(options: ITextOptions, type = ElementTypes.Text, ...values: any[]) {
        super(options, type, ...values);
        util.optionsInject(this, options, {
            fontSize: (v: any) => Number(util.defaultTo(v, 32)),
            fontWeight: (v: any) => Number(util.defaultTo(v, 400)),
            fontColor: (v: any) => util.defaultTo(v, '#000'),
            lineHeight: (v: any) => Number(util.defaultTo(v, 1)),
            wordSpacing: (v: any) => Number(util.defaultTo(v, 0)),
            lineWrap: (v: any) => util.defaultTo(util.booleanParse(v), true),
            isSubtitle: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : v,
            textEnterEffect: (v: any) => (util.isUndefined(v) ? v : new TextEffect(v)),
            textExitEffect: (v: any) => (util.isUndefined(v) ? v : new TextEffect(v)),
            effectWordDuration: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            effectWordInterval: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            fillColorIntension: (v: any) => !util.isUndefined(v) ? Number(v) : undefined
        }, {
            fontFamily: (v: any) => util.isUndefined(v) || util.isString(v),
            fontSize: (v: any) => util.isFinite(v),
            fontWeight: (v: any) => util.isFinite(v),
            fontStyle: (v: any) => util.isUndefined(v) || util.isString(v),
            fontColor: (v: any) => util.isString(v),
            lineHeight: (v: any) => util.isFinite(v),
            wordSpacing: (v: any) => util.isFinite(v),
            textAlign: (v: any) => util.isUndefined(v) || util.isString(v),
            lineWrap: (v: any) => util.isBoolean(v),
            textEnterEffect: (v: any) => util.isUndefined(v) || TextEffect.isInstance(v),
            textExitEffect: (v: any) => util.isUndefined(v) || TextEffect.isInstance(v),
            effectType: (v: any) => util.isUndefined(v) || util.isString(v),
            effectWordDuration: (v: any) => util.isUndefined(v) || util.isFinite(v),
            effectWordInterval: (v: any) => util.isUndefined(v) || util.isFinite(v),
            isSubtitle: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            styleType: (v: any) => util.isUndefined(v) || util.isString(v),
            textShadow: (v: any) => util.isUndefined(v) || util.isObject(v),
            textStroke: (v: any) => util.isUndefined(v) || util.isObject(v),
            textBackground: (v: any) => util.isUndefined(v) || util.isObject(v),
            textFillColor: (v: any) => util.isUndefined(v) || util.isString(v),
            fillColorIntension: (v: any) => util.isUndefined(v) || util.isFinite(v)
        });
        if(this.effectType && !this.textEnterEffect) {  //兼容旧模板处理
            this.textEnterEffect = new TextEffect({
                type: this.effectType,
                wordDuration: this.effectWordDuration,
                wordInterval: this.effectWordInterval
            });
        }
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
        if(this.textEnterEffect) {
            text.att("textEnterEffect-type", this.textEnterEffect.type);
            text.att("textEnterEffect-wordDuration", this.textEnterEffect.wordDuration);
            text.att("textEnterEffect-wordInterval", this.textEnterEffect.wordInterval);
            text.att("textEnterEffect-duration", this.textEnterEffect.duration);
            text.att("textEnterEffect-direction", this.textEnterEffect.direction);
        }
        if(this.textExitEffect) {
            text.att("textExitEffect-type", this.textExitEffect.type);
            text.att("textExitEffect-wordDuration", this.textExitEffect.wordDuration);
            text.att("textExitEffect-wordInterval", this.textExitEffect.wordInterval);
            text.att("textExitEffect-duration", this.textExitEffect.duration);
            text.att("textExitEffect-direction", this.textExitEffect.direction);
        }
        text.att('isSubtitle', this.isSubtitle);
        text.att('styleType', this.styleType);
        for(let key in this.textShadow) {
            const value = this.textShadow[key];
            text.att(`textShadow-${key}`, value);
        }
        for(let key in this.textStroke) {
            const value = this.textStroke[key];
            text.att(`textStroke-${key}`, value);
        }
        for(let key in this.textBackground) {
            const value = this.textBackground[key];
            text.att(`textBackground-${key}`, value);
        }
        text.att('textFillColor', this.textFillColor);
        text.att('fillColorIntension', this.fillColorIntension);
        return text;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const caption = super.renderOldXML(parent, resources, global);
        caption.att('fontFamily', this.fontFamily);
        caption.att('fontSize', this.fontSize);
        this.fontWeight > 400 && caption.att('bold', this.fontWeight);
        this.fontStyle === 'italic' && caption.att('italic', true);
        caption.att('fontColor', this.fontColor);
        caption.att('lineHeight', (this.lineHeight || 1) * this.fontSize);
        caption.att('wordSpacing', this.wordSpacing);
        caption.att('textAlign', this.textAlign);
        caption.att('lineWrap', this.lineWrap);
        caption.att('effectType', this.effectType);
        caption.att('effectWordDuration', util.isFinite(this.effectWordDuration) ? util.millisecondsToSenconds(this.effectWordDuration!) : undefined);
        caption.att('effectWordInterval', util.isFinite(this.effectWordInterval) ? util.millisecondsToSenconds(this.effectWordInterval!) : undefined);
        caption.att('isSubtitle', this.isSubtitle);
        caption.att('styleType', this.styleType);
        for(let key in this.textShadow) {
            const value = this.textShadow[key];
            caption.att(`textShadow-${key}`, value);
        }
        for(let key in this.textStroke) {
            const value = this.textStroke[key];
            caption.att(`textStroke-${key}`, value);
        }
        for(let key in this.textBackground) {
            const value = this.textBackground[key];
            caption.att(`textBackground-${key}`, value);
        }
        caption.att('textFillColor', this.textFillColor);
        caption.att('fillColorIntension', this.fillColorIntension);
        const text = caption.ele('text');
        text.txt(this.value);
        return text;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            elementType: this.isSubtitle ? "subtitle" : this.type,
            content: this.value,
            fontSize: this.fontSize,
            fontColor: this.fontColor,
            textAlign: this.textAlign,
            fontFamily: this.fontFamily,
            lineHeight: (this.lineHeight || 1) * this.fontSize,
            wordSpacing: this.wordSpacing,
            bold: this.fontWeight > 400 ? this.fontWeight : undefined,
            italic: this.fontStyle === "italic" ? "italic" : "normal",
            isSubtitle: this.isSubtitle,
            textEnterEffect: this.textEnterEffect,
            textExitEffect: this.textExitEffect,
            styleType: this.styleType,
            textShadow: this.textShadow,
            textStroke: this.textStroke,
            textBackground: this.textBackground,
            textFillColor: this.textFillColor,
            fillColorIntension: this.fillColorIntension
        };
    }

    public rescale(scaleX: number, scaleY: number) {
        super.rescale(scaleX, scaleY);
        this.fontSize && (this.fontSize = parseFloat((this.fontSize * scaleX).toFixed(4)));
    }

    public static isInstance(value: any) {
        return value instanceof Text;
    }
}

export default Text;
