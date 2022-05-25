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
  isBackground?: boolean | string;
  backgroundColor?: string;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number | string;
  startTime?: number | string;
  endTime?: number | string;
  fixedScale?: boolean | string;
  trackId?: string;
  value?: string;
  children?: (Element | IElementOptions)[];
}

export default IElementOptions;
