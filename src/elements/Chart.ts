import IChartOptions from './interface/IChartOptions';
import ElementTypes from '../enums/ElementTypes';

import Canvas from './Canvas';
import util from '../util';

class Chart extends Canvas {

    public chartId?: string; //图表唯一ID

    public constructor(options: IChartOptions) {
        super(options, ElementTypes.Chart);
        util.optionsInject(
            this,
            options,
            {},
            {
                chartId: (v: any) => util.isUndefined(v) || util.isString(v)
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
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const chart = super.renderOldXML(parent, resources, global);
        chart.att('chartId', this.chartId);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            chartId: this.chartId
        };
    }

    public static isInstance(value: any) {
        return value instanceof Chart;
    }
}

export default Chart;
