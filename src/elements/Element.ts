import IElementOptions from './interface/IElementOptions';
import IEffectOptions from './interface/IEffectOptions';

import ElementTypes from '../enums/ElementTypes';

import util from '../util';
import ElementFactory from '../ElementFactory';

class Effect {
  public type = ''; //动效类
  public duration = 0; //动效动画时长
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
        path: (v: any) => util.isUndefined(v) || util.isArray(v),
      },
    );
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
  public trackId?: string; //元素轨道ID
  public value?: string; //元素值
  public children: Element[] = []; //元素子节点
  #absoluteStartTime?: number; //绝对开始时间
  #absoluteEndTime?: number; //绝对结束时间

  public constructor(options: IElementOptions, type = ElementTypes.Element) {
    util.optionsInject(
      this,
      options,
      {
        type: (v: any) => util.defaultTo(v, type),
        id: (v: any) => util.defaultTo(Element.isId(v) ? v : undefined, util.uniqid()),
        x: (v: any) => v && Number(v),
        y: (v: any) => v && Number(v),
        width: (v: any) => v && Number(v),
        height: (v: any) => v && Number(v),
        zIndex: (v: any) => v && Number(v),
        rotate: (v: any) => v && Number(v),
        opacity: (v: any) => v && Number(v),
        scaleWidth: (v: any) => v && Number(v),
        scaleHeight: (v: any) => v && Number(v),
        startTime: (v: any) => v && Number(v),
        endTime: (v: any) => v && Number(v),
        enterEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
        exitEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
        stayEffect: (v: any) => (util.isUndefined(v) ? v : new Effect(v)),
        isBackground: (v: any) => !util.isUndefined(v) && util.booleanParse(v),
        children: (datas: IElementOptions[]) =>
          util.isArray(datas)
            ? datas.map((data) => (Element.isInstance(data) ? data : ElementFactory.createElement(data)))
            : [], //实例化子节点
      },
      {
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
        isBackground: (v: any) => util.isUndefined(v) || util.isBoolean(v),
        backgroundColor: (v: any) => util.isUndefined(v) || util.isString(v),
        startTime: (v: any) => util.isUndefined(v) || util.isFinite(v),
        endTime: (v: any) => util.isUndefined(v) || util.isFinite(v),
        trackId: (v: any) => util.isUndefined(v) || util.isString(v),
        value: (v: any) => util.isUndefined(v) || util.isString(v),
        children: (v: any) => util.isArray(v),
      },
    );
  }

  /**
   * 渲染元素XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   * @returns {XMLObject} 包含基本属性的XML对象
   */
  public renderXML(parent: any) {
    const element = parent.ele(this.type, {
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
      'enterEffect-path': this.enterEffect?.path?.join(',') ?? undefined,
      'exitEffect-type': this.exitEffect?.type ?? undefined,
      'exitEffect-duration': this.exitEffect?.duration ?? undefined,
      'exitEffect-path': this.exitEffect?.path?.join(',') ?? undefined,
      'stayEffect-type': this.stayEffect?.type ?? undefined,
      'stayEffect-duration': this.stayEffect?.duration ?? undefined,
      'stayEffect-path': this.stayEffect?.path?.join(',') ?? undefined,
      isBackground: this.isBackground,
      backgroundColor: this.backgroundColor,
      startTime: this.startTime,
      endTime: this.endTime,
    });
    this.children?.forEach((node) => Element.isInstance(node) && node.renderXML(element));
    return element;
  }

  public renderOldXML(parent: any, resources?: any, global?: any) {
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
      animationInDuration: this.enterEffect?.duration ? this.enterEffect.duration / 1000 : undefined,
      animationOut: this.exitEffect?.type ?? undefined,
      animationOutDuration: this.exitEffect?.duration ? this.exitEffect.duration / 1000 : undefined,
      inPoint: util.isNumber(this.startTime) ? (this.startTime as number) / 1000 : undefined,
      outPoint: util.isNumber(this.endTime) ? (this.endTime as number) / 1000 : undefined,
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
      element = (
        util.isFunction(parent)
          ? parent([
              {
                [ElementTypes.Text]: 'captions',
                [ElementTypes.Image]: 'resources',
                [ElementTypes.Audio]: 'resources',
                [ElementTypes.Video]: 'resources',
                [ElementTypes.Voice]: 'textToSounds',
                [ElementTypes.Chart]: 'dynDataCharts',
                [ElementTypes.Vtuber]: 'vtubers',
              }[this.type as string],
            ])
          : parent
      ).ele(
        {
          [ElementTypes.Text]: 'caption',
          [ElementTypes.Image]: 'resource',
          [ElementTypes.Audio]: 'resource',
          [ElementTypes.Video]: 'resource',
          [ElementTypes.Voice]: 'textToSound',
          [ElementTypes.SSML]: 'ssml',
          [ElementTypes.Chart]: 'dynDataChart',
          [ElementTypes.Vtuber]: 'vtuber',
        }[this.type as string],
        attributes,
      );
    }
    this.children?.forEach((node) => Element.isInstance(node) && node.renderOldXML(element, resources, global));
    return element;
  }

  public static isId(value: any) {
    return util.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
  }

  public static isInstance(value: any) {
    return value instanceof Element;
  }

  public setParentSection(baseTime: number, duration: number) {
    this.#absoluteStartTime = baseTime + (this.startTime || 0);
    this.#absoluteEndTime = baseTime + (this.endTime || duration);
  }

  public get absoluteStartTime() {
    return this.#absoluteStartTime;
  }

  public get absoluteEndTime() {
    return this.#absoluteEndTime;
  }
}

export default Element;
