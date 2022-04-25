import xmlBuilder from 'xmlbuilder';
import { XMLParser } from 'fast-xml-parser';

import ITemplateOptions from './interface/ITemplateOptions';
import ISceneOptions from './interface/ISceneOptions';
import IElementOptions from './elements/interface/IElementOptions';

import util from './util';
import Compiler from './compiler';
import Scene from './Scene';
import ElementFactory from './ElementFactory';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, SSML } from './elements';

const xmlParser = new XMLParser({
  allowBooleanAttributes: true, //需要解析布尔值属性
  ignoreAttributes: false, //不要忽略属性
  attributeNamePrefix: '', //属性名称不拼接前缀
  preserveOrder: true, //保持原始文档标签顺序
  parseTagValue: false, //不解析标签内值
  stopNodes: ['template.scene.voice.ssml'], //解析到ssml标签为止不要继续往下解析
});

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
  public createTime = 0; //模板创建时间
  public updateTime = 0; //模板最后更新时间
  public buildBy = ''; //模板从何处构建
  public compile = false; //模板是否需要编译
  public children: (Scene | Element | ISceneOptions | IElementOptions)[] = []; //模板子节点

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
        crf: (v: any) => v && Number(v),
        volume: (v: any) => Number(util.defaultTo(v, 1)),
        frameQuality: (v: any) => v && Number(v),
        createTime: (v: any) => Number(util.defaultTo(v, util.unixTimestamp())),
        updateTime: (v: any) => Number(util.defaultTo(v, util.unixTimestamp())),
        buildBy: (v: any) => util.defaultTo(v, 'system'),
        compile: (v: any) => util.booleanParse(util.defaultTo(v, false)),
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
        createTime: (v: any) => util.isUnixTimestamp(v),
        updateTime: (v: any) => util.isUnixTimestamp(v),
        buildBy: (v: any) => util.isString(v),
        compile: (v: any) => util.isBoolean(v),
        children: (v: any) => util.isArray(v),
      },
    );
  }

  public scenesSplice(start: number, end: number) {
    let index = 0;
    this.children = this.children?.filter((node) => {
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

  public appendChild(node: Scene | Element) {
    if (!Scene.isInstance(node) && !Element.isInstance(node))
      throw new TypeError('node must be an Scene instance or Element instance');
    this.children?.push(node);
  }

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
  public toXML(pretty = false) {
    const template = xmlBuilder.create('template');
    template.att('version', this.version);
    template.att('id', this.id);
    template.att('name', this.name);
    template.att('mode', this.mode);
    template.att('poster', this.poster);
    template.att('actuator', this.actuator);
    template.att('width', this.width);
    template.att('height', this.height);
    template.att('aspectRatio', this.aspectRatio);
    template.att('fps', this.fps);
    template.att('crf', this.crf);
    template.att('videoCodec', this.videoCodec);
    template.att('videoBitrate', this.videoBitrate);
    template.att('pixelFormat', this.pixelFormat);
    template.att('frameQuality', this.frameQuality);
    template.att('duration', this.duration);
    template.att('format', this.format);
    template.att('volume', this.volume);
    template.att('audioCodec', this.audioCodec);
    template.att('sampleRate', this.sampleRate);
    template.att('audioBitrate', this.audioBitrate);
    template.att('backgroundColor', this.backgroundColor);
    template.att('createTime', this.createTime);
    template.att('updateTime', this.updateTime);
    template.att('buildBy', this.buildBy);
    this.children?.forEach((node) => (node as Scene | Element).renderXML(template)); //子节点XML渲染
    return template.end({ pretty });
  }

  /**
   * 转换模板模型为过时的XML文档
   *
   * @param {Boolean} pretty 是否格式化
   * @returns {String} XML文档内容
   */
  public toOldXML(pretty = false) {
    const project = xmlBuilder.create('project');
    project.att('version', '1.0.0');
    project.att('id', this.id);
    project.att('name', this.name);
    project.att('actuator', this.actuator);
    const resources: { [map: string]: any } = project.ele('projRes');
    resources.map = {};
    const global = project.ele('global', {
      videoSize: this.aspectRatio,
      videoWidth: this.width,
      videoHeight: this.height,
      poster: this.poster,
      fps: this.fps,
      videoBitrate: 2097152,
      audioBitrate: 131072,
    });
    if (this.backgroundColor) {
      global.ele('bgblock', {
        id: util.uniqid(),
        inPoint: 0,
        fillColor: this.backgroundColor,
      });
    }
    const storyBoards = project.ele('storyBoards');
    this.children?.forEach((node) => (node as Scene | Element).renderOldXML(storyBoards, resources, global)); //子节点XML渲染
    return project.end({ pretty });
  }

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
  public static async parse(content: any, data?: object, vars?: object, dataProcessor?: any, varsProcessor?: any) {
    if (!util.isString(content) && !util.isObject(content)) throw new TypeError('content must be an string or object');
    if (util.isBuffer(content)) content = content.toString();
    if (util.isObject(content)) return new Template(content);
    if (/\<template/.test(content)) return await Template.parseXML(content, data, vars, dataProcessor, varsProcessor);
    else if (/\<project/.test(content)) return Template.parseOldXML(content, data, vars);
    else return await Template.parseJSON(content, data, vars, dataProcessor, varsProcessor);
  }

  /**
   * 解析JSON数据为模型
   *
   * @param {String} content
   * @returns {Template}
   */
  public static async parseJSON(content: any, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
    const object = util.isString(content) ? JSON.parse(content) : content;
    if (util.isFunction(dataProcessor) && util.isString(object.dataSrc)) {
      const result = await dataProcessor(object.dataSrc);
      util.isObject(result) && util.assign(data, result);
    }
    if (util.isFunction(varsProcessor) && util.isString(object.varsSrc)) {
      const result = await varsProcessor(object.varsSrc);
      util.isObject(result) && util.assign(data, result);
    }
    return new Template(object, util.assign(object.data || {}, data), util.assign(object.vars || {}, vars));
  }

  /**
   * 解析XML文档为模型
   *
   * @param {String} content
   * @returns {Template}
   */
  public static async parseXML(content: string, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
    let xmlObject, varsObject, dataObject;
    xmlParser.parse(content).forEach((o: any) => {
      if (o.template) xmlObject = o;
      if (o.vars) varsObject = o;
      if (o.data) dataObject = o;
    });
    if (!xmlObject) throw new Error('template xml invalid');
    function parse(obj: any, target: any = {}) {
      const type = Object.keys(obj)[0];
      target.type = type;
      for (let key in obj[':@']) {
        const value = obj[':@'][key];
        let index;
        if (key === 'for-index') key = 'forIndex';
        else if (key === 'for-item') key = 'forItem';
        else if ((index = key.indexOf('-')) != -1) {
          const pkey = key.substring(0, index);
          const ckey = key.substring(index + 1, key.length);
          if (!target[pkey]) target[pkey] = {};
          target[pkey][ckey] = value;
          continue;
        }
        target[key] = value;
      }
      target.children = [];
      obj[type].forEach((v: any) => {
        if (v['#text']) return (target.value = v['#text']);
        const result = parse(v, {});
        result && target.children.push(result);
      });
      return target;
    }
    const completeObject = parse(xmlObject);
    const _vars = {};
    const _data = {};
    if (varsObject || dataObject) {
      function processing(obj: any, target: any) {
        obj.children.forEach((o: any) => {
          if (!target[o.type]) target[o.type] = {};
          if (o.value) target[o.type] = o.value;
          processing(o, target[o.type]);
        });
      }
      varsObject && processing(parse(varsObject), _vars);
      dataObject && processing(parse(dataObject), _data);
    }
    if (dataObject?.[':@']) {
      const attrs = dataObject[':@'] as any;
      if (util.isFunction(dataProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util.isObject(result) && util.assign(data, result);
      }
    }
    if (varsObject?.[':@']) {
      const attrs = varsObject[':@'] as any;
      if (util.isFunction(varsProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util.isObject(result) && util.assign(vars, result);
      }
    }
    return new Template(completeObject, util.assign(_data, data), util.assign(_vars, vars));
  }

  /**
   * 解析过时的XML文档为模型
   *
   * @param {String} content
   * @returns {Template}
   */
  public static parseOldXML(content: string, data = {}, vars = {}) {
    const xmlObject = xmlParser.parse(content);
    function merge(obj: any, target: any = {}) {
      Object.assign(target, obj[':@']);
      const key = Object.keys(obj).filter((k) => k != ':@')[0];
      target.key = key;
      if (key === '#text') return obj[key];
      const items = obj[key];
      target.children = items.map((v: any) => v && merge(v, {}));
      return target;
    }
    const rawObject = merge(xmlObject[1] || xmlObject[0]);
    const {
      type,
      name,
      actuator,
      children: [projRes, global, storyBoards],
    } = rawObject;
    const resourceMap: any = {};
    projRes.children.forEach((resource: any) => (resourceMap[resource.id] = resource));
    function buildBaseData(obj: any) {
      return {
        name: obj.name,
        x: obj.scaleX,
        y: obj.scaleY,
        width: obj.width,
        height: obj.height,
        opacity: obj.opacity,
        zIndex: obj.index,
        enterEffect: obj.animationIn
          ? {
              type: obj.animationIn,
              duration: obj.animationInDuration * 1000,
            }
          : undefined,
        exitEffect: obj.animationOut
          ? {
              type: obj.animationOut,
              duration: obj.animationOutDuration * 1000,
            }
          : undefined,
        backgroundColor: obj.fillColor,
        startTime: obj.inPoint ? obj.inPoint * 1000 : undefined,
        endTime: obj.outPoint ? obj.outPoint * 1000 : undefined,
      };
    }
    const templateChildren: (Scene | Element)[] = [];
    let templateBackgroundColor;
    global.children.forEach((tag: any) => {
      switch (tag.key) {
        case 'bgblock':
          templateBackgroundColor = tag.fillColor;
          break;
        case 'bgimg':
          templateChildren.push(
            new Image({
              ...buildBaseData(tag),
              x: 0,
              y: 0,
              width: global.videoWidth,
              height: global.videoHeight,
              src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
            }),
          );
          break;
        case 'bgmusic':
          templateChildren.push(
            new Audio({
              ...buildBaseData(tag),
              src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
              volume: tag.volume,
              seekStart: tag.seekStart ? tag.seekStart * 1000 : undefined,
              seekEnd: tag.seekEnd ? tag.seekEnd * 1000 : undefined,
              muted: tag.muted,
              loop: tag.loop,
              fadeInDuration: tag.inPoint ? tag.inPoint * 1000 : undefined,
              fadeOutDuration: tag.outPoint ? tag.outPoint * 1000 : undefined,
            }),
          );
          break;
        case 'bgvideo':
          templateChildren.push(
            new Video({
              ...buildBaseData(tag),
              x: 0,
              y: 0,
              width: global.videoWidth,
              height: global.videoHeight,
              poster: tag.poster,
              src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
              duration: tag.duration ? tag.duration * 1000 : undefined,
              volume: tag.volume,
              muted: tag.muted,
              loop: tag.loop,
              seekStart: tag.seekStart ? tag.seekStart * 1000 : undefined,
              seekEnd: tag.seekEnd ? tag.seekEnd * 1000 : undefined,
            }),
          );
          break;
      }
    });
    storyBoards.children.forEach((board: any) => {
      const { poster, duration } = board;
      const sceneChildren: Element[] = [];
      let sceneBackgroundColor;
      let transition;
      board.children.forEach((data: any) => {
        switch (data.key) {
          case 'bgblock':
            sceneBackgroundColor = data.fillColor;
            break;
          case 'bgimg':
            sceneChildren.push(
              new Image({
                ...buildBaseData(data),
                x: 0,
                y: 0,
                width: global.videoWidth,
                height: global.videoHeight,
                src: resourceMap[data.resId] ? resourceMap[data.resId].resPath : undefined,
              }),
            );
            break;
          case 'bgvideo':
            sceneChildren.push(
              new Video({
                ...buildBaseData(data),
                x: 0,
                y: 0,
                width: global.videoWidth,
                height: global.videoHeight,
                poster: data.poster,
                src: resourceMap[data.resId] ? resourceMap[data.resId].resPath : undefined,
                duration: data.duration ? data.duration * 1000 : undefined,
                volume: data.volume,
                muted: data.muted,
                loop: data.loop,
                seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
              }),
            );
            break;
          case 'transition':
            transition = {
              type: data.name,
              duration: data.duration * 1000,
            };
            break;
          case 'captions':
            data.children.forEach((caption: any) =>
              sceneChildren.push(
                new Text({
                  ...buildBaseData(caption),
                  value: caption.children[0]?.children.join('\n'),
                  fontFamily: caption.fontFamily ? caption.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                  fontSize: caption.fontSize,
                  fontColor: caption.fontColor,
                  lineHeight: parseFloat((Number(caption.lineHeight) / Number(caption.fontSize)).toFixed(3)),
                  wordSpacing: caption.wordSpacing,
                  textAlign: caption.textAlign,
                  effectType: caption.effectType,
                  effectWordDuration: caption.effectWordDuration ? caption.effectWordDuration * 1000 : undefined,
                  effectWordInterval: caption.effectWordInterval ? caption.effectWordInterval * 1000 : undefined,
                }),
              ),
            );
            break;
          case 'resources':
            data.children.forEach((tag: any) => {
              if (!resourceMap[tag.resId]) return;
              const { type, resPath } = resourceMap[tag.resId];
              let element;
              switch (type) {
                case 'img':
                case 'gif':
                  element = new Image({
                    ...buildBaseData(tag),
                    crop: tag.cropStyle
                      ? {
                          style: tag.cropStyle === 'circle' ? 'circle' : 'rect',
                          x: tag.cropX,
                          y: tag.cropY,
                          width: tag.cropWidth,
                          height: tag.cropHeight,
                        }
                      : undefined,
                    src: resPath,
                    loop: tag.loop,
                    dynamic: resPath.indexOf('.gif') !== -1 ? true : type === 'gif',
                  });
                  break;
                case 'video':
                  element = new Video({
                    ...buildBaseData(tag),
                    poster: data.poster,
                    src: resPath,
                    duration: data.duration ? data.duration * 1000 : undefined,
                    volume: data.volume,
                    muted: data.muted,
                    loop: data.loop,
                    seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                    seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
                  });
                  break;
                case 'sound':
                  element = new Audio({
                    ...buildBaseData(tag),
                    src: resPath,
                    duration: data.duration,
                    volume: data.volume,
                    muted: data.muted,
                    loop: data.loop,
                    seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                    seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
                    fadeInDuration: data.inPoint ? data.inPoint * 1000 : undefined,
                    fadeOutDuration: data.outPoint ? data.outPoint * 1000 : undefined,
                  });
              }
              element && sceneChildren.push(element);
            });
            break;
          case 'dynDataCharts':
            data.children.forEach((chart: any) =>
              sceneChildren.push(
                new Chart({
                  ...buildBaseData(chart),
                  chartId: chart.chartId,
                  configSrc: chart.optionsPath,
                  dataSrc: chart.dataPath,
                }),
              ),
            );
            break;
          case 'textToSounds':
            data.children.forEach((voice: any) =>
              sceneChildren.push(
                new Voice({
                  ...buildBaseData(voice),
                  src: resourceMap[voice.resId] ? resourceMap[voice.resId].resPath : undefined,
                  volume: voice.volume,
                  seekStart: voice.seekStart ? voice.seekStart * 1000 : undefined,
                  seekEnd: voice.seekEnd ? voice.seekEnd * 1000 : undefined,
                  loop: voice.loop,
                  muted: voice.muted,
                  provider: voice.provider,
                  children: voice.children[0]
                    ? [
                        new SSML({
                          value: voice.children[0]?.children[0],
                        }),
                      ]
                    : [],
                  text: voice.text,
                  declaimer: voice.voice,
                  speechRate: voice.speechRate ? voice.speechRate : undefined,
                  pitchRate: voice.pitchRate ? Number(voice.pitchRate) + 1 : undefined,
                }),
              ),
            );
            break;
          case 'vtubers':
            data.children.forEach((vtuber: any) =>
              sceneChildren.push(
                new Vtuber({
                  ...buildBaseData(vtuber),
                  poster: vtuber.poster,
                  src: resourceMap[vtuber.resId] ? resourceMap[vtuber.resId].resPath : undefined,
                  provider: vtuber.provider,
                  text: vtuber.text,
                  solution: vtuber.solution,
                  declaimer: vtuber.declaimer,
                  duration: vtuber.duration ? vtuber.duration * 1000 : undefined,
                  volume: vtuber.volume,
                  muted: vtuber.muted,
                  loop: vtuber.loop,
                  seekStart: vtuber.seekStart ? vtuber.seekStart * 1000 : undefined,
                  seekEnd: vtuber.seekEnd ? vtuber.seekEnd * 1000 : undefined,
                }),
              ),
            );
        }
      });
      const scene = new Scene({
        poster: poster,
        width: global.videoWidth,
        height: global.videoHeight,
        duration: duration * 1000,
        backgroundColor: sceneBackgroundColor,
        transition,
        filter: undefined,
        children: sceneChildren,
      });
      templateChildren.push(scene);
    });
    return new Template(
      {
        mode: type || 'scene',
        name: name,
        poster: global.poster,
        actuator,
        width: global.videoWidth,
        height: global.videoHeight,
        aspectRatio: global.videoSize,
        backgroundColor: templateBackgroundColor,
        fps: global.fps,
        children: templateChildren,
      },
      data,
      vars,
    );
  }

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
    this.children?.forEach((node: any) => {
      if (Scene.isInstance(node)) {
        track = track.concat(node.generateAllTrack(baseTime));
        baseTime += node.duration;
      } else {
        node.setParentSection(baseTime, duration);
        track.push(node);
      }
    });
    return track;
  }

  public get duration() {
    return this.children?.reduce(
      (duration: number, node: any) => (Scene.isInstance(node) ? duration + node.duration : duration),
      0,
    );
  }

  public get fontFamilys() {
    let fontFamilys: string[] = [];
    this.children?.forEach((node: any) => {
      if (Scene.isInstance(node)) fontFamilys = fontFamilys.concat(node.fontFamilys);
      else if (node.fontFamily) fontFamilys.push(node.fontFamily);
    });
    return Array.from(new Set(fontFamilys));
  }

  public get scenes() {
    return this.children?.filter((node: any) => Scene.isInstance(node));
  }
}

export default Template;
