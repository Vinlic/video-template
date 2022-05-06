import IElementOptions from './elements/interface/IElementOptions';

import ElementTypes from './enums/ElementTypes';

import { Element, Text, Image, Audio, Voice, Video, Vtuber, Chart, SSML, Canvas } from './elements';
import util from './util';

class ElementFactory {
    /**
     * 实例化元素
     *
     * @param {Object} data
     * @returns {Element}
     */
    public static createElement(data: IElementOptions) {
        if (!util.isObject(data)) throw new TypeError('data must be an Object');
        switch (data.type) {
            case ElementTypes.Text: //文本元素
                return new Text(data);
            case ElementTypes.Image: //图片元素
                return new Image(data);
            case ElementTypes.Audio: //音频元素
                return new Audio(data);
            case ElementTypes.Voice: //语音元素
                return new Voice(data);
            case ElementTypes.Video: //视频元素
                return new Video(data);
            case ElementTypes.Vtuber: //虚拟人元素
                return new Vtuber(data);
            case ElementTypes.Chart: //图表元素
                return new Chart(data);
            case ElementTypes.Canvas:  //画布元素
                return new Canvas(data);
            case ElementTypes.SSML: //SSML文档元素
                return new SSML(data);
        }
        return new Element(data);
    }
}

export default ElementFactory;
