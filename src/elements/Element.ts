import { create } from 'xmlbuilder2';

import IElementOptions from './interface/IElementOptions';
import IEffectOptions from './interface/IEffectOptions';

import ElementTypes from '../enums/ElementTypes';

import util from '../util';
import Compiler from '../Compiler';
import ElementFactory from '../ElementFactory';
import Template from '../Template';
import Scene from '../Scene';
import { Voice, Vtuber } from './';
import { Parser, OptionsParser } from '../parsers';

class Effect {
    public type = ''; //动效类
    public duration = 0; //动效动画时长
    public direction?: string;  //动效方向
    public path?: number[]; //路径点列表

    public constructor(options: IEffectOptions) {
        util.optionsInject(
            this,
            options,
            {
                duration: (v: any) => Number(v),
                path: (v: any) => (util.isString(v) ? v.split(',') : v),
            },
            {
                type: (v: any) => util.isString(v),
                duration: (v: any) => util.isFinite(v),
                direction: (v: any) => util.isUndefined(v) || util.isString(v),
                path: (v: any) => util.isUndefined(v) || util.isArray(v),
            },
        );
    }

    public toOptions(startTime: number = 0) {
        return {
            name: this.type,
            delay: util.millisecondsToSenconds(startTime),
            duration: util.millisecondsToSenconds(this.duration),
            direction: this.direction,
            path: this.path
        };
    }

    /**
     * 是否为动效实例
     *
     * @param {Object} value
     * @returns
     */
    public static isInstance(value: any) {
        return value instanceof Effect;
    }
}

class Element {
    public static Type = ElementTypes;

    public type: ElementTypes = ElementTypes.Element; //元素类型
    public id = ''; //元素ID
    public name?: string; //元素名称
    public x?: number; //元素X轴坐标值
    public y?: number; //元素Y轴坐标值
    public width?: number; //元素宽度
    public height?: number; //元素高度
    public zIndex?: number; //元素层级
    public rotate?: number; //元素旋转角度
    public opacity?: number; //元素不透明度（0-1）
    public scaleWidth?: number; //元素宽度缩放因子
    public scaleHeight?: number; //元素高度缩放因子
    public enterEffect?: Effect; //元素入场动效
    public exitEffect?: Effect; //元素退场动效
    public stayEffect?: Effect; //元素驻留动效
    public isBackground?: boolean;  //元素是否为背景
    public backgroundColor?: string; //元素背景颜色
    public startTime?: number; //元素入场时间点
    public endTime?: number; //元素退场时间点
    public strokeStyle?: string;  //元素边框样式
    public strokeColor?: string;  //元素边框颜色
    public strokeWidth?: number;  //元素边框宽度
    public fixedScale?: boolean;  //元素固定比例
    public trackId?: string; //元素轨道ID
    public value?: string; //元素值
    public children: Element[] = []; //元素子节点
    public absoluteStartTime?: number; //绝对开始时间
    public absoluteEndTime?: number; //绝对结束时间
    #parent?: Template | Scene | Element;  //父级指针

    public constructor(options: IElementOptions, type = ElementTypes.Element, data = {}, vars = {}) {
        if (!util.isObject(options)) throw new TypeError('options must be an Object');
        options.compile && (options = Compiler.compile(options, data, vars)); //如果模板属性包含compile则对模板进行编译处理
        util.optionsInject(this, options, {
            type: (v: any) => util.defaultTo(v, type),
            id: (v: any) => util.defaultTo(Element.isId(v) ? v : undefined, util.uniqid()),
            x: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            y: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            width: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            height: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            zIndex: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            rotate: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            opacity: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            scaleWidth: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            scaleHeight: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            strokeWidth: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            startTime: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            endTime: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            fixedScale: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            enterEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
            exitEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
            stayEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
            isBackground: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            children: (datas: IElementOptions[]) =>
                util.isArray(datas)
                    ? datas.map(options => {
                        const node = Element.isInstance(options) ? options as Element : ElementFactory.createElement(options, data, vars);
                        node.parent = this;
                        return node;
                    })
                    : [], //实例化子节点
        }, {
            type: (v: any) => util.isString(v),
            id: (v: any) => Element.isId(v),
            name: (v: any) => util.isUndefined(v) || util.isString(v),
            x: (v: any) => util.isUndefined(v) || util.isFinite(v),
            y: (v: any) => util.isUndefined(v) || util.isFinite(v),
            width: (v: any) => util.isUndefined(v) || util.isFinite(v),
            height: (v: any) => util.isUndefined(v) || util.isFinite(v),
            zIndex: (v: any) => util.isUndefined(v) || util.isFinite(v),
            rotate: (v: any) => util.isUndefined(v) || util.isFinite(v),
            opacity: (v: any) => util.isUndefined(v) || util.isFinite(v),
            scaleWidth: (v: any) => util.isUndefined(v) || util.isFinite(v),
            scaleHeight: (v: any) => util.isUndefined(v) || util.isFinite(v),
            enterEffect: (v: any) => util.isUndefined(v) || Effect.isInstance(v),
            exitEffect: (v: any) => util.isUndefined(v) || Effect.isInstance(v),
            stayEffect: (v: any) => util.isUndefined(v) || Effect.isInstance(v),
            strokeStyle: (v: any) => util.isUndefined(v) || util.isString(v),
            strokeColor: (v: any) => util.isUndefined(v) || util.isString(v),
            strokeWidth: (v: any) => util.isUndefined(v) || util.isFinite(v),
            isBackground: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            backgroundColor: (v: any) => util.isUndefined(v) || util.isString(v),
            startTime: (v: any) => util.isUndefined(v) || util.isFinite(v),
            endTime: (v: any) => util.isUndefined(v) || util.isFinite(v),
            fixedScale: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            trackId: (v: any) => util.isUndefined(v) || util.isString(v),
            value: (v: any) => util.isUndefined(v) || util.isString(v) || v === null,
            children: (v: any) => util.isArray(v),
        });
    }

