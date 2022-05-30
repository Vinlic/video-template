import ICropOptions from './interface/ICropOptions';

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
        util.optionsInject(this, options, {
            x: (v: any) => Number(util.defaultTo(v, 0)),
            y: (v: any) => Number(util.defaultTo(v, 0)),
            width: (v: any) => Number(v),
            height: (v: any) => Number(v),
        }, {
            x: (v: any) => util.isFinite(v),
            y: (v: any) => util.isFinite(v),
            width: (v: any) => util.isFinite(v),
            height: (v: any) => util.isFinite(v),
            style: (v: any) => util.isString(v),
            clipType: (v: any) => util.isUndefined(v) || util.isString(v),
            clipStyle: (v: any) => util.isUndefined(v) || util.isString(v)
        });
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

export default Crop;