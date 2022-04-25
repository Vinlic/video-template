import IMediaOptions from './IMediaOptions';

interface IAudioOptions extends IMediaOptions {
  fadeInDuration?: number | string;
  fadeOutDuration?: number | string;
}

export default IAudioOptions;
