import ISceneOptions from './ISceneOptions';
import IElementOptions from '../elements/interface/IElementOptions';

import Scene from '../Scene';
import Element from '../elements/Element';

interface ITemplateOptions {
  type?: string;
  id?: string;
  mode?: string;
  version?: string;
  name?: string;
  poster?: string;
  actuator?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  original?: any;
  fps?: number | string;
  crf?: number | string;
  videoCodec?: string;
  videoBitrate?: string;
  pixelFormat?: string;
  frameQuality?: number | string;
  format?: string;
  volume?: number | string;
  audioCodec?: string;
  sampleRate?: string;
  audioBitrate?: string;
  backgroundColor?: string;
  captureTime?: number | string;
  createTime?: number;
  updateTime?: number;
  buildBy?: string;
  compile?: boolean;
  debug?: boolean;
  children?: (Scene | Element | ISceneOptions | IElementOptions)[];
}

export default ITemplateOptions;
