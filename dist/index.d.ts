interface IEffectOptions {
    type?: string;
    duration?: number | string;
    path?: number[] | string;
}

declare enum ElementTypes {
    Element = "element",
    Text = "text",
    Image = "image",
    Audio = "audio",
    Voice = "voice",
    Video = "video",
    Vtuber = "vtuber",
    Chart = "chart",
    Media = "media",
    SSML = "ssml"
}

declare class Effect {
    type: string;
    duration: number;
    path?: number[];
    constructor(options: IEffectOptions);
    static isInstance(value: any): boolean;
}
declare class Element {
    #private;
    static Type: typeof ElementTypes;
    type: ElementTypes;
    id: string;
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    rotate?: number;
    opacity?: number;
    scaleWidth?: number;
    scaleHeight?: number;
    enterEffect?: Effect;
    exitEffect?: Effect;
    stayEffect?: Effect;
    isBackground?: boolean;
    backgroundColor?: string;
    startTime?: number;
    endTime?: number;
    trackId?: string;
    value?: string;
    children: Element[];
    constructor(options: IElementOptions, type?: ElementTypes);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources?: any, global?: any): any;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    setParentSection(baseTime: number, duration: number): void;
    get absoluteStartTime(): number | undefined;
    get absoluteEndTime(): number | undefined;
}

interface IElementOptions {
    type?: ElementTypes;
    id?: string;
    name?: string;
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    zIndex?: number | string;
    rotate?: number | string;
    opacity?: number | string;
    scaleWidth?: number | string;
    scaleHeight?: number | string;
    enterEffect?: IEffectOptions;
    exitEffect?: IEffectOptions;
    stayEffect?: IEffectOptions;
    isBackground?: boolean | string;
    backgroundColor?: string;
    startTime?: number | string;
    endTime?: number | string;
    trackId?: string;
    value?: string;
    children?: (Element | IElementOptions)[];
}

interface IFilterOptions {
    type?: string;
}

interface ITransitionOptions {
    type?: string;
    duration?: number | string;
}

interface ISceneOptions {
    id?: string;
    name?: string;
    poster?: string;
    width?: number | string;
    height?: number | string;
    duration?: number | string;
    backgroundColor?: string;
    transition?: ITransitionOptions;
    children?: (Element | IElementOptions)[];
    filter?: IFilterOptions;
}

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

declare class Media extends Element {
    poster?: string;
    src?: string;
    path?: string;
    volume: number;
    format?: string;
    duration?: number;
    seekStart?: number;
    seekEnd?: number;
    loop: boolean;
    playbackRate?: number;
    filter?: IFilterOptions;
    muted: boolean;
    constructor(options: IMediaOptions, type: ElementTypes);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    static isInstance(value: any): boolean;
}

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

