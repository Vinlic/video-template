import IEffectOptions from './IEffectOptions';
import ElementTypes from '../../enums/ElementTypes';

import Element from '../Element';

interface IElementOptions {
  type?: ElementTypes;
  id?: string;
  name?: string;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  zIndex?: number | string;
  rotate?: number | string;
  opacity?: number | string;
  scaleWidth?: number | string;
  scaleHeight?: number | string;
  enterEffect?: IEffectOptions;
  exitEffect?: IEffectOptions;
  stayEffect?: IEffectOptions;
  backgroundColor?: string;
  startTime?: number | string;
  endTime?: number | string;
  trackId?: string;
  value?: string;
  children?: (Element | IElementOptions)[];
}

export default IElementOptions;
