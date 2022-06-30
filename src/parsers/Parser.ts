import { create } from 'xmlbuilder2';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

import util from '../util';
import Template from '../Template';
import Scene from '../Scene';
import ElementFactory from '../ElementFactory';

const HEAD = '<?xml version="1.0"?>';

const xmlBuilder = new XMLBuilder({
    attributeNamePrefix: '',
    ignoreAttributes: false,
    preserveOrder: true
});
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
        const template = create().ele("template", {
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
        const chunks = [HEAD];
        let formXML = "";
        if(_template.formObject) {
            formXML = xmlBuilder.build([_template.formObject]);
            chunks.push(formXML);
        }
        chunks.push(template.end({ headless: true, prettyPrint: pretty }));
        return chunks.join(pretty ? "\n" : "");
    }

    public static toBuffer(tempalte: Template) {
        return Buffer.from(tempalte.toXML());
    }

    public static parseJSON(content: any, data = {}, vars = {}) {
        return new Template(util.isString(content) ? JSON.parse(content) : content, data, vars);
    }

    public static async parseJSONPreprocessing(content: any, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        const object = util.isString(content) ? JSON.parse(content) : content;
        if (util.isFunction(dataProcessor) && util.isString(object.dataSrc)) {
            const result = await dataProcessor(object.dataSrc);
            util.isObject(result) && util.merge(data, result);
        }
        if (util.isFunction(varsProcessor) && util.isString(object.varsSrc)) {
            const result = await varsProcessor(object.varsSrc);
            util.isObject(result) && util.merge(data, result);
        }
        return new Template(object, util.merge(object.data || {}, data), util.merge(object.vars || {}, vars));
    }

    public static parseSceneJSON(content: any, data = {}, vars = {}) {
        return new Scene(util.isString(content) ? JSON.parse(content) : content, data, vars);
    }

    public static async parseSceneJSONPreprocessing(content: any, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        const object = util.isString(content) ? JSON.parse(content) : content;
        if (util.isFunction(dataProcessor) && util.isString(object.dataSrc)) {
            const result = await dataProcessor(object.dataSrc);
            util.isObject(result) && util.merge(data, result);
        }
        if (util.isFunction(varsProcessor) && util.isString(object.varsSrc)) {
            const result = await varsProcessor(object.varsSrc);
            util.isObject(result) && util.merge(data, result);
        }
        return new Scene(object, util.merge(object.data || {}, data), util.merge(object.vars || {}, vars));
    }

    public static parseXMLObject(xmlObject: any, varsObject?: any, dataObject?: any, data = {}, vars = {}) {
        const completeObject = this.convertXMLObject(xmlObject);
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
            varsObject && processing(this.convertXMLObject(varsObject), _vars);
            dataObject && processing(this.convertXMLObject(dataObject), _data);
        }
        return {
            completeObject,
            data: util.merge(_data, data),
            vars: util.merge(_vars, vars)
        };
    }

    public static parseXML(content: string, data = {}, vars = {}) {
        let xmlObject, varsObject, dataObject, formObject, extendsScript = "";
        xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o: any) => {
            if (o.template) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
            if (o.form) formObject = o;
            if (o.script) extendsScript = (o.script[0] && o.script[0]["#text"]) || "";
        });
        if (!xmlObject) throw new Error('template xml invalid');
        const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, dataObject, varsObject, data, vars);
        return new Template(completeObject, _data, _vars, extendsScript, formObject);
    }

    public static async parseXMLPreprocessing(content: string, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        let xmlObject, varsObject, dataObject, formObject, extendsScript = "";
        xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o: any) => {
            if (o.template) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
            if (o.form) formObject = o;
            if (o.script) extendsScript = (o.script[0] && o.script[0]["#text"]) || "";
        });
        if (!xmlObject) throw new Error('template xml invalid');
        const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars);
        if (dataObject?.[':@']) {
            const attrs = dataObject[':@'] as any;
            if (util.isFunction(dataProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.merge(_data, result);
            }
        }
        if (varsObject?.[':@']) {
            const attrs = varsObject[':@'] as any;
            if (util.isFunction(varsProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.merge(_vars, result);
            }
        }
        return new Template(completeObject, _data, _vars, extendsScript, formObject);
    }

    public static parseSceneXML(content: string, data = {}, vars = {}) {
        let xmlObject, varsObject, formObject, dataObject, extendsScript;
        xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o: any) => {
            if (o.scene) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
            if (o.form) formObject = o;
            if (o.script) extendsScript = (o.script[0] && o.script[0]["#text"]) || "";
        });
        if (!xmlObject) throw new Error('template scene xml invalid');
        const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars);
        return new Scene(completeObject, util.merge(_data, data), util.merge(_vars, vars), extendsScript, formObject);
    }

    public static async parseSceneXMLPreprocessing(content: string, data = {}, vars = {}, dataProcessor: any, varsProcessor: any) {
        let xmlObject, varsObject, formObject, dataObject, extendsScript;
        xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o: any) => {
            if (o.scene) xmlObject = o;
            if (o.vars) varsObject = o;
            if (o.data) dataObject = o;
            if (o.form) formObject = o;
            if (o.script) extendsScript = (o.script[0] && o.script[0]["#text"]) || "";
        });
        if (!xmlObject) throw new Error('template scene xml invalid');
        const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars);
        if (dataObject?.[':@']) {
            const attrs = dataObject[':@'] as any;
            if (util.isFunction(dataProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.merge(_data, result);
            }
        }
        if (varsObject?.[':@']) {
            const attrs = varsObject[':@'] as any;
            if (util.isFunction(varsProcessor) && attrs.source) {
                const result = await dataProcessor(attrs.source);
                util.isObject(result) && util.merge(_vars, result);
            }
        }
        return new Scene(completeObject, _data, _vars, extendsScript, formObject);
    }

    public static parseElementJSON(content: any, data = {}, vars = {}, extendsScript = "") {
        return ElementFactory.createElement(util.isString(content) ? JSON.parse(content) : content, data, vars, extendsScript);
    }

    public static parseElementXML(content: string, data = {}, vars = {}, extendsScript = "") {
        const xmlObject = xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$"))[0];
        if (!xmlObject) throw new Error('template element xml invalid');
        const { completeObject } = this.parseXMLObject(xmlObject);
        return ElementFactory.createElement(completeObject, data, vars, extendsScript);
    }

    public static convertXMLObject(obj: any, target: any = {}, jsonParse = false) {
        const type = Object.keys(obj)[0];
        target.type = type;
        for (let key in obj[':@']) {
            let value = obj[':@'][key];
            key = {
                type: "__type",
                value: "__value"
            }[key] || key;
            let index;
            if(jsonParse && value && value[0] === "{" || value[0] === "[")
                try { value = JSON.parse(value) } catch {}
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
            const result = this.convertXMLObject(v, {});
            result && target.children.push(result);
        });
        return target;
    }

}

export default Parser;