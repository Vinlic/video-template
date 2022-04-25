import IMediaOptions from './IMediaOptions';
import VtuberProviders from '../../enums/VtuberProviders';

interface IVtuberOptions extends IMediaOptions {
  provider?: VtuberProviders;
  text?: string;
  solution?: string;
  declaimer?: string;
}

export default IVtuberOptions;
