import IMediaOptions from './IMediaOptions';

interface IAudioOptions extends IMediaOptions {
  isRecord?: boolean | string;
  fadeInDuration?: number | string;
  fadeOutDuration?: number | string;
}

export default IAudioOptions;
