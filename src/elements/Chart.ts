import IChartOptions from './interface/IChartOptions';
import ElementTypes from '../enums/ElementTypes';

import Canvas from './Canvas';
import util from '../util';

class Chart extends Canvas {

    public constructor(options: IChartOptions) {
        super(options, ElementTypes.Chart);
        util.optionsInject(
            this,
            options,
            {},
            {},
        );
    }

    /**
     * 渲染图表XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        super.renderXML(parent);
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        super.renderOldXML(parent, resources, global);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            optionsPath: this.configSrc,
            ...parentOptions
        };
    }

    public static isInstance(value: any) {
        return value instanceof Chart;
    }
}

export default Chart;
