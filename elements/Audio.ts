import IAudioOptions from './interface/IAudioOptions';

import ElementTypes from '../enums/ElementTypes';

import Media from './Media';
import util from '../util';

class Audio extends Media {
  public fadeInDuration?: number; //音频淡入时长
  public fadeOutDuration?: number; //音频淡出时长

  public constructor(options: IAudioOptions) {
    if (!util.isObject(options)) throw new TypeError('options must be an Object');
    super(options, ElementTypes.Audio);
    util.optionsInject(
      this,
      options,
      {
        fadeInDuration: (v: any) => v && Number(v),
        fadeOutDuration: (v: any) => v && Number(v),
      },
      {
        fadeInDuration: (v: any) => util.isUndefined(v) || util.isFinite(v),
        fadeOutDuration: (v: any) => util.isUndefined(v) || util.isFinite(v),
      },
    );
  }

  /**
   * 渲染音频XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   */
  public renderXML(parent: any) {
    const audio = super.renderXML(parent);
    audio.att('fadeInDuration', this.fadeInDuration);
    audio.att('fadeOutDuration', this.fadeOutDuration);
  }

  public renderOldXML(parent: any, resources: any, global: any) {
    const audio = super.renderOldXML(parent, resources, global);
    util.isNumber(this.fadeInDuration) && audio.att('fadeIn', (this.fadeInDuration as number) / 1000);
    util.isNumber(this.fadeOutDuration) && audio.att('fadeOut', (this.fadeOutDuration as number) / 1000);
  }

  public static isInstance(value: any) {
    return value instanceof Audio;
  }
}

export default Audio;
