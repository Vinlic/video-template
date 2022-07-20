import ILinkOptions from './interface/ILinkOptions';

import ElementTypes from '../enums/ElementTypes';

import Element from './Element';
import util from '../util';

class Link extends Element {
    public __type = "";  //交互类型
    public target?: string;  //交互触发目标
    public trigger?: string;  //交互触发器
    public modal: any = {};  //交互弹窗参数对象
    public params: any = {};  //交互弹窗参数对象
    public enter: any = {};  //交互入场对象
    public exit: any = {};  //交互出场对象

    public constructor(options: ILinkOptions, type = ElementTypes.Link, ...values: any[]) {
        super(options, type, ...values);
        util.optionsInject(this, options, {}, {
            __type: (v: any) => util.isString(v),
            target: (v: any) => util.isUndefined(v) || util.isString(v),
            trigger: (v: any) => util.isUndefined(v) || util.isString(v),
            modal: (v: any) => util.isUndefined(v) || util.isObject(v),
            params: (v: any) => util.isUndefined(v) || util.isObject(v),
            enter: (v: any) => util.isUndefined(v) || util.isObject(v),
            exit: (v: any) => util.isUndefined(v) || util.isObject(v)
        });
    }

    /**
     * 渲染文本XML标签
     *
     * @param {XMLObject} parent 上级节点XML对象
     */
    public renderXML(parent: any) {
        const link = super.renderXML(parent);
        link.att("type", this.__type);
        link.att("target", this.target);
        link.att("trigger", this.trigger);
        for(let key in this.modal) {
            const value = this.modal[key];
            link.att(`modal-${key}`, value);
        }
        for(let key in this.params) {
            const value = this.params[key];
            link.att(`params-${key}`, value);
        }
        for(let key in this.enter) {
            const value = this.enter[key];
            link.att(`enter-${key}`, value);
        }
        for(let key in this.exit) {
            const value = this.exit[key];
            link.att(`exit-${key}`, value);
        }
        return link;
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        return super.renderOldXML(parent, resources, global, true);
    }

    public toOptions() {
        const parentOptions = super.toOptions();
        return {
            ...parentOptions,
            type: this.__type,
            target: this.target,
            trigger: this.trigger,
            modal: this.modal,
            params: this.params,
            enter: this.enter,
            exit: this.exit
        };
    }

    public static isInstance(value: any) {
        return value instanceof Link;
    }
}

export default Link;
