import IElementOptions from './IElementOptions';

interface IChartOptions extends IElementOptions {
  chartId?: string;
  configSrc?: string;
  dataSrc?: string;
}

export default IChartOptions;
