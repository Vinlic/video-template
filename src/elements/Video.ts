import IVideoOptions from './interface/IVideoOptions';

import ElementTypes from '../enums/ElementTypes';

import Media from './Media';
import Crop from './Crop';
import util from '../util';

class Video extends Media {

    public crop?: Crop; //视频裁剪参数
    public demuxSrc?: string;  //视频解复用文件路径

    public constructor(options: IVideoOptions) {
        super(options, ElementTypes.Video);
        util.optionsInject(this, options, {
            crop: (v: any) => v && new Crop(v)
        }, {
            crop: (v: any) => util.isUndefined(v) || Crop.isInstance(v),
            demuxSrc: (v: any) => util.isUndefined(v) || util.isString(v)
        });
    }

    /**
     * 渲染图像XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
     public renderXML(parent: any) {
        const video = super.renderXML(parent);
        if (this.crop) {
            video.att('crop-style', this.crop.style);
            video.att('crop-x', this.crop.x);
            video.att('crop-y', this.crop.y);
            video.att('crop-width', this.crop.width);
            video.att('crop-height', this.crop.height);
            video.att('crop-clipType', this.crop.clipType);
            video.att('crop-clipStyle', this.crop.clipStyle);
        }
        video.att("demuxSrc", this.demuxSrc);
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const video = super.renderOldXML(parent, resources, global);
        if (this.crop) {
            video.att('cropStyle', this.crop.style);
            video.att('cropX', this.crop.x);
            video.att('cropY', this.crop.y);
            video.att('cropWidth', this.crop.width);
            video.att('cropHeight', this.crop.height);
            video.att('clipType', this.crop.clipType);
            video.att('clipStyle', this.crop.clipStyle);
        }
        video.att("demuxSrc", this.demuxSrc);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            crop: this.crop ? this.crop.toOptions() : undefined,
            demuxSrc: this.demuxSrc
        };
    }

    public static isInstance(value: any) {
        return value instanceof Video;
    }
}

export default Video;
