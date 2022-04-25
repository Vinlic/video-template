import xmlBuilder from 'xmlbuilder';

import ISceneOptions from './interface/ISceneOptions';
import ITransitionOptions from './interface/ITransitionOptions';
import IFilterOptions from './elements/interface/IFilterOptions';

import ElementFactory from './ElementFactory';
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
  public duration = 0; // 场景总时长
  public backgroundColor?: string; // 场景背景颜色
  public transition?: Transition; // 场景转场效果
  public filter?: IFilterOptions; // 场景滤镜
  public children: Element[] = []; // 场景子节点

  public constructor(options: ISceneOptions) {
    if (!util.isObject(options)) throw new TypeError('options must be an Object');
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
            ? datas.map((data) => (Element.isInstance(data) ? data : ElementFactory.createElement(data)))
            : [], // 实例化场景子节点
      },
      {
        type: (v: any) => v === 'scene',
        id: (v: any) => Scene.isId(v),
        name: (v: any) => util.isUndefined(v) || util.isString(v),
        poster: (v: any) => util.isUndefined(v) || util.isString(v),
        width: (v: any) => util.isFinite(v),
        height: (v: any) => util.isFinite(v),
        duration: (v: any) => util.isFinite(v),
        backgroundColor: (v: any) => util.isUndefined(v) || util.isString(v),
        transition: (v: any) => util.isUndefined(v) || Transition.isInstance(v),
        filter: (v: any) => util.isUndefined(v) || util.isObject(v),
        children: (v: any) => util.isArray(v),
      },
    );
  }

  public appendChild(node: Element) {
    this.children?.push(node);
  }

  /**
   * 转换场景模型为XML文档
   *
   * @param {Boolean} pretty 是否格式化
   * @returns {String} XML文档内容
   */
  public toXML(pretty = false) {
    const scene = this.renderXML();
    return scene.end({ pretty });
  }

  /**
   * 转换场景模型为过时的XML文档
   *
   * @param {Boolean} pretty 是否格式化
   * @returns {String} XML文档内容
   */
  public toOldXML(pretty = false) {
    const board = this.renderOldXML();
    return board.end({ pretty });
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
          duration: this.duration,
          backgroundColor: this.backgroundColor,
        })
      : this.#createXMLRoot();
    this.transition?.renderXML(scene); // 渲染转场属性
    this.children?.forEach((node) => node.renderXML(scene)); // 渲染场景子节点
    return scene;
  }

  public renderOldXML(parent?: any, resources?: any) {
    const board = parent
      ? parent.ele('board', {
          id: this.id,
          name: this.name,
          poster: this.poster,
          duration: (this.duration as number) / 1000,
        })
      : this.#createXMLRoot('board');
    if (this.backgroundColor) {
      board.ele('bgblock', {
        id: util.uniqid(),
        inPoint: 0,
        fillColor: this.backgroundColor,
      });
    }
    const tagMap: any = {};
    this.children?.forEach((node: Element) =>
      node.renderOldXML((tagName: string) => {
        if (tagMap[tagName]) return tagMap[tagName];
        return (tagMap[tagName] = board.ele(tagName));
      }, resources),
    );
    this.transition?.renderOldXML(board);
    return board;
  }

  #createXMLRoot(tagName = 'scene', headless = true) {
    const scene = xmlBuilder.create(tagName, { headless });
    scene.att('id', this.id);
    scene.att('name', this.name);
    scene.att('poster', this.poster);
    scene.att('width', this.width);
    scene.att('height', this.height);
    scene.att('duration', this.duration);
    scene.att('backgroundColor', this.backgroundColor);
    return scene;
  }

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
    const track = this.children?.map((node) => {
      node.setParentSection(baseTime, this.duration as number);
      return node;
    }); // 子节点设置父级时间区间
    return track?.sort((n1, n2) => (n1.absoluteStartTime as number) - (n2.absoluteStartTime as number)); // 根据绝对开始时间排序
  }

  public get fontFamilys() {
    const fontFamilys: string[] = [];
    this.children?.forEach((node) => {
      if (Text.isInstance(node)) {
        const text = node as Text;
        text.fontFamily && fontFamilys.push(text.fontFamily);
      }
    });
    return fontFamilys;
  }
}

export default Scene;
