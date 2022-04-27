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
        options.storyboards.forEach((board: any) => {
            const { id, poster, duration } = board;
            const sceneChildren: Element[] = [];
            let sceneBackgroundColor;
            let transition;

            templateChildren.push(new Scene({
                id,
                poster,
                width: options.videoWidth,
                height: options.videoHeight,
                aspectRatio: options.videoSize,
                duration: duration * 1000,
                backgroundColor: sceneBackgroundColor,
                transition,
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
            src: options.src
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