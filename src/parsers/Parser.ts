import { create } from 'xmlbuilder2';
import { XMLParser } from 'fast-xml-parser';

import util from '../util';
import Template from '../Template';

const xmlParser = new XMLParser({
    allowBooleanAttributes: true, //需要解析布尔值属性
    ignoreAttributes: false, //不要忽略属性
    attributeNamePrefix: '', //属性名称不拼接前缀
    preserveOrder: true, //保持原始文档标签顺序
    parseTagValue: false, //不解析标签内值
    stopNodes: ['template.scene.voice.ssml'], //解析到ssml标签为止不要继续往下解析
});

class Parser {

    public static toXML(_template: Template, pretty = false) {
        const root = create({ version: "1.0.0" });
        const template = root.ele("template", {
            version: _template.version,
            id: _template.id,
            name: _template.name,
            mode: _template.mode,
            poster: _template.poster,
            actuator: _template.actuator,
            width: _template.width,
            height: _template.height,
            aspectRatio: _template.aspectRatio,
            fps: _template.fps,
            crf: _template.crf,
            videoCodec: _template.videoCodec,
            videoBitrate: _template.videoBitrate,
            pixelFormat: _template.pixelFormat,
            frameQuality: _template.frameQuality,
            duration: _template.duration,
            format: _template.format,
            volume: _template.volume,
            audioCodec: _template.audioCodec,
            sampleRate: _template.sampleRate,
            audioBitrate: _template.audioBitrate,
            backgroundColor: _template.backgroundColor,
            captureTime: _template.captureTime,
            createTime: _template.createTime,
            updateTime: _template.updateTime,
            buildBy: _template.buildBy
        });
        _template.children.forEach((node) => node.renderXML(template)); //子节点XML渲染
        return template.end({ prettyPrint: pretty });
    }

    public static toBuffer(tempalte: Template) {
        return Buffer.from(tempalte.toXML());
    }

    public static parseJSON(content: any, data = {}, vars = {}) {
        return new Template(util.isString(content) ? JSON.parse(content) : content, data, vars);
    }

    public static async parseJSONPreProcessing(content: any, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        const object = util.isString(content) ? JSON.parse(content) : content;
        if (util.isFunction(dataProcessor) && util.isString(object.dataSrc)) {
            const result = await dataProcessor(object.dataSrc);
            util.isObject(result) && util.assign(data, result);
        }
        if (util.isFunction(varsProcessor) && util.isString(object.varsSrc)) {
            const result = await varsProcessor(object.varsSrc);
            util.isObject(result) && util.assign(data, result);
        }
        return new Template(object, util.assign(object.data || {}, data), util.assign(object.vars || {}, vars));
    }

    public static parseXML(content: string, data = {}, vars = {}) {
        let xmlObject, varsObject, dataObject;
        xmlParser.parse(content).forEach((o: any) => {
            if (o.template) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
        });
        if (!xmlObject) throw new Error('template xml invalid');
        function parse(obj: any, target: any = {}) {
            const type = Object.keys(obj)[0];
            target.type = type;
            for (let key in obj[':@']) {
                const value = obj[':@'][key];
                let index;
                if (key === 'for-index') key = 'forIndex';
                else if (key === 'for-item') key = 'forItem';
                else if ((index = key.indexOf('-')) != -1) {
                    const pkey = key.substring(0, index);
                    const ckey = key.substring(index + 1, key.length);
                    if (!target[pkey]) target[pkey] = {};
                    target[pkey][ckey] = value;
                    continue;
                }
                target[key] = value;
            }
            target.children = [];
            obj[type].forEach((v: any) => {
                if (v['#text']) return (target.value = v['#text']);
                const result = parse(v, {});
                result && target.children.push(result);
            });
            return target;
        }
        const completeObject = parse(xmlObject);
        const _vars = {};
        const _data = {};
        if (varsObject || dataObject) {
            function processing(obj: any, target: any) {
                obj.children.forEach((o: any) => {
                    if (!target[o.type]) target[o.type] = {};
                    if (o.value) target[o.type] = o.value;
                    processing(o, target[o.type]);
                });
            }
            varsObject && processing(parse(varsObject), _vars);
            dataObject && processing(parse(dataObject), _data);
        }
        return new Template(completeObject, util.assign(_data, data), util.assign(_vars, vars));
    }

    public static async parseXMLPreProcessing(content: string, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        let xmlObject, varsObject, dataObject;
        xmlParser.parse(content).forEach((o: any) => {
            if (o.template) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
        });
        if (!xmlObject) throw new Error('template xml invalid');
        function parse(obj: any, target: any = {}) {
            const type = Object.keys(obj)[0];
            target.type = type;
            for (let key in obj[':@']) {
                const value = obj[':@'][key];
                let index;
                if (key === 'for-index') key = 'forIndex';
                else if (key === 'for-item') key = 'forItem';
                else if ((index = key.indexOf('-')) != -1) {
                    const pkey = key.substring(0, index);
                    const ckey = key.substring(index + 1, key.length);
                    if (!target[pkey]) target[pkey] = {};
                    target[pkey][ckey] = value;
                    continue;
                }
                target[key] = value;
            }
            target.children = [];
            obj[type].forEach((v: any) => {
                if (v['#text']) return (target.value = v['#text']);
                const result = parse(v, {});
                result && target.children.push(result);
            });
            return target;
        }
        const completeObject = parse(xmlObject);
        const _vars = {};
        const _data = {};
        if (varsObject || dataObject) {
            function processing(obj: any, target: any) {
                obj.children.forEach((o: any) => {
                    if (!target[o.type]) target[o.type] = {};
                    if (o.value) target[o.type] = o.value;
                    processing(o, target[o.type]);
                });
            }
            varsObject && processing(parse(varsObject), _vars);
            dataObject && processing(parse(dataObject), _data);
        }
        if (dataObject?.[':@']) {
            const attrs = dataObject[':@'] as any;
            if (util.isFunction(dataProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.assign(data, result);
            }
        }
        if (varsObject?.[':@']) {
            const attrs = varsObject[':@'] as any;
            if (util.isFunction(varsProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.assign(vars, result);
            }
        }
        return new Template(completeObject, util.assign(_data, data), util.assign(_vars, vars));
    }

}

export default Parser;