import IVideoOptions from './interface/IVideoOptions';

import ElementTypes from '../enums/ElementTypes';

import Media from './Media';

class Video extends Media {
  public constructor(options: IVideoOptions) {
    super(options, ElementTypes.Video);
  }

  public static isInstance(value: any) {
    return value instanceof Video;
  }
}

export default Video;
