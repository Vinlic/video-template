import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, Canvas, SSML, Sticker, Group, Subtitle } from '../elements';

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

    public static parseElementOptions(options: any, parentDuration?: number): Element {
        if (util.isString(options))
            options = JSON.parse(options);
        function buildBaseData(obj: any, parentDuration?: number) {
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
                borderStyle: obj.borderStyle,
                strokeColor: obj.strokeColor,
                strokeWidth: obj.strokeWidth,
                enterEffect: obj.animationIn && obj.animationIn.name && obj.animationIn.name !== "none" ? {
                    type: obj.animationIn.name,
                    duration: obj.animationIn.duration * 1000
                } : undefined,
                exitEffect: obj.animationOut && obj.animationOut.name && obj.animationOut.name !== "none" ? {
                    type: obj.animationOut.name,
                    duration: obj.animationOut.duration * 1000,
                } : undefined,
                backgroundColor: obj.fillColor,
                startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1000 : 0,
                endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1000 :
                    (parentDuration ? parentDuration * 1000 : undefined)
            };
        }
        switch (options.elementType) {
            case "image":
                return new Image({
                    ...buildBaseData(options, parentDuration),
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
                });
            case "sticker":
                return new Sticker({
                    ...buildBaseData(options, parentDuration),
                    src: options.src,
                    loop: options.loop,
                    drawType: options.drawType,
                    editable: options.editable,
                    distortable: options.distortable
                });
            case "text":
                return new Text({
                    ...buildBaseData(options, parentDuration),
                    width: options.width || options.renderWidth || 0,
                    height: options.height || options.renderHeight || 0,
                    value: options.content,
                    fontFamily: options.fontFamily ? options.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                    fontSize: options.fontSize,
                    fontColor: options.fontColor,
                    fontWeight: options.bold,
                    fontStyle: options.italic === "italic" ? "italic" : undefined,
                    lineHeight: parseFloat((Number(options.lineHeight) / Number(options.fontSize)).toFixed(3)),
                    wordSpacing: options.wordSpacig,
                    textAlign: options.textAlign,
                    effectType: options.effectType,
                    effectWordDuration: options.effectWordDuration ? options.effectWordDuration * 1000 : undefined,
                    effectWordInterval: options.effectWordInterval ? options.effectWordInterval * 1000 : undefined,
                    styleType: options.styleType,
                    textShadow: options.textShadow,
                    textStroke: options.textStroke,
                    textBackground: options.textBackground,
                    textFillColor: options.textFillColor,
                    fillColorIntension: options.fillColorIntension
                });
            case "audio":
                return new Audio({
                    ...buildBaseData(options, parentDuration),
                    src: options.src,
                    duration: options.duration ? options.duration * 1000 : undefined,
                    volume: options.volume,
                    muted: options.muted,
                    loop: options.loop,
                    seekStart: options.seekStart ? options.seekStart * 1000 : undefined,
                    seekEnd: options.seekEnd ? options.seekEnd * 1000 : undefined,
                    fadeInDuration: options.fadeInDuration ? options.fadeInDuration * 1000 : undefined,
                    fadeOutDuration: options.fadeOutDuration ? options.fadeOutDuration * 1000 : undefined,
                });
            case "voice":
                return new Voice({
                    ...buildBaseData(options, parentDuration),
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
                    ...buildBaseData(options, parentDuration),
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
                    ...buildBaseData(options, parentDuration),
                    chartId: options.chartId,
                    poster: options.poster,
                    duration: !util.isUndefined(options.duration) ? options.duration * 1000 : undefined,
                    configSrc: options.optionsPath,
                    dataSrc: options.dataPath,
                });
            case "canvas":
                return new Canvas({
                    ...buildBaseData(options, parentDuration),
                    chartId: options.chartId,
                    poster: options.poster,
                    duration: !util.isUndefined(options.duration) ? options.duration * 1000 : undefined,
                    configSrc: options.optionPath,
                    dataSrc: options.dataPath,
                });
            case "vtuber":
                return new Vtuber({
                    ...buildBaseData(options, parentDuration),
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
                    ...buildBaseData(options, parentDuration),
                    children: (options.children || options.elements)?.map((element: any) => this.parseElementOptions(element, parentDuration))
                });
            case "subtitle":
                return new Subtitle({
                    ...buildBaseData(options, parentDuration),
                    children: (options.children || options.elements)?.map((element: any) => this.parseElementOptions(element, parentDuration))
                });
            default:
                return new Element({});
        }
    }

    public static parseOptions(options: any) {
        if (util.isString(options))
            options = JSON.parse(options);
        const templateChildren: (Scene | Element)[] = [];
        function buildBaseData(obj: any, parentDuration?: number) {
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
                borderStyle: obj.borderStyle,
                strokeColor: obj.strokeColor,
                strokeWidth: obj.strokeWidth,
                enterEffect: obj.animationIn && obj.animationIn.name && obj.animationIn.name !== "none" ? {
                    type: obj.animationIn.name,
                    duration: obj.animationIn.duration * 1000
                } : undefined,
                exitEffect: obj.animationOut && obj.animationOut.name && obj.animationOut.name !== "none" ? {
                    type: obj.animationOut.name,
                    duration: obj.animationOut.duration * 1000,
                } : undefined,
                backgroundColor: obj.fillColor,
                startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1000 : 0,
                endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1000 :
                    (parentDuration ? parentDuration * 1000 : undefined)
            };
        }
        options?.storyboards.forEach((board: any) => {
            const { id, poster, duration } = board;
            const sceneChildren: Element[] = [];
            board.bgImage && sceneChildren.push(new Image({
                ...buildBaseData(board.bgImage, duration),
                endTime: undefined,
                isBackground: true,
                src: board.bgImage.src
            }));
            board.bgVideo && sceneChildren.push(new Video({
                ...buildBaseData(board.bgVideo, duration),
                poster: board.bgVideo.poster,
                src: board.bgVideo.src,
                duration: board.bgVideo.duration ? board.bgVideo.duration * 1000 : undefined,
                volume: board.bgVideo.volume,
                muted: board.bgVideo.muted,
                loop: board.bgVideo.loop,
                endTime: undefined,
                isBackground: true,
                seekStart: board.bgVideo.seekStart ? board.bgVideo.seekStart * 1000 : undefined,
                seekEnd: board.bgVideo.seekEnd ? board.bgVideo.seekEnd * 1000 : undefined
            }));
            board.bgMusic && templateChildren.push(new Audio({
                ...buildBaseData(board.bgMusic, duration),
                src: board.bgMusic.src,
                volume: board.bgMusic.volume,
                duration: board.bgMusic.duration ? board.bgMusic.duration * 1000 : undefined,
                seekStart: board.bgMusic.seekStart ? board.bgMusic.seekStart * 1000 : undefined,
                seekEnd: board.bgMusic.seekEnd ? board.bgMusic.seekEnd * 1000 : undefined,
                muted: board.bgMusic.muted,
                loop: board.bgMusic.loop,
                isBackground: true,
                fadeInDuration: board.bgMusic.fadeInDuration ? board.bgMusic.fadeInDuration * 1000 : undefined,
                fadeOutDuration: board.bgMusic.fadeOutDuration ? board.bgMusic.fadeOutDuration * 1000 : undefined,
            }));
            (board.children || board.elements)?.forEach((element: any) => sceneChildren.push(this.parseElementOptions(element, duration)));
            templateChildren.push(new Scene({
                id,
                poster,
                width: options.videoWidth,
                height: options.videoHeight,
                aspectRatio: options.videoSize,
                duration: duration * 1000,
                backgroundColor: board.bgColor ? board.bgColor.fillColor : undefined,
                transition: board.transition ? {
                    type: board.transition.name,
                    duration: board.transition.duration * 1000
                } : undefined,
                filter: undefined,
                children: sceneChildren,
            }));
        });
        options.bgImage && templateChildren.push(new Image({
            ...buildBaseData(options.bgImage),
            endTime: undefined,
            isBackground: true,
            src: options.bgImage.src
        }));
        options.bgVideo && templateChildren.push(new Video({
            ...buildBaseData(options.bgVideo),
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
        options.bgMusic && templateChildren.push(new Audio({
            ...buildBaseData(options.bgMusic),
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
            videoBitrate: `${options.videoBitrate}`,
            audioBitrate: `${options.audioBitrate}`,
            backgroundColor: options.bgColor ? (options.bgColor.fillColor || undefined) : undefined,
            captureTime: util.isFinite(options.captureTime) ? options.captureTime * 1000 : undefined,
            compile: options.compile,
            children: templateChildren
        });
    }

}

export default OptionsParser;