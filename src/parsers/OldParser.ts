import { create } from 'xmlbuilder2';
import { XMLParser } from 'fast-xml-parser';

import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, SSML } from '../elements';

const xmlParser = new XMLParser({
    allowBooleanAttributes: true, //需要解析布尔值属性
    ignoreAttributes: false, //不要忽略属性
    attributeNamePrefix: '', //属性名称不拼接前缀
    preserveOrder: true, //保持原始文档标签顺序
    parseTagValue: false, //不解析标签内值
    stopNodes: ['template.scene.voice.ssml'], //解析到ssml标签为止不要继续往下解析
});

class OldParser {

    public static toXML(template: Template, pretty = false) {
        const root = create({ version: "1.0" });
        const project = root.ele("project", {
            version: "1.0.0",
            id: template.id,
            name: template.name,
            actuator: template.actuator
        });
        const resources: { [map: string]: any } = project.ele('projRes');
        resources.map = {};
        const global = project.ele('global', {
            videoSize: template.aspectRatio,
            videoWidth: template.width,
            videoHeight: template.height,
            poster: template.poster,
            fps: template.fps,
            captureTime: !util.isUndefined(template.captureTime) ? template.captureTime / 1000 : undefined,
            videoBitrate: 2097152,
            audioBitrate: 131072,
        });
        if (template.backgroundColor) {
            global.ele('bgblock', {
                id: util.uniqid(),
                inPoint: 0,
                fillColor: template.backgroundColor,
            });
        }
        const storyBoards = project.ele('storyBoards');
        template.children.forEach((node) => node.renderOldXML(storyBoards, resources, global)); //子节点XML渲染
        return project.end({ prettyPrint: pretty });
    }

    /**
     * 转换为旧缓冲区
     * 
     * @returns {Buffer} 缓冲区
     */
    public static toBuffer(template: Template) {
        return Buffer.from(this.toXML(template));
    }

