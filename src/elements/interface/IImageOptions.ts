import IElementOptions from './IElementOptions';
import ICropOptions from './ICropOptions';
import IFilterOptions from './IFilterOptions';

import ImageModes from '../../enums/ImageModes';

interface IImageOptions extends IElementOptions {
  src?: string;
  path?: string;
  mode?: ImageModes;
  crop?: ICropOptions;
  loop?: boolean | string;
  dynamic?: boolean | string;
  filter?: IFilterOptions;
}

export default IImageOptions;
