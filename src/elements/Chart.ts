import IChartOptions from './interface/IChartOptions';
import ElementTypes from '../enums/ElementTypes';

import Canvas from './Canvas';
import util from '../util';

class Chart extends Canvas {

    public constructor(options: IChartOptions, type = ElementTypes.Chart, ...values: any[]) {
        super(options, type, ...values);
        util.optionsInject(this, options, {}, {});
    }

    /**
     * 渲染图表XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        return super.renderXML(parent);
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        return super.renderOldXML(parent, resources, global);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            optionsPath: this.config ? undefined : this.configSrc,
            dataPath: this.data ? undefined : this.dataSrc,
            ddcoptions: this.config,
            ddcdata: this.data,
            ...parentOptions
        };
    }

    public static isInstance(value: any) {
        return value instanceof Chart;
    }
}

export default Chart;
