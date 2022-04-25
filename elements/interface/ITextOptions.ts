import IElementOptions from './IElementOptions';

interface ITextOptions extends IElementOptions {
  fontFamily?: string;
  fontSize?: string;
  fontColor?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  lineHeight?: number | string;
  wordSpacing?: number | string;
  textAlign?: string;
  lineWrap?: boolean | string;
  effectType?: string;
  effectWordDuration?: number | string;
  effectWordInterval?: number | string;
}

export default ITextOptions;
