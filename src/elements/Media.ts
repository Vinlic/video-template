import IMediaOptions from './interface/IMediaOptions';
import IFilterOptions from './interface/IFilterOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Media extends Element {
    public poster?: string; //媒体封面图
    public src?: string; //媒体来源
    public path?: string; //媒体本地路径
    public volume = 0; //媒体音量
    public format?: string; //媒体格式
    public duration?: number; //媒体时长
    public seekStart?: number; //媒体裁剪起始时间点
    public seekEnd?: number; //媒体裁剪结束时间点
    public loop = false; //媒体是否循环播放
    public playbackRate?: number; //媒体播放速度
    public filter?: IFilterOptions; //媒体滤镜
    public muted = false; //媒体是否静音

    public constructor(options: IMediaOptions, type: ElementTypes = ElementTypes.Media) {
        super(options, type);
        util.optionsInject(
            this,
            options,
            {
                loop: (v: any) => util.booleanParse(util.defaultTo(v, false)),
                volume: (v: any) => Number(util.defaultTo(v, 1)),
                duration: (v: any) => v && Number(v),
                seekStart: (v: any) => v && Number(v),
                seekEnd: (v: any) => v && Number(v),
                playbackRate: (v: any) => v && Number(v),
                muted: (v: any) => util.booleanParse(util.defaultTo(v, false)),
            },
            {
                poster: (v: any) => util.isUndefined(v) || util.isString(v),
                src: (v: any) => util.isUndefined(v) || util.isString(v),
                path: (v: any) => util.isUndefined(v) || util.isString(v),
                volume: (v: any) => util.isFinite(v),
                format: (v: any) => util.isUndefined(v) || util.isString(v),
                duration: (v: any) => util.isUndefined(v) || util.isFinite(v),
                seekStart: (v: any) => util.isUndefined(v) || util.isFinite(v),
                seekEnd: (v: any) => util.isUndefined(v) || util.isFinite(v),
                loop: (v: any) => util.isBoolean(v),
                playbackRate: (v: any) => util.isUndefined(v) || util.isFinite(v),
                filter: (v: any) => util.isUndefined(v) || util.isObject(v),
                muted: (v: any) => util.isBoolean(v),
            },
        );
    }

    /**
     * 渲染媒体XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const media = super.renderXML(parent);
        media.att('poster', this.poster);
        media.att('src', this.src);
        media.att('volume', this.volume);
        media.att('format', this.format);
        media.att('duration', this.duration);
        media.att('seekStart', this.seekStart);
        media.att('seekEnd', this.seekEnd);
        media.att('loop', this.loop);
        media.att('playbackRate', this.playbackRate);
        media.att('muted', this.muted);
        return media;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const media = super.renderOldXML(parent, resources, global);
        let cacheResourceId, resourceId;
        if (this.src) {
            cacheResourceId = resources ? resources.map[this.src] : null;
            resourceId = cacheResourceId || util.uniqid();
        }
        media.att('poster', this.poster);
        media.att('volume', this.volume);
        media.att('format', this.format);
        media.att('resId', resourceId);
        util.isNumber(this.duration) && media.att('duration', (this.duration as number) / 1000);
        util.isNumber(this.seekStart) && media.att('seekStart', (this.seekStart as number) / 1000);
        util.isNumber(this.seekEnd) && media.att('seekEnd', (this.seekEnd as number) / 1000);
        media.att('loop', this.loop);
        media.att('playbackRate', this.playbackRate);
        media.att('muted', this.muted);
        if (!this.src || cacheResourceId || !resources) return media;
        resources.map[this.src] = resourceId;
        resources.ele('resource', {
            id: resourceId,
            name: this.name,
            type: {
                [ElementTypes.Audio]: 'sound',
                [ElementTypes.Voice]: 'voice',
                [ElementTypes.Video]: 'video',
            }[this.type as string],
            resPath: this.src,
        });
        return media;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            src: this.src,
            poster: this.poster,
            format: this.format,
            duration: this.duration ? util.millisecondsToSenconds(this.duration) : undefined,
            volume: this.volume,
            loop: this.loop,
            seekStart: this.seekStart,
            seekEnd: this.seekEnd,
            playbackRate: this.playbackRate,
            muted: this.muted,
            filter: this.filter
        };
    }

    public static isInstance(value: any) {
        return value instanceof Media;
    }
}

export default Media;
