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
  isSubtitle?: boolean | string;
  styleType?: string,
  textShadow?: any;
  textStroke?: any;
  textBackground?: any;
  textFillColor?: string;
  fillColorIntension?: number | string;
}

export default ITextOptions;
