import { create } from 'xmlbuilder2';

import ISceneOptions from './interface/ISceneOptions';
import ITransitionOptions from './interface/ITransitionOptions';
import IFilterOptions from './elements/interface/IFilterOptions';

import Compiler from './Compiler';
import ElementFactory from './ElementFactory';
import { Parser, OptionsParser } from './parsers';
import Template from './Template';
import { Element, Text } from './elements';
import util from './util';

class Transition {
    public type = ''; // 转场类型
    public duration = 0; // 转场时长

    public constructor(options: ITransitionOptions) {
        util.optionsInject(
            this,
            options,
            {
                duration: (v: any) => Number(util.defaultTo(v, 0)),
            },
            {
                type: (v: any) => util.isString(v),
                duration: (v: any) => util.isFinite(v),
            },
        );
    }

    /**
     * 场景转场属性设置
     *
     * @param {XMLObject} scene 场景XML对象
     */
    public renderXML(scene: any) {
        scene.att('transition-type', this.type);
        scene.att('transition-duration', this.duration);
    }

    public renderOldXML(scene: any) {
        scene.ele('transition', {
            name: this.type,
            duration: (this.duration as number) / 1000,
        });
    }

    /**
     * 是否为转场实例
     *
     * @param {Object} value
     * @returns
     */
    public static isInstance(value: any) {
        return value instanceof Transition;
    }
}

class Scene {
    public static readonly type = 'scene'; // type标识
    public type = ''; // 场景type必须为scene
    public id = ''; // 场景ID
    public name?: string; // 场景名称
    public poster?: string; // 场景封面图
    public width = 0; // 场景宽度
    public height = 0; // 场景高度
    public aspectRatio = '';  //场景比例
    public duration = 0; // 场景总时长
    public backgroundColor?: string; // 场景背景颜色
    public transition?: Transition; // 场景转场效果
    public filter?: IFilterOptions; // 场景滤镜
    public parent?: Template;  //父级指针
    public children: Element[] = []; // 场景子节点

    public constructor(options: ISceneOptions, data = {}, vars = {}) {
        if (!util.isObject(options)) throw new TypeError('options must be an Object');
        options.compile && (options = Compiler.compile(options, data, vars)); //如果模板属性包含compile则对模板进行编译处理
        util.optionsInject(
            this,
            options,
            {
                type: () => 'scene',
                id: (v: any) => util.defaultTo(Scene.isId(v) ? v : undefined, util.uniqid()),
                width: (v: any) => Number(v),
                height: (v: any) => Number(v),
                duration: (v: any) => Number(v),
                transition: (v: any) => v && new Transition(v),
                children: (datas: any) =>
                    util.isArray(datas)
                        ? datas.map((data) => {
                            const node = Element.isInstance(data) ? data as Element : ElementFactory.createElement(data);
                            node.parent = this;
                            return node;
                        })
                        : [], // 实例化场景子节点
            },
            {
                type: (v: any) => v === 'scene',
                id: (v: any) => Scene.isId(v),
                name: (v: any) => util.isUndefined(v) || util.isString(v),
                poster: (v: any) => util.isUndefined(v) || util.isString(v),
                width: (v: any) => util.isFinite(v),
                height: (v: any) => util.isFinite(v),
                aspectRatio: (v: any) => util.isString(v),
                duration: (v: any) => util.isFinite(v),
                backgroundColor: (v: any) => util.isUndefined(v) || util.isString(v),
                transition: (v: any) => util.isUndefined(v) || Transition.isInstance(v),
                filter: (v: any) => util.isUndefined(v) || util.isObject(v),
                children: (v: any) => util.isArray(v),
            },
        );
    }

    public appendChild(node: Element) {
        node.parent = this;
        this.children.push(node);
    }

    public setDuration(duration: number) {
        this.duration = duration;
    }

    /**
     * 转换场景模型为XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
    public toXML(pretty = false) {
        const scene = this.renderXML();
        return scene.end({ prettyPrint: pretty, headless: true });
    }

    /**
     * 转换场景模型为过时的XML文档
     *
     * @param {Boolean} pretty 是否格式化
     * @returns {String} XML文档内容
     */
    public toOldXML(pretty = false) {
        const board = this.renderOldXML();
        return board.end({ prettyPrint: pretty, headless: true });
    }

    /**
     * 转换为前端支持的options
     */
    public toOptions(): any {
        const children: Element[] = [];
        let backgroundImage: Element | undefined;
        let backgroundVideo: Element | undefined;
        let backgroundAudio: Element | undefined;
        this.children.forEach(node => {
            if(node.isBackground) {
                switch (node.type) {
                    case 'image':
                        backgroundImage = node;
                        break;
                    case 'video':
                        backgroundVideo = node;
                        break;
                    case 'audio':
                        backgroundAudio = node;
                        break;
                }
            }
            else
                children.push(node);
        });
        return {
            id: this.id,
            duration: util.millisecondsToSenconds(this.duration),
            poster: this.poster,
            videoWidth: this.width,
            videoHeight: this.height,
            videoSize: this.aspectRatio,
            bgColor: { id: util.uniqid(), fillColor: this.backgroundColor },
            bgImage: backgroundImage ? backgroundImage.toOptions() : undefined,
            bgVideo: backgroundVideo ? backgroundVideo.toOptions() : undefined,
            bgMusic: backgroundAudio ? backgroundAudio.toOptions() : undefined,
            transition: this.transition ? {
                name: this.transition.type,
                duration: util.millisecondsToSenconds(this.transition.duration)
            } : undefined,
            elements: children.map(node => node.toOptions()).sort((a: any, b: any) => a.index - b.index)
        };
    }

