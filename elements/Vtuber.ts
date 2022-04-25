import IVtuberOptions from './interface/IVtuberOptions';

import ElementTypes from '../enums/ElementTypes';

import Media from './Media';
import util from '../util';

class Vtuber extends Media {
  public provider = ''; //虚拟人服务提供商
  public text = ''; //虚拟人阅读文本
  public solution = ''; //虚拟人形象
  public declaimer?: string; //虚拟人文本朗读者

  public constructor(options: IVtuberOptions) {
    super(options, ElementTypes.Vtuber);
    util.optionsInject(
      this,
      options,
      {},
      {
        provider: (v: any) => util.isString(v),
        text: (v: any) => util.isString(v),
        solution: (v: any) => util.isString(v),
        declaimer: (v: any) => util.isUndefined(v) || util.isString(v),
      },
    );
  }

  /**
   * 渲染虚拟人XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   */
  public renderXML(parent: any) {
    const vtuber = super.renderXML(parent);
    vtuber.att('provider', this.provider);
    vtuber.att('text', this.text);
    vtuber.att('solution', this.solution);
    vtuber.att('declaimer', this.declaimer);
  }

  public renderOldXML(parent: any, resources: any, global: any) {
    const vtuber = super.renderOldXML(parent, resources, global);
    vtuber.att('provider', this.provider);
    vtuber.att('text', this.text);
    vtuber.att('solution', this.solution);
    vtuber.att('declaimer', this.declaimer);
  }

  public static isInstance(value: any) {
    return value instanceof Vtuber;
  }
}

export default Vtuber;
