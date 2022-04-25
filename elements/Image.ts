import IImageOptions from './interface/IImageOptions';
import ICropOptions from './interface/ICropOptions';
import IFilterOptions from './interface/IFilterOptions';

import ElementTypes from '../enums/ElementTypes';
import ImageModes from '../enums/ImageModes';

import Element from './Element';
import util from '../util';

class Crop {
  public x = 0; // 裁剪相对X坐标值
  public y = 0; // 裁剪相对Y坐标值
  public width = 0; // 裁剪宽度
  public height = 0; // 裁剪高度
  public style = ''; // 裁剪样式

  public constructor(options: ICropOptions) {
    util.optionsInject(
      this,
      options,
      {
        x: (v: any) => Number(util.defaultTo(v, 0)),
        y: (v: any) => Number(util.defaultTo(v, 0)),
        width: (v: any) => Number(v),
        height: (v: any) => Number(v),
      },
      {
        x: (v: any) => util.isFinite(v),
        y: (v: any) => util.isFinite(v),
        width: (v: any) => util.isFinite(v),
        height: (v: any) => util.isFinite(v),
        style: (v: any) => util.isString(v),
      },
    );
  }

  public static isInstance(value: any) {
    return value instanceof Crop;
  }
}

class Image extends Element {
  public src = ''; //图像来源
  public path?: string; //图像本地路径
  public mode: ImageModes = ImageModes.ScaleToFill; //图像显示模式
  public crop?: Crop; //图像裁剪参数
  public loop?: boolean; //GIF图像是否循环播放
  public dynamic?: boolean; //图像是否动态
  public filter?: IFilterOptions; //图像滤镜

  public constructor(options: IImageOptions) {
    super(options, ElementTypes.Image);
    util.optionsInject(
      this,
      options,
      {
        mode: (v: any) => util.defaultTo(v, ImageModes.ScaleToFill),
        crop: (v: any) => v && new Crop(v),
        loop: (v: any) => v && util.booleanParse(v),
        dynamic: (v: any) => v && util.booleanParse(v),
      },
      {
        src: (v: any) => util.isString(v),
        path: (v: any) => util.isUndefined(v) || util.isString(v),
        mode: (v: any) => util.isString(v),
        crop: (v: any) => util.isUndefined(v) || Crop.isInstance(v),
        loop: (v: any) => util.isUndefined(v) || util.isBoolean(v),
        dynamic: (v: any) => util.isUndefined(v) || util.isBoolean(v),
        filter: (v: any) => util.isUndefined(v) || util.isObject(v),
      },
    );
  }

  /**
   * 渲染图像XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   */
  public renderXML(parent: any) {
    const image = super.renderXML(parent);
    image.att('src', this.src);
    image.att('mode', this.mode);
    image.att('dynamic', this.dynamic);
    image.att('loop', this.loop);
  }

  public renderOldXML(parent: any, resources: any, global: any) {
    const image = super.renderOldXML(parent, resources, global);
    const cacheResourceId = resources ? resources.map[this.src as string] : null;
    const resourceId = cacheResourceId || util.uniqid();
    image.att('loop', this.loop);
    image.att('resId', resourceId);
    if (cacheResourceId || !resources) return image;
    resources.map[this.src as string] = resourceId;
    resources.ele('resource', {
      id: resourceId,
      name: this.name,
      type: 'img',
      resPath: this.src,
    });
    return image;
  }

  public static isInstance(value: any) {
    return value instanceof Image;
  }
}

export default Image;
