import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, SSML } from '../elements';

class OptionsParser {

    public static toOptions(template: Template): any {
        let globalImage: Element | undefined;
        let globalVideo: Element | undefined;
        let globalAudio: Element | undefined;
        template.children.forEach(node => {
            if (!Element.isInstance(node)) return;
            node = node as Element;
            switch (node.type) {
                case 'image':
                    node.isBackground && (globalImage = node);
                    break;
                case 'video':
                    node.isBackground && (globalVideo = node);
                    break;
                case 'audio':
                    node.isBackground && (globalAudio = node);
                    break;
            }
        });
        const storyBoards: any[] = [];
        template.children.forEach(node => Scene.isInstance(node) && storyBoards.push(node.toOptions()))
        return {
            id: template.id,
            name: template.name,
            actuator: template.actuator,
            videoSize: template.aspectRatio,
            videoWidth: template.width,
            videoHeight: template.height,
            poster: template.poster,
            fps: template.fps,
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
        function buildBaseData(obj: any) {
            return {
                id: obj.id,
                name: obj.name,
                x: obj.left,
                y: obj.top,
                width: obj.width,
                height: obj.height,
                opacity: obj.opacity,
                zIndex: obj.index,
                enterEffect: obj.animationIn ? {
                    type: obj.animationIn.name,
                    duration: obj.animationIn.duration * 1000
                } : undefined,
                exitEffect: obj.animationOut ? {
                    type: obj.animationOut,
                    duration: obj.animationOutDuration * 1000,
                } : undefined,
                backgroundColor: obj.fillColor,
                startTime: obj.animationIn ? obj.animationIn.delay * 1000 : undefined,
                endTime: obj.animationOut ? obj.animationOut.delay * 1000 : undefined,
            };
        }
        options?.storyboards.forEach((board: any) => {
            const { id, poster, duration } = board;
            const sceneChildren: Element[] = [];
            board.bgImage && sceneChildren.push(new Image({
                ...buildBaseData(board.bgImage),
                x: 0,
                y: 0,
                width: options.videoWidth,
                height: options.videoHeight,
                isBackground: true,
                src: board.bgImage.src
            }));
            board.bgVideo && sceneChildren.push(new Video({
                ...buildBaseData(board.bgVideo),
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
                ...buildBaseData(board.bgMusic),
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
                            ...buildBaseData(element),
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
                            ...buildBaseData(element),
                            value: element.content,
                            fontFamily: element.fontFamily ? element.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                            fontSize: element.fontSize,
                            fontColor: element.fontColor,
                            fontWeight: element.bold ? 700 : undefined,
                            fontStyle: element.italic ? "italic" : undefined,
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
                            ...buildBaseData(element),
                            src: element.src,
                            duration: element.duration,
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
                            ...buildBaseData(element),
                            src: element.src,
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
                            ...buildBaseData(element),
                            poster: element.poster,
                            src: element.src,
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
                            ...buildBaseData(element),
                            chartId: element.chartId,
                            poster: element.poster,
                            configSrc: element.optionsPath,
                            dataSrc: element.dataPath,
                        }));
                        break;
                    case "vtuber":
                        sceneChildren.push(new Vtuber({
                            ...buildBaseData(element),
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
                    duration: board.transition.duration
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
            fps: options.fps,
            poster: options.poster,
            width: options.videoWidth,
            height: options.videoHeight,
            aspectRatio: options.videoSize,
            videoBitrate: options.videoBitrate,
            backgroundColor: options.bgColor ? (options.bgColor.fillColor || undefined) : undefined,
            children: templateChildren
        });
    }

}

export default OptionsParser;