declare class Text extends Element {
    fontFamily?: string;
    fontSize: number;
    fontColor: string;
    fontWeight: number;
    fontStyle?: string;
    lineHeight: number;
    wordSpacing: number;
    textAlign?: string;
    lineWrap: boolean;
    effectType?: string;
    effectWordDuration?: number;
    effectWordInterval?: number;
    constructor(options: ITextOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    static isInstance(value: any): boolean;
}

interface ICropOptions {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    style?: string;
}

declare enum ImageModes {
    ScaleToFill = "scaleToFill",
    AspectFit = "aspectFit",
    AspectFill = "aspectFill"
}

interface IImageOptions extends IElementOptions {
    src?: string;
    path?: string;
    mode?: ImageModes;
    crop?: ICropOptions;
    loop?: boolean | string;
    dynamic?: boolean | string;
    filter?: IFilterOptions;
}

declare class Crop {
    x: number;
    y: number;
    width: number;
    height: number;
    style: string;
    constructor(options: ICropOptions);
    static isInstance(value: any): boolean;
}
declare class Image extends Element {
    static Mode: typeof ImageModes;
    src: string;
    path?: string;
    mode: ImageModes;
    crop?: Crop;
    loop?: boolean;
    dynamic?: boolean;
    filter?: IFilterOptions;
    constructor(options: IImageOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): any;
    static isInstance(value: any): boolean;
}

interface IAudioOptions extends IMediaOptions {
    fadeInDuration?: number | string;
    fadeOutDuration?: number | string;
}

declare class Audio extends Media {
    fadeInDuration?: number;
    fadeOutDuration?: number;
    constructor(options: IAudioOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    static isInstance(value: any): boolean;
}

declare enum VoiceProviders {
    Aliyun = "aliyun",
    Microsoft = "microsoft",
    Huawei = "huawei",
    Iflytek = "iflytek",
    Tencent = "tencent",
    Baidu = "baidu"
}

interface IVoiceOptions extends IMediaOptions {
    provider?: VoiceProviders;
    text?: string;
    declaimer?: string;
    sampleRate?: string;
    speechRate?: number | string;
    pitchRate?: number | string;
}

declare class Voice extends Media {
    static Provider: typeof VoiceProviders;
    provider: string;
    text?: string;
    declaimer?: string;
    sampleRate?: string;
    speechRate?: number;
    pitchRate?: number;
    constructor(options: IVoiceOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    get ssml(): string | null | undefined;
    static isInstance(value: any): boolean;
}

declare type IVideoOptions = IMediaOptions;

declare class Video extends Media {
    constructor(options: IVideoOptions);
    static isInstance(value: any): boolean;
}

declare enum VtuberProviders {
    YunXiaoWei = "yunXiaoWei",
    XiangXin3D = "xiangXin3D",
    XiangXinGAN = "xiangXinGAN"
}

interface IVtuberOptions extends IMediaOptions {
    provider?: VtuberProviders;
    text?: string;
    solution?: string;
    declaimer?: string;
}

declare class Vtuber extends Media {
    static Provider: typeof VtuberProviders;
    provider: string;
    text: string;
    solution: string;
    declaimer?: string;
    constructor(options: IVtuberOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    static isInstance(value: any): boolean;
}

interface IChartOptions extends IElementOptions {
    chartId?: string;
    configSrc?: string;
    dataSrc?: string;
}

declare class Chart extends Element {
    chartId?: string;
    configSrc: string;
    dataSrc: string;
    constructor(options: IChartOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    static isInstance(value: any): boolean;
}

declare type ISSMLOptions = IElementOptions;

declare class SSML extends Element {
    constructor(options: ISSMLOptions);
    renderXML(parent: any): void;
    renderOldXML(parent: any, resources: any, global: any): void;
    static isInstance(value: any): boolean;
}

type index_Element = Element;
declare const index_Element: typeof Element;
type index_Media = Media;
declare const index_Media: typeof Media;
type index_Text = Text;
declare const index_Text: typeof Text;
type index_Image = Image;
declare const index_Image: typeof Image;
type index_Audio = Audio;
declare const index_Audio: typeof Audio;
type index_Voice = Voice;
declare const index_Voice: typeof Voice;
type index_Video = Video;
declare const index_Video: typeof Video;
type index_Vtuber = Vtuber;
declare const index_Vtuber: typeof Vtuber;
type index_Chart = Chart;
declare const index_Chart: typeof Chart;
type index_SSML = SSML;
declare const index_SSML: typeof SSML;
declare namespace index {
  export {
    index_Element as Element,
    index_Media as Media,
    index_Text as Text,
    index_Image as Image,
    index_Audio as Audio,
    index_Voice as Voice,
    index_Video as Video,
    index_Vtuber as Vtuber,
    index_Chart as Chart,
    index_SSML as SSML,
  };
}

declare class Transition {
    type: string;
    duration: number;
    constructor(options: ITransitionOptions);
    renderXML(scene: any): void;
    renderOldXML(scene: any): void;
    static isInstance(value: any): boolean;
}
declare class Scene {
    #private;
    static readonly type = "scene";
    type: string;
    id: string;
    name?: string;
    poster?: string;
    width: number;
    height: number;
    aspectRatio: string;
    duration: number;
    backgroundColor?: string;
    transition?: Transition;
    filter?: IFilterOptions;
    children: Element[];
    constructor(options: ISceneOptions);
    appendChild(node: Element): void;
    toXML(pretty?: boolean): any;
    toOldXML(pretty?: boolean): any;
    renderXML(parent?: any): any;
    renderOldXML(parent?: any, resources?: any): any;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    generateAllTrack(baseTime?: number): Element[];
    get fontFamilys(): string[];
}

interface ITemplateOptions {
    type?: string;
    id?: string;
    mode?: string;
    version?: string;
    name?: string;
    poster?: string;
    actuator?: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    fps?: number | string;
    crf?: number | string;
    videoCodec?: string;
    videoBitrate?: string;
    pixelFormat?: string;
    frameQuality?: number | string;
    format?: string;
    volume?: number | string;
    audioCodec?: string;
    sampleRate?: string;
    audioBitrate?: string;
    backgroundColor?: string;
    createTime?: number;
    updateTime?: number;
    buildBy?: string;
    compile?: boolean;
    children?: (Scene | Element | ISceneOptions | IElementOptions)[];
}

declare class Template {
    static readonly type = "template";
    type: string;
    id: string;
    mode: string;
    version: string;
    name?: string;
    poster?: string;
    actuator?: string;
    width: number;
    height: number;
    aspectRatio: string;
    fps: number;
    crf?: number;
    videoCodec?: string;
    videoBitrate?: string;
    pixelFormat?: string;
    frameQuality?: number;
    format?: string;
    volume: number;
    audioCodec?: string;
    sampleRate?: string;
    audioBitrate?: string;
    backgroundColor?: string;
    createTime: number;
    updateTime: number;
    buildBy: string;
    compile: boolean;
    children: (Scene | Element | ISceneOptions | IElementOptions)[];
    constructor(options: ITemplateOptions, data?: {}, vars?: {});
    scenesSplice(start: number, end: number): void;
    appendChild(node: Scene | Element): void;
    toBASE64(): string;
    toOldBASE64(): string;
    toXML(pretty?: boolean): string;
    toOldXML(pretty?: boolean): string;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    static parse(content: any, data?: object, vars?: object, dataProcessor?: any, varsProcessor?: any): Promise<Template>;
    static parseJSON(content: any, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Template>;
    static parseXML(content: string, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Template>;
    static parseOldXML(content: string, data?: {}, vars?: {}): Template;
    generateAllTrack(): any;
    get duration(): number;
    get fontFamilys(): string[];
    get scenes(): (IElementOptions | Element | ISceneOptions | Scene)[];
}

export { Scene, Template, index as elements };
