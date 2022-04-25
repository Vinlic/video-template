import IChartOptions from './interface/IChartOptions';
import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Chart extends Element {
  public chartId?: string; //图表唯一ID
  public configSrc = ''; //图表配置路径
  public dataSrc = ''; //图表数据路径

  public constructor(options: IChartOptions) {
    super(options, ElementTypes.Chart);
    util.optionsInject(
      this,
      options,
      {},
      {
        chartId: (v: any) => util.isUndefined(v) || util.isString(v),
        configSrc: (v: any) => util.isString(v),
        dataSrc: (v: any) => util.isString(v),
      },
    );
  }

  /**
   * 渲染图表XML标签
   *
   * @param {XMLObject} parent 上级节点XML对象
   */
  public renderXML(parent: any) {
    const chart = super.renderXML(parent);
    chart.att('chartId', this.chartId);
    chart.att('configSrc', this.configSrc);
    chart.att('dataSrc', this.dataSrc);
  }

  public renderOldXML(parent: any, resources: any, global: any) {
    const chart = super.renderOldXML(parent, resources, global);
    chart.att('chartId', this.chartId);
    chart.att('optionsPath', this.configSrc);
    chart.att('dataPath', this.dataSrc);
  }

  public static isInstance(value: any) {
    return value instanceof Chart;
  }
}

export default Chart;