    public static parseXML(content: string, data = {}, vars = {}) {
        const xmlObject = xmlParser.parse(content);
        function merge(obj: any, target: any = {}) {
            Object.assign(target, obj[':@']);
            const key = Object.keys(obj).filter((k) => k != ':@')[0];
            target.key = key;
            if (key === '#text') return obj[key];
            const items = obj[key];
            target.children = items.map((v: any) => v && merge(v, {}));
            return target;
        }
        const rawObject = merge(xmlObject[1] || xmlObject[0]);
        const {
            type,
            name,
            actuator,
            compile,
            children: [projRes, global, storyBoards],
        } = rawObject;
        const resourceMap: any = {};
        projRes.children.forEach((resource: any) => (resourceMap[resource.id] = resource));
        function buildBaseData(obj: any, parentDuration?: number) {
            return {
                id: obj.id,
                name: obj.name,
                x: obj.scaleX,
                y: obj.scaleY,
                width: obj.width,
                height: obj.height,
                opacity: obj.opacity,
                zIndex: obj.index,
                strokeStyle: obj.strokeStyle,
                strokeColor: obj.strokeColor,
                strokeWidth: obj.strokeWidth,
                enterEffect: obj.animationIn ? {
                    type: obj.animationIn,
                    duration: obj.animationInDuration * 1000
                } : undefined,
                exitEffect: obj.animationOut ? {
                    type: obj.animationOut,
                    duration: obj.animationOutDuration * 1000,
                } : undefined,
                backgroundColor: obj.fillColor || undefined,
                startTime: Number(obj.inPoint) ? Number(obj.inPoint) * 1000 : 0,
                endTime: Number(obj.outPoint) ? Number(obj.outPoint) * 1000 : (parentDuration ? parentDuration * 1000 : undefined),
            };
        }
        const templateChildren: (Scene | Element)[] = [];
        let templateBackgroundColor;
        global.children.forEach((tag: any) => {
            switch (tag.key) {
                case 'bgblock':
                    templateBackgroundColor = tag.fillColor;
                    break;
                case 'bgimg':
                    templateChildren.push(
                        new Image({
                            ...buildBaseData(tag),
                            x: 0,
                            y: 0,
                            width: global.videoWidth,
                            height: global.videoHeight,
                            endTime: undefined,
                            isBackground: true,
                            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
                        }),
                    );
                    break;
                case 'bgmusic':
                    templateChildren.push(
                        new Audio({
                            ...buildBaseData(tag),
                            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
                            volume: tag.volume,
                            duration: tag.duration ? tag.duration * 1000 : undefined,
                            seekStart: tag.seekStart ? tag.seekStart * 1000 : undefined,
                            seekEnd: tag.seekEnd ? tag.seekEnd * 1000 : undefined,
                            muted: tag.muted,
                            loop: tag.loop,
                            isBackground: true,
                            fadeInDuration: tag.inPoint ? tag.inPoint * 1000 : undefined,
                            fadeOutDuration: tag.outPoint ? tag.outPoint * 1000 : undefined,
                        }),
                    );
                    break;
                case 'bgvideo':
                    templateChildren.push(
                        new Video({
                            ...buildBaseData(tag),
                            x: 0,
                            y: 0,
                            width: global.videoWidth,
                            height: global.videoHeight,
                            poster: tag.poster,
                            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : undefined,
                            duration: tag.duration ? tag.duration * 1000 : undefined,
                            volume: tag.volume,
                            muted: tag.muted,
                            loop: tag.loop,
                            endTime: undefined,
                            isBackground: true,
                            seekStart: tag.seekStart ? tag.seekStart * 1000 : undefined,
                            seekEnd: tag.seekEnd ? tag.seekEnd * 1000 : undefined,
                            demuxSrc: tag.demuxSrc
                        }),
                    );
                    break;
            }
        });
        storyBoards.children.forEach((board: any) => {
            const { id, poster, duration } = board;
            const sceneChildren: Element[] = [];
            let sceneBackgroundColor;
            let transition;
            board.children.forEach((data: any) => {
                switch (data.key) {
                    case 'bgblock':
                        sceneBackgroundColor = data.fillColor;
                        break;
                    case 'bgimg':
                        sceneChildren.push(
                            new Image({
                                ...buildBaseData(data, duration),
                                x: 0,
                                y: 0,
                                width: global.videoWidth,
                                height: global.videoHeight,
                                endTime: undefined,
                                isBackground: true,
                                src: resourceMap[data.resId] ? resourceMap[data.resId].resPath : undefined,
                            }),
                        );
                        break;
                    case 'bgvideo':
                        sceneChildren.push(
                            new Video({
                                ...buildBaseData(data, duration),
                                x: 0,
                                y: 0,
                                width: global.videoWidth,
                                height: global.videoHeight,
                                poster: data.poster,
                                src: resourceMap[data.resId] ? resourceMap[data.resId].resPath : undefined,
                                duration: data.duration ? data.duration * 1000 : undefined,
                                volume: data.volume,
                                muted: data.muted,
                                loop: data.loop,
                                endTime: undefined,
                                isBackground: true,
                                seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                                seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
                            }),
                        );
                        break;
                    case 'transition':
                        transition = {
                            type: data.name,
                            duration: data.duration * 1000,
                        };
                        break;
                    case 'captions':
                        data.children.forEach((caption: any) => sceneChildren.push(new Text({
                            ...buildBaseData(caption, duration),
                            value: caption.children[0]?.children.join('\n'),
                            fontFamily: caption.fontFamily ? caption.fontFamily.replace(/\.ttf|\.otf$/, '') : undefined,
                            fontSize: caption.fontSize,
                            fontColor: caption.fontColor,
                            fontWeight: caption.bold ? 700 : undefined,
                            fontStyle: caption.italic ? "italic" : undefined,
                            lineHeight: parseFloat((Number(caption.lineHeight) / Number(caption.fontSize)).toFixed(3)),
                            wordSpacing: caption.wordSpacing,
                            textAlign: caption.textAlign,
                            effectType: caption.effectType,
                            effectWordDuration: caption.effectWordDuration ? caption.effectWordDuration * 1000 : undefined,
                            effectWordInterval: caption.effectWordInterval ? caption.effectWordInterval * 1000 : undefined,
                            styleType: caption.styleType,
                            textShadow: caption.textShadow,
                            textStroke: caption.textStroke,
                            textBackground: caption.textBackground,
                            textFillColor: caption.textFillColor,
                            fillColorIntension: caption.fillColorIntension
                        })));
                        break;
                    case 'resources':
                        data.children.forEach((tag: any) => {
                            if (!resourceMap[tag.resId]) return;
                            const { type, resPath } = resourceMap[tag.resId];
                            let element;
                            switch (type) {
                                case 'img':
                                case 'gif':
                                    element = new Image({
                                        ...buildBaseData(tag, duration),
                                        crop: tag.cropStyle ? {
                                            style: tag.cropStyle === 'circle' ? 'circle' : 'rect',
                                            x: tag.cropX,
                                            y: tag.cropY,
                                            width: tag.cropWidth,
                                            height: tag.cropHeight,
                                        } : undefined,
                                        src: resPath,
                                        loop: tag.loop,
                                        dynamic: resPath.indexOf('.gif') !== -1 ? true : type === 'gif',
                                    });
                                    break;
                                case 'video':
                                    element = new Video({
                                        ...buildBaseData(tag, duration),
                                        poster: data.poster,
                                        src: resPath,
                                        crop: tag.cropStyle ? {
                                            style: tag.cropStyle === 'circle' ? 'circle' : 'rect',
                                            x: tag.cropX,
                                            y: tag.cropY,
                                            width: tag.cropWidth,
                                            height: tag.cropHeight,
                                        } : undefined,
                                        duration: data.duration ? data.duration * 1000 : undefined,
                                        volume: data.volume,
                                        muted: data.muted,
                                        loop: data.loop,
                                        seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                                        seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
                                        demuxSrc: data.demuxSrc
                                    });
                                    break;
                                case 'sound':
                                    element = new Audio({
                                        ...buildBaseData(tag, duration),
                                        src: resPath,
                                        duration: data.duration,
                                        volume: data.volume,
                                        muted: data.muted,
                                        loop: data.loop,
                                        seekStart: data.seekStart ? data.seekStart * 1000 : undefined,
                                        seekEnd: data.seekEnd ? data.seekEnd * 1000 : undefined,
                                        fadeInDuration: data.inPoint ? data.inPoint * 1000 : undefined,
                                        fadeOutDuration: data.outPoint ? data.outPoint * 1000 : undefined,
                                    });
                            }
                            element && sceneChildren.push(element);
                        });
                        break;
                    case 'dynDataCharts':
                        data.children.forEach((chart: any) => sceneChildren.push(
                            new Chart({
                                ...buildBaseData(chart, duration),
                                chartId: chart.chartId,
                                poster: chart.poster,
                                duration: !util.isUndefined(chart.duration) ? chart.duration * 1000 : undefined,
                                configSrc: chart.optionsPath,
                                dataSrc: chart.dataPath,
                            }))
                        );
                        break;
                    case 'textToSounds':
                        data.children.forEach((voice: any) => sceneChildren.push(new Voice({
                            ...buildBaseData(voice, duration),
                            src: resourceMap[voice.resId] ? resourceMap[voice.resId].resPath : undefined,
                            volume: voice.volume,
                            seekStart: voice.seekStart ? voice.seekStart * 1000 : undefined,
                            seekEnd: voice.seekEnd ? voice.seekEnd * 1000 : undefined,
                            loop: voice.loop,
                            muted: voice.muted,
                            provider: voice.provider,
                            children: voice.children[0] ? [
                                new SSML({
                                    value: voice.children[0]?.children[0],
                                })
                            ] : [
                                new SSML({
                                    value: create({
                                        speak: {
                                            "@provider": voice.provider,
                                            voice: {
                                                "@name": voice.voice,
                                                prosody: {
                                                    "@contenteditable": true,
                                                    "@rate": Number(voice.speechRate) === 0 ? 1 : voice.speechRate,
                                                    p: voice.text
                                                }
                                            }
                                        }
                                    }).end()
                                })
                            ],
                            text: voice.text,
                            declaimer: voice.voice,
                            speechRate: Number(voice.speechRate) === 0 ? 1 : voice.speechRate,
                            pitchRate: util.isFinite(Number(voice.pitchRate)) ? Number(voice.pitchRate) + 1 : undefined,
                        })));
                        break;
                    case 'vtubers':
                        data.children.forEach((vtuber: any) => sceneChildren.push(
                            new Vtuber({
                                ...buildBaseData(vtuber, duration),
                                poster: vtuber.poster,
                                src: resourceMap[vtuber.resId] ? resourceMap[vtuber.resId].resPath : undefined,
                                provider: vtuber.provider,
                                text: vtuber.text,
                                solution: vtuber.solution,
                                declaimer: vtuber.declaimer,
                                cutoutColor: vtuber.cutoutColor,
                                duration: vtuber.duration ? vtuber.duration * 1000 : undefined,
                                volume: vtuber.volume,
                                muted: vtuber.muted,
                                loop: vtuber.loop,
                                seekStart: vtuber.seekStart ? vtuber.seekStart * 1000 : undefined,
                                seekEnd: vtuber.seekEnd ? vtuber.seekEnd * 1000 : undefined,
                                demuxSrc: vtuber.demuxSrc
                            })
                        ));
                }
            });
            templateChildren.push(new Scene({
                id,
                poster,
                width: global.videoWidth,
                height: global.videoHeight,
                aspectRatio: global.videoSize,
                duration: duration * 1000,
                backgroundColor: sceneBackgroundColor,
                transition,
                filter: undefined,
                children: sceneChildren,
            }));
        });
        return new Template({
            mode: type || 'scene',
            name: name,
            poster: global.poster,
            actuator,
            width: global.videoWidth,
            height: global.videoHeight,
            aspectRatio: global.videoSize,
            backgroundColor: templateBackgroundColor,
            captureTime: util.isFinite(Number(global.captureTime)) ? global.captureTime * 1000 : undefined,
            fps: global.fps,
            compile,
            children: templateChildren,
        }, data, vars);
    }

}

export default OldParser;