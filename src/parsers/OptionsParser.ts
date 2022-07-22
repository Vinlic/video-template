import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, Canvas, SSML, Sticker, Group, Subtitle, Link } from '../elements';

class OptionsParser {

    public static toOptions(template: Template): any {
        let globalImage: Element | undefined;
        let globalVideo: Element | undefined;
        let globalAudio: Element | undefined;
        const children: Scene[] = [];
        template.children.forEach(node => {
            if (Element.isInstance(node)) {
                node = node as Element;
                if (node.isBackground) {
                    switch (node.type) {
                        case 'image':
                            globalImage = node;
                            break;
                        case 'video':
                            globalVideo = node;
                            break;
                        case 'audio':
                            globalAudio = node;
                            break;
                    }
                }
            }
            else
                children.push(node as Scene);
        });
        const storyBoards: any[] = [];
        children.forEach(node => storyBoards.push(node.toOptions()))
        return {
            id: template.id,
            name: template.name,
            actuator: template.actuator,
            videoSize: template.aspectRatio,
            videoWidth: template.width,
            videoHeight: template.height,
            original: template.original,
            poster: template.poster,
            fps: template.fps,
            captureTime: !util.isUndefined(template.captureTime) ? template.captureTime / 1000 : undefined,
            duration: util.millisecondsToSenconds(template.duration),
            videoBitrate: template.videoBitrate,
            audioBitrate: template.audioBitrate,
            // 全局背景颜色
            bgColor: { id: util.uniqid(), fillColor: template.backgroundColor },
            // 背景图片
            bgImage: globalImage ? globalImage.toOptions() : undefined,
            // 背景视频
            bgVideo: globalVideo ? globalVideo.toOptions() : undefined,
            // 背景音乐
            bgMusic: globalAudio ? globalAudio.toOptions() : undefined,
            // 视频故事板列表
            storyboards: storyBoards
        };
    }

    public static parseBaseOptions(obj: any, parentDuration?: number) {
        return {
            id: obj.id,
            name: obj.name || undefined,
            x: obj.left,
            y: obj.top,
            width: obj.width,
            height: obj.height,
            opacity: obj.opacity,
            rotate: obj.rotate,
            zIndex: obj.index,
            locked: obj.locked,
            strokeStyle: obj.strokeStyle,
            strokeColor: obj.strokeColor,
            strokeWidth: obj.strokeWidth,
            enterEffect: obj.animationIn && obj.animationIn.name && obj.animationIn.name !== "none" ? {
                type: obj.animationIn.name,
                direction: obj.animationIn.direction,
                duration: obj.animationIn.duration * 1000
            } : undefined,
            exitEffect: obj.animationOut && obj.animationOut.name && obj.animationOut.name !== "none" ? {
                type: obj.animationOut.name,
                direction: obj.animationIn.direction,
                duration: obj.animationOut.duration * 1000,
            } : undefined,
            backgroundColor: obj.fillColor,
            startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1000 : 0,
            endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1000 :
                (parentDuration ? parentDuration * 1000 : undefined)
        };
    }

