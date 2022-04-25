import IElementOptions from '../elements/interface/IElementOptions';
import IFilterOptions from '../elements/interface/IFilterOptions';
import ITransitionOptions from './ITransitionOptions';

import Element from '../elements/Element';

interface ISceneOptions {
  id?: string;
  name?: string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  duration?: number | string;
  backgroundColor?: string;
  transition?: ITransitionOptions;
  children?: (Element | IElementOptions)[];
  filter?: IFilterOptions;
}

export default ISceneOptions;
