import ICropOptions from './ICropOptions';
import IMediaOptions from './IMediaOptions';

interface IVideoOptions extends IMediaOptions {
    crop?: ICropOptions,
    demuxSrc?: string
};

export default IVideoOptions;
