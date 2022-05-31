import ITemplateOptions from './interface/ITemplateOptions';

import util from './util';
import Scene from './Scene';
import Element from './elements/Element';
import ElementFactory from './ElementFactory';
import { Parser, OldParser, OptionsParser } from './parsers';
import Compiler from './Compiler';

class Template {
    public static readonly type = 'template'; // type标识
    public type = ''; // 模板type必须为template
    public id = ''; // 模板ID
    public mode = ''; //模板执行模式
    public version = ''; //模板版本
    public name?: string; //模板名称
    public poster?: string; //模板封面图
    public actuator?: string; //执行器
    public width = 0; //视频宽度
    public height = 0; //视频高度
    public aspectRatio = ''; //视频比例
    public fps = 0; //视频帧率
    public crf?: number; //视频码率影响因子
    public videoCodec?: string; //视频编码器
    public videoBitrate?: string; //视频码率
    public pixelFormat?: string; //视频像素格式
    public frameQuality?: number; //视频帧图质量
    public format?: string; //视频输出格式
    public volume = 0; //音频音量
    public audioCodec?: string; //音频编码器
    public sampleRate?: string; //音频采样率
    public audioBitrate?: string; //音频码率
    public backgroundColor?: string; //主背景颜色
    public captureTime?: number;  //封面捕获时间点
    public createTime = 0; //模板创建时间
    public updateTime = 0; //模板最后更新时间
    public buildBy = ''; //模板从何处构建
    public children: (Scene | Element)[] = []; //模板子节点

    public constructor(options: ITemplateOptions, data = {}, vars = {}) {
        options.compile && (options = Compiler.compile(options, data, vars)); //如果模板属性包含compile则对模板进行编译处理
        util.optionsInject(
            this,
            options,
            {
                type: () => 'template',
                id: (v: any) => util.defaultTo(Template.isId(v) ? v : undefined, util.uuid(false)),
                mode: (v: any) => util.defaultTo(v, 'scene'),
                version: (v: any) => util.defaultTo(v, '2.0.0'),
                width: (v: any) => Number(v),
                height: (v: any) => Number(v),
                fps: (v: any) => Number(util.defaultTo(v, 60)),
                crf: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
                volume: (v: any) => Number(util.defaultTo(v, 1)),
                frameQuality: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
                captureTime: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
                createTime: (v: any) => Number(util.defaultTo(v, util.unixTimestamp())),
                updateTime: (v: any) => Number(util.defaultTo(v, util.unixTimestamp())),
                buildBy: (v: any) => util.defaultTo(v, 'system'),
                children: (datas: any) =>
                    util.isArray(datas)
                        ? datas.map((data) => {
                            if (Scene.isInstance(data) || Element.isInstance(data)) return data; //如果是已实例化对象则直接使用
                            if (data.type === 'scene') return new Scene(data); //场景对象实例化
                            else return ElementFactory.createElement(data); //元素对象实例化
                        })
                        : [], //实例化模板子节点
            },
            {
                type: (v: any) => v === 'template',
                id: (v: any) => Template.isId(v),
                mode: (v: any) => util.isString(v),
                version: (v: any) => util.isString(v),
                name: (v: any) => util.isUndefined(v) || util.isString(v),
                poster: (v: any) => util.isUndefined(v) || util.isString(v),
                actuator: (v: any) => util.isUndefined(v) || util.isString(v),
                width: (v: any) => util.isFinite(v),
                height: (v: any) => util.isFinite(v),
                aspectRatio: (v: any) => util.isString(v),
                fps: (v: any) => util.isFinite(v),
                crf: (v: any) => util.isUndefined(v) || util.isFinite(v),
                volume: (v: any) => util.isFinite(v),
                videoCodec: (v: any) => util.isUndefined(v) || util.isString(v),
                videoBitrate: (v: any) => util.isUndefined(v) || util.isString(v),
                pixelFormat: (v: any) => util.isUndefined(v) || util.isString(v),
                frameQuality: (v: any) => util.isUndefined(v) || util.isFinite(v),
                backgroundColor: (v: any) => util.isUndefined(v) || util.isString(v),
                format: (v: any) => util.isUndefined(v) || util.isString(v),
                audioCodec: (v: any) => util.isUndefined(v) || util.isString(v),
                sampleRate: (v: any) => util.isUndefined(v) || util.isString(v),
                audioBitrate: (v: any) => util.isUndefined(v) || util.isString(v),
                captureTime: (v: any) => util.isUndefined(v) || util.isFinite(v),
                createTime: (v: any) => util.isUnixTimestamp(v),
                updateTime: (v: any) => util.isUnixTimestamp(v),
                buildBy: (v: any) => util.isString(v),
                children: (v: any) => util.isArray(v),
            },
        );
    }

    public scenesSplice(start: number, end: number) {
        let index = 0;
        this.children = this.children.filter((node) => {
            if (Scene.isInstance(node)) return true;
            if (index < start) {
                index++;
                return false;
            }
            if (index >= end) return false;
            index++;
            return true;
        });
    }

    public appendChild(node: any) {
        if (!Scene.isInstance(node) && !Element.isInstance(node))
            throw new TypeError('node must be an Scene instance or Element instance');
        this.children.push(node);
    }

    /**
     * 转换为BASE64字符串
     * 
     * @returns {String} BASE64
     */
    toBASE64() { return this.toBuffer().toString("base64") }

    /**
     * 转换为旧BASE64字符串
     * 
     * @returns {String} BASE64
     */
    toOldBASE64() { return this.toOldBuffer().toString("base64") }