    /**
     * 渲染场景XML标签
     *
     * @param {XMLObject} parent 上级XML对象
     */
    public renderXML(parent?: any) {
        const scene = parent
            ? parent.ele(this.type, {
                id: this.id,
                name: this.name,
                poster: this.poster,
                width: this.width,
                height: this.height,
                aspectRatio: this.aspectRatio,
                duration: this.duration,
                backgroundColor: this.backgroundColor,
            })
            : this.#createXMLRoot();
        this.transition?.renderXML(scene); // 渲染转场属性
        this.sortedChildren.forEach((node) => node.renderXML(scene)); // 渲染场景子节点
        return scene;
    }

    /**
     * 渲染场景旧XML标签
     * 
     * @param {XMLObject} parent 上级XML对象
     * @param {XMLObject} resources 资源XML对象
     * @returns {String} XML内容
     */
    public renderOldXML(parent?: any, resources?: any) {
        const board = parent ? parent.ele('board', {
                id: this.id,
                name: this.name,
                poster: this.poster,
                duration: util.millisecondsToSenconds(this.duration),
            }) : this.#createXMLRoot('board', {
                duration: util.millisecondsToSenconds(this.duration)
            });
        if (this.backgroundColor) {
            board.ele('bgblock', {
                id: util.uniqid(),
                inPoint: 0,
                fillColor: this.backgroundColor,
            });
        }
        const tagMap: any = {};
        this.sortedChildren.forEach((node: Element) => node.renderOldXML((tagName: string) => {
            if (tagMap[tagName]) return tagMap[tagName];
            return (tagMap[tagName] = board.ele(tagName));
        }, resources));
        this.transition?.renderOldXML(board);
        return board;
    }

    /**
     * 创建XML根节点
     */
    #createXMLRoot(tagName = 'scene', attributes = {}) {
        const scene = create().ele(tagName, {
            id: this.id,
            name: this.name,
            poster: this.poster,
            width: this.width,
            height: this.height,
            aspectRatio: this.aspectRatio,
            duration: this.duration,
            backgroundColor: this.backgroundColor,
            ...attributes
        });
        return scene;
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
        if (util.isObject(content)) return new Scene(content);
        if (util.isString(content)) return Scene.parseXML(content, data, vars);
        return Scene.parseJSON(content, data, vars);
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
        if (util.isObject(content)) return new Scene(content);
        if (util.isString(content)) return Scene.parseXMLPreprocessing(content, data, vars, dataProcessor, varsProcessor);
        return Scene.parseJSONPreprocessing(content, data, vars, dataProcessor, varsProcessor);
    }

    /**
     * 解析JSON数据为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseJSON = Parser.parseSceneJSON.bind(Parser);

    /**
     * 解析JSON数据为模型
     *
     * @param {String} content
     * @returns {Template}
     */
     public static parseJSONPreprocessing = Parser.parseSceneJSONPreprocessing.bind(Parser);

    /**
     * 解析XML文档为模型
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseXML = Parser.parseSceneXML.bind(Parser);

    /**
     * 解析XML文档为模型并预处理
     *
     * @param {String} content
     * @returns {Template}
     */
    public static parseXMLPreprocessing = Parser.parseSceneXMLPreprocessing.bind(Parser);

      /**
     * 解析前端options
     * 
     * @param {Object} options options对象
     * @returns {Template}
     */
    public static parseOptions = OptionsParser.parseSceneOptions.bind(OptionsParser);

    /**
     * 是否为场景ID
     *
     * @param {String} value
     * @returns {Boolean}
     */
    public static isId(value: any) {
        return util.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
    }

    /**
     * 是否为场景实例
     *
     * @param {Object} value
     * @returns {Boolean}
     */
    public static isInstance(value: any) {
        return value instanceof Scene;
    }

    /**
     * 生成所有子元素的轨道
     *
     * @param {Number} baseTime 基准时间
     * @returns
     */
    public generateAllTrack(baseTime = 0) {
        let track: any = [];
        this.children.forEach(node => {
            track.push({
                ...node,
                update: node.update.bind(node),
                absoluteStartTime: baseTime + (node.startTime || 0),
                absoluteEndTime: baseTime + (node.endTime || this.duration)
            });
            track = track.concat(node.generateAllTrack(baseTime, this.duration));
        });
        return track?.sort((n1: any, n2: any) => (n1.absoluteStartTime as number) - (n2.absoluteStartTime as number)); // 根据绝对开始时间排序
    }

    /**
     * 获取已排序的子节点
     */
    public get sortedChildren() {
        const _children = util.clone(this.children);
        _children.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        return _children;
    }

    public get fontFamilys() {
        const fontFamilys: string[] = [];
        this.children.forEach((node) => {
            if (Text.isInstance(node)) {
                const text = node as Text;
                text.fontFamily && fontFamilys.push(text.fontFamily);
            }
        });
        return fontFamilys;
    }
}

export default Scene;