    public static parseElementOptions(options: any, parentDuration?: number): Element {
        if (util.isString(options))
            options = JSON.parse(options);
        switch (options.elementType) {
            case "image":
                return new Image({
                    ...this.parseBaseOptions(options, parentDuration),
                    crop: options.crop ? {
                        style: options.crop.style,
                        x: options.crop.left,
                        y: options.crop.top,
                        width: options.crop.width,
                        height: options.crop.height,
                        clipType: options.crop.clipType,
                        clipStyle: options.crop.clipStyle
                    } : undefined,
                    src: options.src,
                    loop: options.loop,
                    dynamic: options.src.indexOf('.gif') !== -1,
                    naturalWidth: options.naturalWidth,
                    naturalHeight: options.naturalHeight
                });
            case "sticker":
                return new Sticker({
                    ...this.parseBaseOptions(options, parentDuration),
                    src: options.src,
                    loop: options.loop,
                    drawType: options.drawType,
                    editable: options.editable,
                    distortable: options.distortable
                });
            case "text":
                return new Text({
                    ...this.parseBaseOptions(options, parentDuration),
                    width: options.width || options.renderWidth || 0,
                    height: options.height || options.renderHeight || 0,
                    value: options.content,
                    fontFamily: options.fontFamily ? options.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                    fontSize: options.fontSize,
                    fontColor: options.fontColor,
                    fontWeight: options.bold,
                    fontStyle: options.italic === "italic" ? "italic" : undefined,
                    lineHeight: parseFloat((Number(options.lineHeight) / Number(options.fontSize)).toFixed(3)),
                    wordSpacing: options.wordSpacing,
                    textAlign: options.textAlign,
                    textEnterEffect: options.textEnterEffect ? {
                        type: options.textEnterEffect.type,
                        wordInterval: options.textEnterEffect.wordInterval ? options.textEnterEffect.wordInterval * 1000 : undefined,
                        wordDuration: options.textEnterEffect.wordDuration ? options.textEnterEffect.wordDuration * 1000 : undefined,
                        duration: options.textEnterEffect.duration ? options.textEnterEffect.duration * 1000 : undefined,
                        direction: options.textEnterEffect.direction
                    } : undefined,
                    textExitEffect: options.textExitEffect ? {
                        type: options.textExitEffect.type,
                        wordInterval: options.textExitEffect.wordInterval ? options.textExitEffect.wordInterval * 1000 : undefined,
                        wordDuration: options.textExitEffect.wordDuration ? options.textExitEffect.wordDuration * 1000 : undefined,
                        duration: options.textExitEffect.duration ? options.textExitEffect.duration * 1000 : undefined,
                        direction: options.textExitEffect.direction
                    } : undefined,
                    // effectType: options.effectType,
                    // effectWordDuration: options.effectWordDuration ? options.effectWordDuration * 1000 : undefined,
                    // effectWordInterval: options.effectWordInterval ? options.effectWordInterval * 1000 : undefined,
                    styleType: options.styleType === "" ? undefined : options.styleType,
                    isSubtitle: options.isSubtitle,
                    textShadow: util.omitBy(options.textShadow, v => util.isNil(v) || v === 0 || v === ""),
                    textStroke: util.omitBy(options.textStroke, v => util.isNil(v) || v === 0 || v === ""),
                    textBackground: options.textBackground === "" ? undefined : options.textBackground,
                    textFillColor: options.textFillColor === "" ? undefined : options.textFillColor,
                    fillColorIntension: options.fillColorIntension === 0 ? undefined : options.fillColorIntension
                });
            case "audio":
                return new Audio({
                    ...this.parseBaseOptions(options, parentDuration),
                    src: options.src,
                    duration: options.duration ? options.duration * 1000 : undefined,
                    volume: options.volume,
                    muted: options.muted,
                    loop: options.loop,
                    seekStart: options.seekStart ? options.seekStart * 1000 : undefined,
                    seekEnd: options.seekEnd ? options.seekEnd * 1000 : undefined,
                    isRecord: options.isRecord,
                    fadeInDuration: options.fadeInDuration ? options.fadeInDuration * 1000 : undefined,
                    fadeOutDuration: options.fadeOutDuration ? options.fadeOutDuration * 1000 : undefined,
                });
            case "voice":
                return new Voice({
                    ...this.parseBaseOptions(options, parentDuration),
                    src: options.src,
                    duration: options.duration ? options.duration * 1000 : undefined,
                    volume: options.volume,
                    seekStart: options.seekStart ? options.seekStart * 1000 : undefined,
                    seekEnd: options.seekEnd ? options.seekEnd * 1000 : undefined,
                    loop: options.loop,
                    muted: options.muted,
                    provider: options.provider,
                    children: options.ssml ? [
                        new SSML({
                            value: options.ssml,
                        }),
                    ] : [],
                    text: options.text,
                    declaimer: options.voice,
                    speechRate: options.playbackRate ? options.playbackRate : undefined,
                    pitchRate: options.pitchRate ? Number(options.pitchRate) + 1 : undefined,
                });
            case "video":
                return new Video({
                    ...this.parseBaseOptions(options, parentDuration),
                    poster: options.poster,
                    src: options.src,
                    crop: options.crop ? {
                        style: options.crop.style,
                        x: options.crop.left,
                        y: options.crop.top,
                        width: options.crop.width,
                        height: options.crop.height,
                        clipType: options.crop.clipType,
                        clipStyle: options.crop.clipStyle
                    } : undefined,
                    duration: options.duration ? options.duration * 1000 : undefined,
                    volume: options.volume,
                    muted: options.muted,
                    loop: options.loop,
                    seekStart: options.seekStart ? options.seekStart * 1000 : undefined,
                    seekEnd: options.seekEnd ? options.seekEnd * 1000 : undefined,
                    demuxSrc: options.demuxSrc
                });
            case "chart":
                return new Chart({
                    ...this.parseBaseOptions(options, parentDuration),
                    chartId: options.chartId,
                    poster: options.poster,
                    duration: !util.isUndefined(options.duration) ? options.duration * 1000 : undefined,
                    configSrc: options.optionsPath,
                    dataSrc: options.dataPath,
                });
            case "canvas":
                return new Canvas({
                    ...this.parseBaseOptions(options, parentDuration),
                    chartId: options.chartId,
                    poster: options.poster,
                    duration: !util.isUndefined(options.duration) ? options.duration * 1000 : undefined,
                    configSrc: options.optionPath,
                    dataSrc: options.dataPath,
                });
            case "vtuber":
                return new Vtuber({
                    ...this.parseBaseOptions(options, parentDuration),
                    poster: options.poster,
                    src: options.src,
                    provider: options.provider,
                    text: options.text,
                    solution: options.solution,
                    declaimer: options.declaimer,
                    cutoutColor: options.cutoutColor,
                    duration: options.duration ? options.duration * 1000 : undefined,
                    volume: options.volume,
                    muted: options.muted,
                    loop: options.loop,
                    seekStart: options.seekStart ? options.seekStart * 1000 : undefined,
                    seekEnd: options.seekEnd ? options.seekEnd * 1000 : undefined,
                    demuxSrc: options.demuxSrc
                });
            case "group":
                return new Group({
                    ...this.parseBaseOptions(options, parentDuration),
                    children: (options.children || options.elements)?.map((element: any) => this.parseElementOptions(element, parentDuration))
                });
            case "subtitle":
                return new Subtitle({
                    ...this.parseBaseOptions(options, parentDuration),
                    children: (options.children || options.elements)?.map((element: any) => this.parseElementOptions(element, parentDuration))
                });
            case "link":
                return new Link({
                    ...this.parseBaseOptions(options, parentDuration),
                    __type: options.type,
                    target: options.target,
                    trigger: options.trigger,
                    modal: options.modal,
                    params: options.params,
                    enter: options.enter,
                    exit: options.exit,
                    children: (options.children || options.elements)?.map((element: any) => this.parseElementOptions(element, parentDuration))
                })
            default:
                return new Element({});
        }
    }