    public getMaxDuration() {
        const maxDuration = Math.max(...this.children.map(node => (Voice.isInstance(node) || Vtuber.isInstance(node)) ? node.getMaxDuration() : 0));
        return Math.max(maxDuration, (this.endTime || 0) - (this.startTime || 0));
    }

    /**
     * 渲染元素XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     * @returns {XMLObject} 包含基本属性的XML对象
     */
    public renderXML(parent?: any) {
        const element = (parent || create()).ele(this.type, {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            zIndex: this.zIndex,
            rotate: this.rotate,
            opacity: this.opacity,
            scaleWidth: this.scaleWidth,
            scaleHeight: this.scaleHeight,
            'enterEffect-type': this.enterEffect?.type ?? undefined,
            'enterEffect-duration': this.enterEffect?.duration ?? undefined,
            'enterEffect-direction': this.enterEffect?.direction ?? undefined,
            'enterEffect-path': this.enterEffect?.path?.join(',') ?? undefined,
            'exitEffect-type': this.exitEffect?.type ?? undefined,
            'exitEffect-duration': this.exitEffect?.duration ?? undefined,
            'exitEffect-direction': this.exitEffect?.direction ?? undefined,
            'exitEffect-path': this.exitEffect?.path?.join(',') ?? undefined,
            'stayEffect-type': this.stayEffect?.type ?? undefined,
            'stayEffect-duration': this.stayEffect?.duration ?? undefined,
            'stayEffect-path': this.stayEffect?.path?.join(',') ?? undefined,
            strokeStyle: this.strokeStyle,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            isBackground: this.isBackground,
            backgroundColor: this.backgroundColor,
            startTime: this.startTime,
            endTime: this.endTime,
        });
        this.children?.forEach((node) => Element.isInstance(node) && node.renderXML(element));
        return element;
    }

    public renderOldXML(parent?: any, resources?: any, global?: any, skip?: boolean) {
        if(skip) {
            this.children?.forEach((node) => Element.isInstance(node) && node.renderOldXML(parent, resources, global));
            return parent;
        }
        const attributes = {
            id: this.id,
            name: this.name,
            scaleX: this.x,
            scaleY: this.y,
            width: this.width,
            height: this.height,
            index: this.zIndex,
            rotate: this.rotate,
            opacity: this.opacity,
            animationIn: this.enterEffect?.type ?? undefined,
            animationInDuration: this.enterEffect?.duration ? util.millisecondsToSenconds(this.enterEffect.duration) : undefined,
            animationOut: this.exitEffect?.type ?? undefined,
            animationOutDuration: this.exitEffect?.duration ? util.millisecondsToSenconds(this.exitEffect.duration) : undefined,
            strokeStyle: this.strokeStyle,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            inPoint: util.isNumber(this.startTime) ? util.millisecondsToSenconds(this.startTime) : undefined,
            outPoint: util.isNumber(this.endTime) ? util.millisecondsToSenconds(this.endTime) : undefined,
        };
        let element: any;
        if (global) {
            element = global.ele(
                {
                    [ElementTypes.Audio]: 'bgmusic',
                    [ElementTypes.Image]: 'bgimg',
                    [ElementTypes.Video]: 'bgvideo',
                }[this.type as string],
                attributes,
            );
        } else {
            element = (util.isFunction(parent) ? parent({
                [ElementTypes.Text]: 'captions',
                [ElementTypes.Image]: 'resources',
                [ElementTypes.Audio]: 'resources',
                [ElementTypes.Video]: 'resources',
                [ElementTypes.Voice]: 'textToSounds',
                [ElementTypes.Chart]: 'dynDataCharts',
                [ElementTypes.Canvas]: 'dynDataCharts',
                [ElementTypes.Vtuber]: 'vtubers',
            }[this.type as string]) : (parent || create()))
                .ele({
                    [ElementTypes.Text]: 'caption',
                    [ElementTypes.Image]: 'resource',
                    [ElementTypes.Audio]: 'resource',
                    [ElementTypes.Video]: 'resource',
                    [ElementTypes.Voice]: 'textToSound',
                    [ElementTypes.SSML]: 'ssml',
                    [ElementTypes.Chart]: 'dynDataChart',
                    [ElementTypes.Canvas]: 'dynDataChart',
                    [ElementTypes.Vtuber]: 'vtuber',
                }[this.type as string],
                    attributes);
        }
        this.children?.forEach((node) => Element.isInstance(node) && node.renderOldXML(element, resources, global));
        return element;
    }

