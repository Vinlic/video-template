import IElementOptions from './IElementOptions';
import IFilterOptions from './IFilterOptions';

interface IMediaOptions extends IElementOptions {
  poster?: string;
  src?: string;
  path?: string;
  volume?: number | string;
  format?: string;
  duration?: number | string;
  seekStart?: number | string;
  seekEnd?: number | string;
  loop?: boolean | string;
  playbackRate?: number | string;
  muted?: boolean | string;
  filter?: IFilterOptions;
}

export default IMediaOptions;
