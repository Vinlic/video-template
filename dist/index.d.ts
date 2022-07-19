import { Document } from 'aggregation-ssml';

interface IEffectOptions {
    type?: string;
    duration?: number | string;
    direction?: string;
    path?: number[] | string;
}

declare enum ElementTypes {
    Element = "element",
    Group = "group",
    Text = "text",
    Image = "image",
    Audio = "audio",
    Voice = "voice",
    Video = "video",
    Vtuber = "vtuber",
    Canvas = "canvas",
    Chart = "chart",
    Sticker = "sticker",
    Subtitle = "subtitle",
    Media = "media",
    SSML = "ssml"
}

interface ITransitionOptions {
    type?: string;
    duration?: number | string;
}

interface IFilterOptions {
    type?: string;
}

declare class Parser {
    static toXML(_template: Template, pretty?: boolean): string;
    static toBuffer(tempalte: Template): Buffer;
    static parseJSON(content: any, data?: {}, vars?: {}): Template;
    static parseJSONPreprocessing(content: any, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Template>;
    static parseSceneJSON(content: any, data?: {}, vars?: {}): Scene;
    static parseSceneJSONPreprocessing(content: any, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Scene>;
    static parseXMLObject(xmlObject: any, varsObject?: any, dataObject?: any, data?: {}, vars?: {}): {
        completeObject: any;
        data: {};
        vars: {};
    };
    static parseXML(content: string, data?: {}, vars?: {}): Template;
    static parseXMLPreprocessing(content: string, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Template>;
    static parseSceneXML(content: string, data?: {}, vars?: {}): Scene;
    static parseSceneXMLPreprocessing(content: string, data: {} | undefined, vars: {} | undefined, dataProcessor: any, varsProcessor: any): Promise<Scene>;
    static parseElementJSON(content: any, data?: {}, vars?: {}, extendsScript?: string): Element;
    static parseElementXML(content: string, data?: {}, vars?: {}, extendsScript?: string): Element;
    static convertXMLObject(obj: any, target?: any, jsonParse?: boolean): any;
}

declare class OldParser {
    static toXML(template: Template, pretty?: boolean): string;
    static toBuffer(template: Template): Buffer;
    static parseXML(content: string, data?: {}, vars?: {}): Template;
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
    constructor(options: IMediaOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
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
    isSubtitle?: boolean | string;
    styleType?: string;
    textShadow?: any;
    textStroke?: any;
    textBackground?: any;
    textFillColor?: string;
    fillColorIntension?: number | string;
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
    styleType?: string;
    isSubtitle: boolean;
    textShadow: any;
    textStroke: any;
    textBackground: any;
    textFillColor?: string;
    fillColorIntension?: number;
    constructor(options: ITextOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    rescale(scaleX: number, scaleY: number): void;
    static isInstance(value: any): boolean;
}

interface ICropOptions {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    style?: string;
    clipType?: string;
    clipStyle?: string;
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
    naturalWidth?: number | string;
    naturalHeight?: number | string;
}

declare class Crop {
    x: number;
    y: number;
    width: number;
    height: number;
    style: string;
    clipType?: string;
    clipStyle?: string;
    constructor(options: ICropOptions);
    toOptions(): {
        style: string;
        width: number;
        height: number;
        left: number;
        top: number;
        clipStyle: string | undefined;
        clipType: string | undefined;
    };
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
    naturalWidth?: number;
    naturalHeight?: number;
    constructor(options: IImageOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    static isInstance(value: any): boolean;
}

interface IAudioOptions extends IMediaOptions {
    isRecord?: boolean | string;
    fadeInDuration?: number | string;
    fadeOutDuration?: number | string;
}

declare class Audio extends Media {
    isRecord?: boolean;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    constructor(options: IAudioOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
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
    enableSubtitle?: boolean | string;
}

declare class Voice extends Media {
    static Provider: typeof VoiceProviders;
    provider: string;
    text?: string;
    declaimer?: string;
    sampleRate?: string;
    speechRate?: number;
    pitchRate?: number;
    enableSubtitle?: boolean;
    constructor(options: IVoiceOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    private generateSSML;
    resetEndTime(value: number): void;
    get ssml(): string | null | undefined;
    static isInstance(value: any): boolean;
}

interface IVideoOptions extends IMediaOptions {
    crop?: ICropOptions;
    demuxSrc?: string;
}

declare class Video extends Media {
    crop?: Crop;
    demuxSrc?: string;
    constructor(options: IVideoOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
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
    cutoutColor?: string;
    demuxSrc?: string;
}

declare class Vtuber extends Media {
    static Provider: typeof VtuberProviders;
    provider: string;
    text: string;
    solution: string;
    declaimer?: string;
    cutoutColor?: string;
    demuxSrc?: string;
    constructor(options: IVtuberOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    static isInstance(value: any): boolean;
}

interface ICanvasOptions extends IElementOptions {
    chartId?: string;
    poster?: string;
    duration?: number | string;
    configSrc?: string;
    dataSrc?: string;
}

interface IChartOptions extends ICanvasOptions {
}

declare class Canvas extends Element {
    chartId: string;
    configSrc: string;
    dataSrc: string;
    config: any;
    data: any;
    duration?: number;
    poster?: string;
    constructor(options: ICanvasOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    static isInstance(value: any): boolean;
}

declare class Chart extends Canvas {
    constructor(options: IChartOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    static isInstance(value: any): boolean;
}

interface IGroupOptions extends IElementOptions {
}

declare class Group extends Element {
    constructor(options: IGroupOptions, type?: ElementTypes, ...values: any[]);
    renderOldXML(parent: any, resources: any, global: any): any;
    static isInstance(value: any): boolean;
}

interface IStickerOptions extends IImageOptions {
    drawType?: string;
    editable?: boolean | string;
    distortable?: boolean | string;
}

declare class Sticker extends Image {
    drawType?: string;
    editable?: boolean;
    distortable?: boolean;
    constructor(options: IStickerOptions, type?: ElementTypes, ...values: any[]);
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    toOptions(): any;
    static isInstance(value: any): boolean;
}

declare type ISubtitleOptions = ITextOptions;

declare class Subtitle extends Text {
    constructor(options: ISubtitleOptions, type?: ElementTypes, ...values: any[]);
    static isInstance(value: any): boolean;
}

declare type ISSMLOptions = IElementOptions;

declare class SSML extends Element {
    #private;
    constructor(options: ISSMLOptions, type?: ElementTypes, ...values: any[]);
    init(provider: string): void;
    renderXML(parent: any): any;
    renderOldXML(parent: any, resources: any, global: any): any;
    get document(): Document | undefined;
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
type index_Canvas = Canvas;
declare const index_Canvas: typeof Canvas;
type index_Group = Group;
declare const index_Group: typeof Group;
type index_Sticker = Sticker;
declare const index_Sticker: typeof Sticker;
type index_Subtitle = Subtitle;
declare const index_Subtitle: typeof Subtitle;
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
    index_Canvas as Canvas,
    index_Group as Group,
    index_Sticker as Sticker,
    index_Subtitle as Subtitle,
    index_SSML as SSML,
  };
}

declare class OptionsParser {
    static toOptions(template: Template): any;
    static parseBaseOptions(obj: any, parentDuration?: number): {
        id: any;
        name: any;
        x: any;
        y: any;
        width: any;
        height: any;
        opacity: any;
        rotate: any;
        zIndex: any;
        strokeStyle: any;
        strokeColor: any;
        strokeWidth: any;
        enterEffect: {
            type: any;
            duration: number;
        } | undefined;
        exitEffect: {
            type: any;
            duration: number;
        } | undefined;
        backgroundColor: any;
        startTime: number;
        endTime: number | undefined;
    };
    static parseElementOptions(options: any, parentDuration?: number): Element;
    static parseSceneOptions(options: any, formObject?: any): Scene;
    static parseOptions(options: any, formObject?: any): Template;
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
    original?: any;
    duration: number;
    backgroundColor?: string;
    transition?: Transition;
    filter?: IFilterOptions;
    children: Element[];
    constructor(options: ISceneOptions, data?: {}, vars?: {}, extendsScript?: string, formObject?: any);
    appendChild(node: Element): void;
    setDuration(duration: number): void;
    toXML(pretty?: boolean): any;
    toOldXML(pretty?: boolean): any;
    toOptions(): any;
    renderXML(parent?: any): any;
    renderOldXML(parent?: any, resources?: any): any;
    static parse(content: any, data?: object, vars?: object): Scene;
    static parseAndProcessing(content: any, data?: object, vars?: object, dataProcessor?: any, varsProcessor?: any): Promise<Scene>;
    static parseJSON: typeof Parser.parseSceneJSON;
    static parseJSONPreprocessing: typeof Parser.parseSceneJSONPreprocessing;
    static parseXML: typeof Parser.parseSceneXML;
    static parseXMLPreprocessing: typeof Parser.parseSceneXMLPreprocessing;
    static parseOptions: typeof OptionsParser.parseSceneOptions;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    resize(width: number, height: number): void;
    generateTimeline(baseTime?: number): any;
    getFormInfo(): {
        source: any;
        rules: any[];
        formObject: any;
    } | null;
    resetEndTime(value: number): void;
    get sortedChildren(): Element[];
    get fontFamilys(): string[];
    set parent(obj: Template | undefined);
    get parent(): Template | undefined;
}

declare class Effect {
    type: string;
    duration: number;
    direction?: string;
    path?: number[];
    constructor(options: IEffectOptions);
    toOptions(startTime?: number): {
        name: string;
        delay: number;
        duration: number;
        direction: string | undefined;
        path: number[] | undefined;
    };
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
    strokeStyle?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fixedScale?: boolean;
    trackId?: string;
    value?: string;
    children: Element[];
    absoluteStartTime?: number;
    absoluteEndTime?: number;
    constructor(options: IElementOptions, type?: ElementTypes, data?: {}, vars?: {});
    getMaxDuration(): number;
    renderXML(parent?: any): any;
    renderOldXML(parent?: any, resources?: any, global?: any, skip?: boolean): any;
    toXML(pretty?: boolean): any;
    toOldXML(pretty?: boolean): any;
    static parse(content: any, data?: {}, vars?: {}): Element;
    static parseJSON: typeof Parser.parseElementJSON;
    static parseXML: typeof Parser.parseElementXML;
    static parseOptions: typeof OptionsParser.parseElementOptions;
    toOptions(): any;
    update(value: any): void;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    resize(width: number, height: number): void;
    rescale(scaleX: number, scaleY: number): void;
    resetEndTime(value: number): void;
    generateTimeline(baseTime: number | undefined, duration: number): any;
    set parent(obj: Template | Scene | Element | undefined);
    get parent(): Template | Scene | Element | undefined;
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
    strokeStyle?: string;
    strokeColor?: string;
    strokeWidth?: number | string;
    startTime?: number | string;
    endTime?: number | string;
    fixedScale?: boolean | string;
    trackId?: string;
    value?: string;
    compile?: boolean | string;
    children?: (Element | IElementOptions)[];
}

interface ISceneOptions {
    id?: string;
    name?: string;
    poster?: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    original?: any;
    duration?: number | string;
    backgroundColor?: string;
    transition?: ITransitionOptions;
    children?: (Element | IElementOptions)[];
    filter?: IFilterOptions;
    compile?: boolean | string;
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
    original?: any;
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
    captureTime?: number | string;
    createTime?: number;
    updateTime?: number;
    buildBy?: string;
    compile?: boolean;
    debug?: boolean;
    children?: (Scene | Element | ISceneOptions | IElementOptions)[];
}

declare class Template {
    #private;
    static readonly packageVersion = "1.1.78";
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
    original?: any;
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
    captureTime?: number;
    createTime: number;
    updateTime: number;
    buildBy: string;
    children: (Scene | Element)[];
    constructor(options: ITemplateOptions, data?: {}, vars?: {}, extendsScript?: string, formObject?: any);
    scenesSplice(start: number, end: number): void;
    appendChild(node: Scene | Element): void;
    toBASE64(): string;
    toOldBASE64(): string;
    toBuffer(): Buffer;
    toOldBuffer(): Buffer;
    toXML(pretty?: boolean): string;
    toOldXML(pretty?: boolean): string;
    toOptions(): any;
    static isId(value: any): boolean;
    static isInstance(value: any): boolean;
    static parse(content: any, data?: object, vars?: object): Template;
    static parseAndProcessing(content: any, data?: object, vars?: object, dataProcessor?: any, varsProcessor?: any): Promise<Template>;
    static parseJSON: typeof Parser.parseJSON;
    static parseJSONPreprocessing: typeof Parser.parseJSONPreprocessing;
    static parseXML: typeof Parser.parseXML;
    static parseXMLPreprocessing: typeof Parser.parseXMLPreprocessing;
    static parseOldXML: typeof OldParser.parseXML;
    static parseOptions: typeof OptionsParser.parseOptions;
    getFormInfo(): {
        source: any;
        rules: any[];
        formObject: any;
    } | null;
    resize(width: number, height: number): void;
    generateTimeline(): any;
    clone(): Template;
    get duration(): number;
    get sortedChilren(): (Element | Element[])[];
    get fontFamilys(): string[];
    get scenes(): Scene[];
    get elements(): Element[];
    get formObject(): any;
}

export { Scene, Template, index as elements };
