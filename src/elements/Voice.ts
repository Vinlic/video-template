import IVoiceOptions from './interface/IVoiceOptions';

import ElementTypes from '../enums/ElementTypes';
import VoiceProviders from '../enums/VoiceProviders';

import Media from './Media';
import SSML from './SSML';
import util from '../util';

class Voice extends Media {
    public static Provider = VoiceProviders;

    public provider = ''; // 文本转语音提供商名称
    public text?: string; // 语音文本
    public declaimer?: string; // 语音发音人
    public sampleRate?: string; // 音频采样率
    public speechRate?: number; // 发音人语速
    public pitchRate?: number; // 发音人语调
    public enableSubtitle?: boolean;  //是否开启字幕，即将废弃

    public constructor(options: IVoiceOptions) {
        if (!util.isObject(options)) throw new TypeError('options must be an Object');
        super(options, ElementTypes.Voice);
        util.optionsInject(this, options, {
            provider: (v: any) => util.defaultTo(v, VoiceProviders.Aliyun),
            speechRate: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            pitchRate: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
        }, {
            provider: (v: any) => util.isString(v),
            text: (v: any) => util.isUndefined(v) || util.isString(v),
            declaimer: (v: any) => util.isUndefined(v) || util.isString(v),
            sampleRate: (v: any) => util.isUndefined(v) || util.isString(v),
            speechRate: (v: any) => util.isUndefined(v) || util.isFinite(v),
            pitchRate: (v: any) => util.isUndefined(v) || util.isFinite(v),
        });
        !this.children.length && this.children.push(this.generateSSML());
    }

    /**
     * 渲染语音XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const voice = super.renderXML(parent);
        voice.att('provider', this.provider);
        voice.att('text', this.text);
        voice.att('declaimer', this.declaimer);
        voice.att('sampleRate', this.sampleRate);
        voice.att('speechRate', this.speechRate);
        voice.att('pitchRate', this.pitchRate);
        return voice;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const voice = super.renderOldXML(parent, resources, global);
        voice.att('provider', this.provider);
        voice.att('text', this.text);
        voice.att('voice', this.declaimer);
        voice.att('sampleRate', this.sampleRate);
        voice.att('speechRate', this.speechRate);
        voice.att('pitchRate', this.pitchRate);
        return voice;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            provider: this.provider,
            voice: this.declaimer,
            sampleRate: this.sampleRate,
            playbackRate: this.speechRate,
            speechRate: this.speechRate,
            pitchRate: this.pitchRate,
            enableSubtitle: this.enableSubtitle,
            content: this.text,
            ssml: this.ssml
        };
    }

    private generateSSML() {
        return new SSML({
            value: `<speak provider="${this.provider}"><voice name="${this.declaimer}"><prosody contenteditable="true" rate="${this.playbackRate}" volume="${this.volume}"><p>${this.text}</p></prosody></voice></speak>`
        });
    }

    public get ssml() {
        return this.children?.length ? this.children[0].value?.trim() : null;
    }

    public static isInstance(value: any) {
        return value instanceof Voice;
    }
}

export default Voice;