    /**
     * 转换场景模型为XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
     public toXML(pretty = false) {
        const element = this.renderXML();
        return element.end({ prettyPrint: pretty, headless: true });
    }

    /**
     * 转换场景模型为过时的XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
    public toOldXML(pretty = false) {
        const element = this.renderOldXML();
        return element.end({ prettyPrint: pretty, headless: true });
    }

    /**
     * 通用解析入口
     *
     * @param {String} content
     * @returns {Template}
     */
     public static parse(content: any, data = {}, vars = {}) {
        if (!util.isString(content) && !util.isObject(content)) throw new TypeError('content must be an string or object');
        if (util.isBuffer(content)) content = content.toString();
        if (util.isObject(content)) return ElementFactory.createElement(content, data, vars);
        if (util.isString(content)) return Element.parseXML(content, data, vars);
        return Element.parseJSON(content, data, vars);
    }

    /**
     * 解析JSON数据为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseJSON = Parser.parseElementJSON.bind(Parser);

    /**
     * 解析XML文档为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseXML = Parser.parseElementXML.bind(Parser);

      /**
     * 解析前端options
     * 
     * @param {Object} options options对象
     * @returns {Template}
     */
    public static parseOptions = OptionsParser.parseElementOptions.bind(OptionsParser);

    /**
     * 转换为前端支持的options
     */
    public toOptions(): any {
        const children: any[] = [];
        this.children.forEach((node) => Element.isInstance(node) && children.push(node.toOptions()));
        return {
            elementType: this.type,
            id: this.id,
            type: {
                image: "img",
                video: "video",
                audio: "sound"
            }[this.type as string] || this.type,
            name: this.name,
            left: this.x,
            top: this.y,
            width: this.width,
            height: this.height,
            rotate: this.rotate,
            opacity: this.opacity,
            index: this.zIndex || 0,
            strokeStyle: this.strokeStyle,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            animationIn: util.isNumber(this.startTime) ? (this.enterEffect?.toOptions(this.startTime) || { name: "none", delay: util.millisecondsToSenconds(this.startTime) }) : undefined,
            animationOut: util.isNumber(this.endTime) ? (this.exitEffect?.toOptions(this.endTime) || { name: "none", delay: util.millisecondsToSenconds(this.endTime) }) : undefined,
            children,
            elements: children,
            fillColor: this.backgroundColor
        };
    }

    public update(value: any) {
        util.merge(this, value);
    }

    public static isId(value: any) {
        return util.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
    }

    public static isInstance(value: any) {
        return value instanceof Element;
    }

    public resize(width: number, height: number) {
        const scaleX = this.width ? width / this.width : 1;
        const scaleY = this.height ? height / this.height : 1;
        this.width && (this.width = width);
        this.height && (this.height = height);
        this.children.forEach(node => node.rescale(scaleX, scaleY));
    }

    public rescale(scaleX: number, scaleY: number) {
        this.x && (this.x = parseFloat((this.x * scaleX).toFixed(4)));
        this.y && (this.y = parseFloat((this.y * scaleY).toFixed(4)));
        this.width && (this.width = parseFloat((this.width * scaleX).toFixed(4)));
        this.height && (this.height = parseFloat((this.height * scaleY).toFixed(4)));
        this.children.forEach(node => node.rescale(scaleX, scaleY));
    }

    public resetEndTime(value: number) {
        this.endTime && (this.endTime += value);
        this.children.forEach(node => node.resetEndTime(value));
    }

    /**
     * 生成所有子元素的轨道
     *
     * @param {Number} baseTime 基准时间
     * @returns
     */
     public generateTimeline(baseTime = 0, duration: number) {
        let track: any = [];
        this.children?.forEach(node => {
            track.push({
                ...node,
                update: node.update.bind(node),
                absoluteStartTime: baseTime + (node.startTime || 0),
                absoluteEndTime: baseTime + (node.endTime || duration)
            });
            track = track.concat(node.generateTimeline(baseTime, duration));
        });
        return track?.sort((n1: any, n2: any) => (n1.absoluteStartTime as number) - (n2.absoluteStartTime as number)); // 根据绝对开始时间排序
    }

    public set parent(obj: Template | Scene | Element | undefined) {
        this.#parent = obj;
    }

    public get parent() {
        return this.#parent;
    }

}

export default Element;