    public static parseSceneOptions(options: any, formObject?: any) {
        if (util.isString(options))
            options = JSON.parse(options);
        const children: Element[] = [];
        const { id, poster, duration } = options;
        options.bgImage && children.push(new Image({
            ...this.parseBaseOptions(options.bgImage, duration),
            endTime: undefined,
            isBackground: true,
            src: options.bgImage.src,
            naturalWidth: options.bgImage.naturalWidth,
            naturalHeight: options.bgImage.naturalHeight
        }));
        options.bgVideo && children.push(new Video({
            ...this.parseBaseOptions(options.bgVideo, duration),
            poster: options.bgVideo.poster,
            src: options.bgVideo.src,
            duration: options.bgVideo.duration ? options.bgVideo.duration * 1000 : undefined,
            volume: options.bgVideo.volume,
            muted: options.bgVideo.muted,
            loop: options.bgVideo.loop,
            endTime: undefined,
            isBackground: true,
            seekStart: options.bgVideo.seekStart ? options.bgVideo.seekStart * 1000 : undefined,
            seekEnd: options.bgVideo.seekEnd ? options.bgVideo.seekEnd * 1000 : undefined
        }));
        options.bgMusic && children.push(new Audio({
            ...this.parseBaseOptions(options.bgMusic, duration),
            src: options.bgMusic.src,
            volume: options.bgMusic.volume,
            duration: options.bgMusic.duration ? options.bgMusic.duration * 1000 : undefined,
            seekStart: options.bgMusic.seekStart ? options.bgMusic.seekStart * 1000 : undefined,
            seekEnd: options.bgMusic.seekEnd ? options.bgMusic.seekEnd * 1000 : undefined,
            muted: options.bgMusic.muted,
            loop: options.bgMusic.loop,
            isBackground: true,
            fadeInDuration: options.bgMusic.fadeInDuration ? options.bgMusic.fadeInDuration * 1000 : undefined,
            fadeOutDuration: options.bgMusic.fadeOutDuration ? options.bgMusic.fadeOutDuration * 1000 : undefined,
        }));
        (options.children || options.elements)?.forEach((element: any) => children.push(this.parseElementOptions(element, duration)));
        return new Scene({
            id,
            poster,
            width: options.videoWidth,
            height: options.videoHeight,
            aspectRatio: options.videoSize,
            original: options.original,
            duration: duration * 1000,
            backgroundColor: options.bgColor ? options.bgColor.fillColor : undefined,
            transition: options.transition ? {
                type: options.transition.name,
                duration: options.transition.duration * 1000
            } : undefined,
            filter: undefined,
            compile: options.compile,
            children
        }, undefined, undefined, undefined, formObject);
    }

