import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, Canvas, SSML } from '../elements';

class OptionsParser {

    public static toOptions(template: Template): any {
        let globalImage: Element | undefined;
        let globalVideo: Element | undefined;
        let globalAudio: Element | undefined;
        const children: Scene[] = [];
        template.children.forEach(node => {
            if (Element.isInstance(node)) {
                node = node as Element;
                if(node.isBackground) {
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

    public static parseOptions(options: any) {
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
                enterEffect: obj.animationIn && obj.animationIn.name !== "none" ? {
                    type: obj.animationIn.name,
                    duration: obj.animationIn.duration * 1000
                } : undefined,
                exitEffect: obj.animationOut && obj.animationOut.name !== "none" ? {
                    type: obj.animationOut.name,
                    duration: obj.animationOut.duration * 1000,
                } : undefined,
                backgroundColor: obj.fillColor,
                startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1000 : 0,
                endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1000 : 
                (parentDuration ? (parentDuration - (obj?.animationOut?.duration || 0)) * 1000 : undefined)
            };
        }
        options?.storyboards.forEach((board: any) => {
            const { id, poster, duration } = board;
            const sceneChildren: Element[] = [];
            board.bgImage && sceneChildren.push(new Image({
                ...buildBaseData(board.bgImage, duration),
                x: 0,
                y: 0,
                width: options.videoWidth,
                height: options.videoHeight,
                isBackground: true,
                src: board.bgImage.src
            }));
            board.bgVideo && sceneChildren.push(new Video({
                ...buildBaseData(board.bgVideo, duration),
                x: 0,
                y: 0,
                width: options.videoWidth,
                height: options.videoHeight,
                poster: board.bgVideo.poster,
                src: board.bgVideo.src,
                duration: board.bgVideo.duration ? board.bgVideo.duration * 1000 : undefined,
                volume: board.bgVideo.volume,
                muted: board.bgVideo.muted,
                loop: board.bgVideo.loop,
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
            board?.elements.forEach((element: any) => {
                switch (element.elementType) {
                    case "image":
                        sceneChildren.push(new Image({
                            ...buildBaseData(element, duration),
                            crop: element.crop ? {
                                style: element.crop.style,
                                x: element.crop.left,
                                y: element.crop.top,
                                width: element.crop.width,
                                height: element.crop.height,
                                clipType: element.crop.clipType,
                                clipStyle: element.crop.clipStyle
                            } : undefined,
                            src: element.src,
                            loop: element.loop,
                            dynamic: element.src.indexOf('.gif') !== -1,
                        }));
                        break;
                    case "text":
                        sceneChildren.push(new Text({
                            ...buildBaseData(element, duration),
                            width: element.width || element.renderWidth || 0,
                            height: element.height || element.renderHeight || 0,
                            value: element.content,
                            fontFamily: element.fontFamily ? element.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                            fontSize: element.fontSize,
                            fontColor: element.fontColor,
                            fontWeight: element.bold,
                            fontStyle: element.italic,
                            lineHeight: parseFloat((Number(element.lineHeight) / Number(element.fontSize)).toFixed(3)),
                            wordSpacing: element.wordSpacing,
                            textAlign: element.textAlign,
                            effectType: element.effectType,
                            effectWordDuration: element.effectWordDuration ? element.effectWordDuration * 1000 : undefined,
                            effectWordInterval: element.effectWordInterval ? element.effectWordInterval * 1000 : undefined,
                        }));
                        break;
                    case "audio":
                        sceneChildren.push(new Audio({
                            ...buildBaseData(element, duration),
                            src: element.src,
                            duration: element.duration ? element.duration * 1000 : undefined,
                            volume: element.volume,
                            muted: element.muted,
                            loop: element.loop,
                            seekStart: element.seekStart ? element.seekStart * 1000 : undefined,
                            seekEnd: element.seekEnd ? element.seekEnd * 1000 : undefined,
                            fadeInDuration: element.fadeInDuration ? element.fadeInDuration * 1000 : undefined,
                            fadeOutDuration: element.fadeOutDuration ? element.fadeOutDuration * 1000 : undefined,
                        }));
                        break;
                    case "voice":
                        sceneChildren.push(new Voice({
                            ...buildBaseData(element, duration),
                            src: element.src,
                            duration: element.duration ? element.duration * 1000 : undefined,
                            volume: element.volume,
                            seekStart: element.seekStart ? element.seekStart * 1000 : undefined,
                            seekEnd: element.seekEnd ? element.seekEnd * 1000 : undefined,
                            loop: element.loop,
                            muted: element.muted,
                            provider: element.provider,
                            children: element.ssml ? [
                                new SSML({
                                    value: element.ssml,
                                }),
                            ] : [],
                            text: element.text,
                            declaimer: element.voice,
                            speechRate: element.playbackRate ? element.playbackRate : undefined,
                            pitchRate: element.pitchRate ? Number(element.pitchRate) + 1 : undefined,
                        }));
                        break;
                    case "video":
                        sceneChildren.push(new Video({
                            ...buildBaseData(element, duration),
                            poster: element.poster,
                            src: element.src,
                            crop: element.crop ? {
                                style: element.crop.style,
                                x: element.crop.left,
                                y: element.crop.top,
                                width: element.crop.width,
                                height: element.crop.height,
                                clipType: element.crop.clipType,
                                clipStyle: element.crop.clipStyle
                            } : undefined,
                            duration: element.duration ? element.duration * 1000 : undefined,
                            volume: element.volume,
                            muted: element.muted,
                            loop: element.loop,
                            seekStart: element.seekStart ? element.seekStart * 1000 : undefined,
                            seekEnd: element.seekEnd ? element.seekEnd * 1000 : undefined,
                        }));
                        break;
                    case "chart":
                        sceneChildren.push(new Chart({
                            ...buildBaseData(element, duration),
                            chartId: element.chartId,
                            poster: element.poster,
                            duration: !util.isUndefined(element.duration) ? element.duration * 1000 : undefined,
                            configSrc: element.optionsPath,
                            dataSrc: element.dataPath,
                        }));
                        break;
                    case "canvas":
                        sceneChildren.push(new Canvas({
                            ...buildBaseData(element, duration),
                            poster: element.poster,
                            duration: !util.isUndefined(element.duration) ? element.duration * 1000 : undefined,
                            configSrc: element.optionsPath,
                            dataSrc: element.dataPath,
                        }));
                        break;
                    case "vtuber":
                        sceneChildren.push(new Vtuber({
                            ...buildBaseData(element, duration),
                            poster: element.poster,
                            src: element.src,
                            provider: element.provider,
                            text: element.text,
                            solution: element.solution,
                            declaimer: element.declaimer,
                            duration: element.duration ? element.duration * 1000 : undefined,
                            volume: element.volume,
                            muted: element.muted,
                            loop: element.loop,
                            seekStart: element.seekStart ? element.seekStart * 1000 : undefined,
                            seekEnd: element.seekEnd ? element.seekEnd * 1000 : undefined,
                        }));
                        break;
                }
            });
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
            x: 0,
            y: 0,
            width: options.videoWidth,
            height: options.videoHeight,
            isBackground: true,
            src: options.bgImage.src
        }));
        options.bgVideo && templateChildren.push(new Video({
            ...buildBaseData(options.bgVideo),
            x: 0,
            y: 0,
            width: options.videoWidth,
            height: options.videoHeight,
            poster: options.bgVideo.poster,
            src: options.bgVideo.src,
            duration: options.bgVideo.duration ? options.bgVideo.duration * 1000 : undefined,
            volume: options.bgVideo.volume,
            muted: options.bgVideo.muted,
            loop: options.bgVideo.loop,
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