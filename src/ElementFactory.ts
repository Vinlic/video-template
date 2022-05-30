import IElementOptions from './elements/interface/IElementOptions';

import ElementTypes from './enums/ElementTypes';

import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, SSML, Canvas, Group, Sticker, Subtitle } from './elements';
import util from './util';

class ElementFactory {
    /**
     * 实例化元素
     *
     * @param {Object} data
     * @returns {Element}
     */
    public static createElement(data: IElementOptions, ...values: any[]) {
        if (!util.isObject(data)) throw new TypeError('data must be an Object');
        switch (data.type) {
            case ElementTypes.Text: //文本元素
                return new Text(data, undefined, ...values);
            case ElementTypes.Image: //图片元素
                return new Image(data, undefined, ...values);
            case ElementTypes.Audio: //音频元素
                return new Audio(data, undefined, ...values);
            case ElementTypes.Voice: //语音元素
                return new Voice(data, undefined, ...values);
            case ElementTypes.Video: //视频元素
                return new Video(data, undefined, ...values);
            case ElementTypes.Vtuber: //虚拟人元素
                return new Vtuber(data, undefined, ...values);
            case ElementTypes.Chart: //图表元素
                return new Chart(data, undefined, ...values);
            case ElementTypes.Canvas:  //画布元素
                return new Canvas(data, undefined, ...values);
            case ElementTypes.Group:  //组合元素
                return new Group(data, undefined, ...values);
            case ElementTypes.Sticker:  //贴图元素
                return new Sticker(data, undefined, ...values);
            case ElementTypes.Subtitle:  //字幕元素
                return new Subtitle(data, undefined, ...values);
            case ElementTypes.SSML: //SSML文档元素
                return new SSML(data, undefined, ...values);
        }
        return new Element(data, undefined, ...values);
    }
}

export default ElementFactory;
