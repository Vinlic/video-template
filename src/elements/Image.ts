import IImageOptions from './interface/IImageOptions';
import IFilterOptions from './interface/IFilterOptions';

import ElementTypes from '../enums/ElementTypes';
import ImageModes from '../enums/ImageModes';

import Element from './Element';
import Crop from './Crop';
import util from '../util';

class Image extends Element {
    public static Mode = ImageModes;

    public src = ''; //图像来源
    public path?: string; //图像本地路径
    public mode: ImageModes = ImageModes.ScaleToFill; //图像显示模式
    public crop?: Crop; //图像裁剪参数
    public loop?: boolean; //GIF图像是否循环播放
    public dynamic?: boolean; //图像是否动态
    public filter?: IFilterOptions; //图像滤镜
    public naturalWidth?: number;  //图像原始宽度
    public naturalHeight?: number;  //图像原始高度

    public constructor(options: IImageOptions, type = ElementTypes.Image, ...values: any[]) {
        super(options, type, ...values);
        util.optionsInject(this, options, {
            mode: (v: any) => util.defaultTo(v, ImageModes.ScaleToFill),
            crop: (v: any) => v && new Crop(v),
            loop: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            dynamic: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            naturalWidth: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
            naturalHeight: (v: any) => !util.isUndefined(v) ? Number(v) : undefined,
        }, {
            src: (v: any) => util.isString(v),
            path: (v: any) => util.isUndefined(v) || util.isString(v),
            mode: (v: any) => util.isString(v),
            crop: (v: any) => util.isUndefined(v) || Crop.isInstance(v),
            loop: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            dynamic: (v: any) => util.isUndefined(v) || util.isBoolean(v),
            filter: (v: any) => util.isUndefined(v) || util.isObject(v),
            naturalWidth: (v: any) => util.isUndefined(v) || util.isFinite(v),
            naturalHeight: (v: any) => util.isUndefined(v) || util.isFinite(v)
        });
        if (this.isBackground) {  //背景图片禁用退场时间点和退场动效
            this.endTime = undefined;
            this.exitEffect = undefined;
        }
    }

    /**
     * 渲染图像XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const image = super.renderXML(parent);
        image.att('src', this.src);
        image.att('mode', this.mode);
        image.att('dynamic', this.dynamic);
        image.att('loop', this.loop);
        image.att('naturalWidth', this.naturalWidth);
        image.att('naturalHeight', this.naturalHeight);
        if (this.crop) {
            image.att('crop-style', this.crop.style);
            image.att('crop-x', this.crop.x);
            image.att('crop-y', this.crop.y);
            image.att('crop-width', this.crop.width);
            image.att('crop-height', this.crop.height);
            image.att('crop-clipType', this.crop.clipType);
            image.att('crop-clipStyle', this.crop.clipStyle);
        }
        return image;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        const image = super.renderOldXML(parent, resources, global);
        const cacheResourceId = resources ? resources.map[this.src as string] : null;
        const resourceId = cacheResourceId || util.uniqid();
        image.att('loop', this.loop);
        image.att('resId', resourceId);
        if (this.crop) {
            image.att('cropStyle', this.crop.style);
            image.att('cropX', this.crop.x);
            image.att('cropY', this.crop.y);
            image.att('cropWidth', this.crop.width);
            image.att('cropHeight', this.crop.height);
            image.att('clipType', this.crop.clipType);
            image.att('clipStyle', this.crop.clipStyle);
        }
        if (cacheResourceId || !resources) return image;
        resources.map[this.src as string] = resourceId;
        resources.ele('resource', {
            id: resourceId,
            name: this.name,
            type: 'img',
            resPath: this.src,
        });
        return image;
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            src: this.src,
            mode: this.mode,
            crop: this.crop ? this.crop.toOptions() : undefined,
            loop: this.loop,
            dynamic: this.dynamic,
            naturalWidth: this.naturalWidth,
            naturalHeight: this.naturalHeight
        };
    }

    public static isInstance(value: any) {
        return value instanceof Image;
    }
}

export default Image;