    /**
     * 转换为缓冲区
     * 
     * @returns {Buffer} 缓冲区
     */
    toBuffer() { return Parser.toBuffer(this) }

    /**
     * 转换为旧缓冲区
     * 
     * @returns {Buffer} 缓冲区
     */
    toOldBuffer() { return OldParser.toBuffer(this) }

    /**
     * 转换模板模型为JSON文档
     *
     * 请直接使用 JSON.stringify(template);
     */

    /**
     * 转换模板模型为XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
    public toXML(pretty = false) { return Parser.toXML(this, pretty) }

    /**
     * 转换模板模型为过时的XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
    public toOldXML(pretty = false) { return OldParser.toXML(this, pretty) }

    /**
     * 转换为前端支持的options
     */
    public toOptions() { return OptionsParser.toOptions(this) }

    /**
     * 是否为模板ID
     *
     * @param {String} value
     * @returns {Boolean}
     */
    public static isId(value: any) {
        return util.isString(value) && /^[a-zA-Z0-9]{32}$/.test(value);
    }

    /**
     * 是否为模板实例
     *
     * @param {Object} value
     * @returns {Boolean}
     */
    public static isInstance(value: any) {
        return value instanceof Template;
    }

    /**
     * 通用解析入口
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parse(content: any, data?: object, vars?: object) {
        if (!util.isString(content) && !util.isObject(content)) throw new TypeError('content must be an string or object');
        if (util.isBuffer(content)) content = content.toString();
        if (util.isObject(content)) return new Template(content);
        if (/\<template/.test(content)) return Template.parseXML(content, data, vars);
        else if (/\<project/.test(content)) return Template.parseOldXML(content, data, vars);
        else return Template.parseJSON(content, data, vars);
    }

    /**
     * 解析入口同时处理数据
     *
     * @param {String} content
     * @returns {Template}
     */
     public static async parseAndProcessing(content: any, data?: object, vars?: object, dataProcessor?: any, varsProcessor?: any) {
        if (!util.isString(content) && !util.isObject(content)) throw new TypeError('content must be an string or object');
        if (util.isBuffer(content)) content = content.toString();
        if (util.isObject(content)) return new Template(content);
        if (/\<template/.test(content)) return await Template.parseXMLPreprocessing(content, data, vars, dataProcessor, varsProcessor);
        else if (/\<project/.test(content)) return Template.parseOldXML(content, data, vars);
        else return await Template.parseJSONPreprocessing(content, data, vars, dataProcessor, varsProcessor);
    }

    /**
     * 解析JSON数据为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseJSON = Parser.parseJSON.bind(Parser);

    /**
     * 解析JSON数据为模型
     *
     * @param {String} content
     * @returns {Template}
     */
     public static parseJSONPreprocessing = Parser.parseJSONPreprocessing.bind(Parser);

    /**
     * 解析XML文档为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseXML = Parser.parseXML.bind(Parser);

    /**
     * 解析XML文档为模型并预处理
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseXMLPreprocessing = Parser.parseXMLPreprocessing.bind(Parser);

    /**
     * 解析过时的XML文档为模型
     *
     * @param {String} content
     * @param {Object} data 数据对象
     * @param {Object} vars 变量对象
     * @returns {Template}
     */
    public static parseOldXML = OldParser.parseXML.bind(OldParser);

    /**
     * 解析前端options
     * 
     * @param {Object} options options对象
     * @returns {Template}
     */
    public static parseOptions = OptionsParser.parseOptions.bind(OptionsParser);

    /**
     * 生成所有子元素的轨道
     *
     * @param {Number} baseTime 基准时间
     * @returns
     */
    public generateAllTrack() {
        let track: any = [];
        let baseTime = 0;
        const duration = this.duration;
        this.children.forEach((node: any) => {
            if (Scene.isInstance(node)) {
                track = track.concat(node.generateAllTrack(baseTime));
                baseTime += node.duration;
            } else {
                node.setParentSection(0, duration);
                track.push(node);
            }
        });
        return track;
    }

    /**
     * 克隆模板对象
     */
    public clone(): Template {
        return Template.parseJSON(JSON.stringify(this));
    }

    /**
     * 获取模板总时长
     */
    public get duration() {
        return this.children.reduce((duration: number, node: any) => (Scene.isInstance(node) ? duration + node.duration : duration), 0);
    }

    /**
     * 获取已排序的子节点
     */
    public get sortedChilren() {
        const elements = this.elements;
        elements.sort((a, b) => {
            if (Scene.isInstance(a)) return -1;
            return ((a as Element).zIndex || 0) - ((b as Element).zIndex || 0);
        });
        return [
            ...this.scenes.map(scene => scene.sortedChildren),
            ...this.elements
        ];
    }

    /**
     * 获取模板引用的所有字体集
     */
    public get fontFamilys() {
        let fontFamilys: string[] = [];
        this.children.forEach((node: any) => {
            if (Scene.isInstance(node)) fontFamilys = fontFamilys.concat(node.fontFamilys);
            else if (node.fontFamily) fontFamilys.push(node.fontFamily);
        });
        return Array.from(new Set(fontFamilys));
    }

    /**
     * 获取模板所有场景
     */
    public get scenes() {
        return this.children.filter(node => Scene.isInstance(node)) as Scene[];
    }

    /**
     * 获取模板所有元素
     */
    public get elements() {
        return this.children.filter(node => Element.isInstance(node)) as Element[];
    }
}

export default Template;
