import IMediaOptions from './IMediaOptions';
import VoiceProviders from '../../enums/VoiceProviders';

interface IVoiceOptions extends IMediaOptions {
  provider?: VoiceProviders;
  text?: string;
  declaimer?: string;
  sampleRate?: string;
  speechRate?: number | string;
  pitchRate?: number | string;
}

export default IVoiceOptions;