    public static parseOptions(options: any, formObject?: any) {
        if (util.isString(options))
            options = JSON.parse(options);
        const children: (Scene | Element)[] = [];
        options?.storyboards.map((board: any) => children.push(this.parseSceneOptions(board)));
        options.bgImage && children.push(new Image({
            ...this.parseBaseOptions(options.bgImage),
            endTime: undefined,
            isBackground: true,
            src: options.bgImage.src,
            naturalWidth: options.bgImage.naturalWidth,
            naturalHeight: options.bgImage.naturalHeight
        }));
        options.bgVideo && children.push(new Video({
            ...this.parseBaseOptions(options.bgVideo),
            poster: options.bgVideo.poster,
            src: options.bgVideo.src,
            duration: options.bgVideo.duration ? options.bgVideo.duration * 1000 : undefined,
            volume: options.bgVideo.volume,
            muted: options.bgVideo.muted,
            loop: options.bgVideo.loop,
            endTime: undefined,
            isBackground: true,
            seekStart: options.bgVideo.seekStart ? options.bgVideo.seekStart * 1000 : undefined,
            seekEnd: options.bgVideo.seekEnd ? options.bgVideo.seekEnd * 1000 : undefined
        }));
        options.bgMusic && children.push(new Audio({
            ...this.parseBaseOptions(options.bgMusic),
            src: options.bgMusic.src,
            volume: options.bgMusic.volume,
            duration: options.bgMusic.duration ? options.bgMusic.duration * 1000 : undefined,
            seekStart: options.bgMusic.seekStart ? options.bgMusic.seekStart * 1000 : undefined,
            seekEnd: options.bgMusic.seekEnd ? options.bgMusic.seekEnd * 1000 : undefined,
            muted: options.bgMusic.muted,
            loop: options.bgMusic.loop,
            isBackground: true,
            fadeInDuration: options.bgMusic.fadeInDuration ? options.bgMusic.fadeInDuration * 1000 : undefined,
            fadeOutDuration: options.bgMusic.fadeOutDuration ? options.bgMusic.fadeOutDuration * 1000 : undefined,
        }));
        return new Template({
            id: options.id,
            name: options.name,
            actuator: options.actuator || undefined,
            fps: options.fps,
            poster: options.poster,
            width: options.videoWidth,
            height: options.videoHeight,
            aspectRatio: options.videoSize,
            original: options.original,
            videoBitrate: `${options.videoBitrate}`,
            audioBitrate: `${options.audioBitrate}`,
            backgroundColor: options.bgColor ? (options.bgColor.fillColor || undefined) : undefined,
            captureTime: util.isFinite(options.captureTime) ? options.captureTime * 1000 : undefined,
            compile: options.compile,
            children
        }, undefined, undefined, undefined, formObject);
    }

}

export default OptionsParser;