import ISSMLOptions from './interface/ISSMLOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';

class SSML extends Element {
  public constructor(options: ISSMLOptions, type = ElementTypes.SSML, ...values: any[]) {
    super(options, type, ...values);
  }

  /**
   * 渲染SSML的XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   */
  public renderXML(parent: any) {
    const ssml = super.renderXML(parent);
    this.value && ssml.ele(this.value);
    return ssml;
  }

  public renderOldXML(parent: any, resources: any, global: any) {
    const ssml = super.renderOldXML(parent, resources, global);
    this.value && ssml.txt(this.value);
    return ssml;
  }

  public static isInstance(value: any) {
    return value instanceof SSML;
  }
}

export default SSML;
