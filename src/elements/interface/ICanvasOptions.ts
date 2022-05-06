import IElementOptions from './IElementOptions';

interface ICanvasOptions extends IElementOptions {
  chartId?: string;
  poster?: string;
  duration?: number | string;
  configSrc?: string;
  dataSrc?: string;
}

export default ICanvasOptions;
