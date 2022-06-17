import { Document, Providers } from 'aggregation-ssml';

import ISSMLOptions from './interface/ISSMLOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';

class SSML extends Element {

  #document?: Document;

  public constructor(options: ISSMLOptions, type = ElementTypes.SSML, ...values: any[]) {
    super(options, type, ...values);
  }

  init(provider: string) {
    if (!this.value) return;
    const document = Document.parse(this.value, provider as Providers);
    const realProvider = document.provider;
    document.provider = Document.Provider.Aggregation;
    document.realProvider = realProvider;
    this.value = document.toSSML();
    this.#document = document;
  }

  /**
   * 渲染SSML的XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   * @param {Scene} parent 上级节点XML对象
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

  get document() { return this.#document }

  public static isInstance(value: any) {
    return value instanceof SSML;
  }

}

export default SSML;
