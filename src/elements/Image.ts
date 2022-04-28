import IImageOptions from './interface/IImageOptions';
import ICropOptions from './interface/ICropOptions';
import IFilterOptions from './interface/IFilterOptions';

import ElementTypes from '../enums/ElementTypes';
import ImageModes from '../enums/ImageModes';

import Element from './Element';
import util from '../util';

class Crop {
    public x = 0; // 裁剪相对X坐标值
    public y = 0; // 裁剪相对Y坐标值
    public width = 0; // 裁剪宽度
    public height = 0; // 裁剪高度
    public style = ''; // 裁剪样式
    public clipType?: string;  //前端专用裁剪类型
    public clipStyle?: string;  //前端专用裁剪样式

    public constructor(options: ICropOptions) {
        util.optionsInject(
            this,
            options,
            {
                x: (v: any) => Number(util.defaultTo(v, 0)),
                y: (v: any) => Number(util.defaultTo(v, 0)),
                width: (v: any) => Number(v),
                height: (v: any) => Number(v),
            },
            {
                x: (v: any) => util.isFinite(v),
                y: (v: any) => util.isFinite(v),
                width: (v: any) => util.isFinite(v),
                height: (v: any) => util.isFinite(v),
                style: (v: any) => util.isString(v),
                clipType: (v: any) => util.isUndefined(v) || util.isString(v),
                clipStyle: (v: any) => util.isUndefined(v) || util.isString(v)
            },
        );
    }

    public toOptions() {
        return {
            style: this.style,
            width: this.width,
            height: this.height,
            left: this.x,
            top: this.y,
            clipStyle: this.clipStyle,
            clipType: this.clipType
        };
    }

    public static isInstance(value: any) {
        return value instanceof Crop;
    }
}

class Image extends Element {
    public static Mode = ImageModes;

    public src = ''; //图像来源
    public path?: string; //图像本地路径
    public mode: ImageModes = ImageModes.ScaleToFill; //图像显示模式
    public crop?: Crop; //图像裁剪参数
    public loop?: boolean; //GIF图像是否循环播放
    public dynamic?: boolean; //图像是否动态
    public filter?: IFilterOptions; //图像滤镜

    public constructor(options: IImageOptions) {
        super(options, ElementTypes.Image);
        util.optionsInject(
            this,
            options,
            {
                mode: (v: any) => util.defaultTo(v, ImageModes.ScaleToFill),
                crop: (v: any) => v && new Crop(v),
                loop: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
                dynamic: (v: any) => !util.isUndefined(v) ? util.booleanParse(v) : undefined,
            },
            {
                src: (v: any) => util.isString(v),
                path: (v: any) => util.isUndefined(v) || util.isString(v),
                mode: (v: any) => util.isString(v),
                crop: (v: any) => util.isUndefined(v) || Crop.isInstance(v),
                loop: (v: any) => util.isUndefined(v) || util.isBoolean(v),
                dynamic: (v: any) => util.isUndefined(v) || util.isBoolean(v),
                filter: (v: any) => util.isUndefined(v) || util.isObject(v),
            },
        );
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
        if (this.crop) {
            image.att('crop-style', this.crop.style);
            image.att('crop-x', this.crop.x);
            image.att('crop-y', this.crop.y);
            image.att('crop-width', this.crop.width);
            image.att('crop-height', this.crop.height);
            image.att('crop-clipType', this.crop.clipType);
            image.att('crop-clipStyle', this.crop.clipStyle);
        }
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
            dynamic: this.dynamic
        };
    }

    public static isInstance(value: any) {
        return value instanceof Image;
    }
}

export default Image;
