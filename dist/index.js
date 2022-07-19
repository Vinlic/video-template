var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Scene: () => Scene_default,
  Template: () => Template_default,
  elements: () => elements_exports
});
module.exports = __toCommonJS(src_exports);

// src/util.ts
var import_lodash = __toESM(require("lodash"));
var import_uuid = require("uuid");
var import_goodid = __toESM(require("goodid.js"));
var util_default = __spreadProps(__spreadValues({}, import_lodash.default), {
  uuid: (separator = true) => separator ? (0, import_uuid.v1)() : (0, import_uuid.v1)().replace(/\-/g, ""),
  uniqid: import_goodid.default,
  optionsInject(that, options, initializers = {}, checkers = {}) {
    Object.keys(that).forEach((key) => {
      if (/^_/.test(key) && !/^__/.test(key))
        return;
      let value = options[key];
      if (this.isFunction(initializers[key]))
        value = initializers[key](value);
      if (this.isFunction(checkers[key]) && !checkers[key](value)) {
        console.warn("invalid options:", options);
        throw new Error(`parameter ${key} invalid`);
      }
      ;
      if (!this.isFunction(initializers[key]) && !this.isFunction(checkers[key]) || this.isUndefined(value))
        return;
      if (this.isSymbol(that[key]) && !this.isSymbol(value))
        return;
      that[key] = value;
    });
  },
  isURL(value) {
    return !this.isUndefined(value) && /^(http|https)/.test(value);
  },
  isBASE64(value) {
    return !this.isUndefined(value) && /^[a-zA-Z0-9\/\+]+(=?)+$/.test(value);
  },
  isStringNumber(value) {
    return this.isFinite(Number(value));
  },
  isUnixTimestamp(value) {
    return /^[0-9]{10}$/.test(`${value}`);
  },
  isTimestamp(value) {
    return /^[0-9]{13}$/.test(`${value}`);
  },
  unixTimestamp() {
    return Math.floor(Date.now() / 1e3);
  },
  timestamp() {
    return Date.now();
  },
  urlJoin(...values) {
    let url = values[0];
    for (let i = 1; i < values.length; i++)
      url += `/${values[i].replace(/^\/*/, "")}`;
    return url;
  },
  millisecondsToHmss(milliseconds) {
    if (this.isString(milliseconds))
      return milliseconds;
    const sec = Math.floor(milliseconds / 1e3);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;
    const ms = milliseconds % 6e4 - seconds * 1e3;
    return `${hours > 9 ? hours : "0" + hours}:${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}.${ms}`;
  },
  millisecondsToSenconds(milliseconds, precision = 3) {
    return parseFloat((milliseconds / 1e3).toFixed(precision));
  },
  arrayParse(value) {
    return this.isArray(value) ? value : [value];
  },
  encodeBASE64(value) {
    value = this.isString(value) ? value : JSON.stringify(value);
    return typeof Buffer !== "undefined" ? Buffer.from(value).toString("base64") : btoa(unescape(encodeURIComponent(value)));
  },
  decodeBASE64(value) {
    if (!this.isString(value))
      throw new TypeError("value must be an string");
    return typeof Buffer !== "undefined" ? Buffer.from(value, "base64").toString() : decodeURIComponent(escape(atob(value)));
  },
  booleanParse(value) {
    switch (Object.prototype.toString.call(value)) {
      case "[object String]":
        return ["true", "t", "yes", "y", "on", "1"].indexOf(value.trim().toLowerCase()) !== -1;
      case "[object Number]":
        return value.valueOf() === 1;
      case "[object Boolean]":
        return value.valueOf();
      default:
        return false;
    }
  }
});

// src/Scene.ts
var import_xmlbuilder24 = require("xmlbuilder2");

// src/extension.ts
var import_date_fns = require("date-fns");
var vars = {
  "__UUID__": () => util_default.uuid(),
  "__UNIQID__": () => util_default.uniqid()
};
var functions = {
  o2j: (v) => "json:" + JSON.stringify(v),
  o2b: (v) => "base64:" + util_default.encodeBASE64(v),
  dateFormat: (date, formatString, options) => (0, import_date_fns.format)(date, formatString, options),
  gt: (v1, v2) => v1 > v2,
  lt: (v1, v2) => v1 < v2
};
var extension_default = { vars, functions };

// src/Compiler.ts
var SAFE_SCRIPT = ["require", "process", "eval", "Buffer", "Function", "fetch", "global", "window"].join("={},") + "={};";
var Compiler = class {
  static compile(rawData, data = {}, valueMap = {}, extendsScript = "", debug = false) {
    let extendsScriptCtx = {};
    if (util_default.isString(extendsScript) && extendsScript.length) {
      const _data = __spreadValues(__spreadValues(__spreadValues({}, data), valueMap), extension_default.functions);
      extendsScriptCtx = this.prepareFunctionScript(`const {${Object.keys(_data).join(",")}}=this;${extendsScript.replace(/\$\#/g, "<").replace(/\#\$/g, ">")}`).bind(_data)();
    }
    const render = (value, data2 = {}, scope = {}) => {
      if (util_default.isObject(value)) {
        if (util_default.isArray(value)) {
          const _scope = {};
          let children = [];
          value.forEach((v) => {
            const result2 = render(util_default.cloneDeep(v), data2, _scope);
            if (result2 === null)
              return;
            if (util_default.isArray(result2))
              children = [...children, ...result2];
            else
              children.push(result2);
          });
          return children;
        }
        const attrs = value;
        const { for: $for, forItem, forIndex, if: $if, elif, else: $else } = attrs;
        if ($if) {
          delete attrs.if;
          const expressions = this.expressionsExtract($if);
          if (!expressions) {
            scope.ifFlag = false;
            return null;
          }
          if (expressions.length) {
            const { expression } = expressions[0];
            let result2;
            try {
              result2 = this.eval(expression, data2, valueMap, extendsScriptCtx, debug);
            } catch {
            }
            if (!result2) {
              scope.ifFlag = false;
              return null;
            }
          }
          scope.ifFlag = true;
        } else if (elif) {
          if (util_default.isUndefined(scope.ifFlag))
            throw new Error("\u4F7F\u7528elif\u5C5E\u6027\u8282\u70B9\u5FC5\u987B\u5904\u4E8E\u5305\u542Bif\u5C5E\u6027\u8282\u70B9\u7684\u4E0B\u4E00\u4E2A\u8282\u70B9");
          delete attrs.elif;
          if (scope.ifFlag) {
            scope.ifFlag = true;
            return null;
          }
          const expressions = this.expressionsExtract(elif);
          if (!expressions) {
            scope.ifFlag = false;
            return null;
          }
          if (!expressions.length) {
            const { expression } = expressions[0];
            let result2;
            try {
              result2 = this.eval(expression, data2, valueMap, extendsScriptCtx, debug);
            } catch {
            }
            if (!result2) {
              scope.ifFlag = false;
              return null;
            }
          }
          scope.ifFlag = true;
        } else if ($else) {
          if (util_default.isUndefined(scope.ifFlag))
            throw new Error("\u4F7F\u7528elif\u5C5E\u6027\u8282\u70B9\u5FC5\u987B\u5904\u4E8E\u5305\u542Bif\u5C5E\u6027\u8282\u70B9\u7684\u4E0B\u4E00\u4E2A\u8282\u70B9");
          delete attrs.else;
          if (scope.ifFlag) {
            delete scope.ifFlag;
            return null;
          }
        }
        if ($for) {
          delete attrs.for;
          delete attrs.forIndex;
          delete attrs.forItem;
          const expressions = this.expressionsExtract($for);
          if (!expressions || !expressions.length)
            return null;
          const { expression } = expressions[0];
          let list = [];
          try {
            list = this.eval(expression, data2, valueMap, extendsScriptCtx, debug);
          } catch {
          }
          if (util_default.isNumber(list)) {
            const items = [];
            for (let i = 0; i < list; i++) {
              items.push(render(value, __spreadProps(__spreadValues({}, data2), {
                [forIndex || "index"]: i
              })));
            }
            return items;
          }
          if (!util_default.isArray(list) || !list.length)
            return null;
          return list.map((v, i) => {
            const item = util_default.cloneDeep(value);
            return render(item, __spreadProps(__spreadValues({}, data2), {
              [forIndex || "index"]: i,
              [forItem || "item"]: v
            }));
          });
        }
        const result = {};
        for (const key in value)
          result[key] = render(attrs[key], data2);
        return result;
      } else if (util_default.isString(value)) {
        const expressions = this.expressionsExtract(value);
        if (!expressions || !expressions.length)
          return value;
        return expressions.reduce((result, expression) => {
          try {
            if (extension_default.vars[expression.expression])
              expression.replace(result, extension_default.vars[expression.expression]());
            else {
              result = expression.replace(result, this.eval(expression.expression, data2, valueMap, extendsScriptCtx, debug));
            }
          } catch (err) {
            debug && console.error(`expression ${expression} value replace error:`, err);
          }
          return result;
        }, value);
      }
      return value;
    };
    return render(rawData, data);
  }
  static eval(expression, data = {}, valueMap = {}, extendsScriptCtx = {}, debug) {
    let result;
    const _data = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, data), valueMap), extension_default.functions), extendsScriptCtx);
    const evalFun = this.prepareFunctionScript(`const {${Object.keys(_data).join(",")}}=this;return ${expression.replace(/\$\#/g, "<").replace(/\#\$/, ">")}`);
    try {
      result = evalFun.bind(_data)();
    } catch (err) {
      debug && console.error(`expression ${expression} evaluate error:`, err);
      result = null;
    }
    if (util_default.isString(result)) {
      const expressions = this.expressionsExtract(result);
      if (!expressions || !expressions.length)
        return result;
      return expressions.reduce((_result, expression2) => {
        try {
          _result = expression2.replace(_result, this.eval(expression2.expression, util_default.assign(data, valueMap), {}, extendsScriptCtx, debug));
        } catch (err) {
          _result = null;
        }
        return _result;
      }, result);
    }
    return result;
  }
  static expressionsExtract(value) {
    if (util_default.isUndefined(value) || value == null)
      return null;
    const match = value.toString().match(/(?<={{).*?(?=}})/g);
    if (!match)
      return [];
    const list = match;
    return Array.from(new Set(list)).map((expression) => {
      return {
        expression,
        replace: (oldValue, newValue) => {
          if (util_default.isUndefined(newValue) || newValue == null)
            return oldValue.replace(new RegExp(`\\{\\{${util_default.escapeRegExp(expression)}\\}\\}`, "g"), "") || null;
          if (oldValue == null)
            return newValue;
          return oldValue.replace(new RegExp(`\\{\\{${util_default.escapeRegExp(expression)}\\}\\}`, "g"), newValue);
        }
      };
    });
  }
  static prepareFunctionScript(script) {
    return Function("const " + SAFE_SCRIPT + script);
  }
};
var Compiler_default = Compiler;

// src/enums/ElementTypes.ts
var ElementTypes = /* @__PURE__ */ ((ElementTypes2) => {
  ElementTypes2["Element"] = "element";
  ElementTypes2["Group"] = "group";
  ElementTypes2["Text"] = "text";
  ElementTypes2["Image"] = "image";
  ElementTypes2["Audio"] = "audio";
  ElementTypes2["Voice"] = "voice";
  ElementTypes2["Video"] = "video";
  ElementTypes2["Vtuber"] = "vtuber";
  ElementTypes2["Canvas"] = "canvas";
  ElementTypes2["Chart"] = "chart";
  ElementTypes2["Sticker"] = "sticker";
  ElementTypes2["Subtitle"] = "subtitle";
  ElementTypes2["Media"] = "media";
  ElementTypes2["SSML"] = "ssml";
  return ElementTypes2;
})(ElementTypes || {});
var ElementTypes_default = ElementTypes;

// src/elements/index.ts
var elements_exports = {};
__export(elements_exports, {
  Audio: () => Audio_default,
  Canvas: () => Canvas_default,
  Chart: () => Chart_default,
  Element: () => Element_default,
  Group: () => Group_default,
  Image: () => Image_default,
  Media: () => Media_default,
  SSML: () => SSML_default,
  Sticker: () => Sticker_default,
  Subtitle: () => Subtitle_default,
  Text: () => Text_default,
  Video: () => Video_default,
  Voice: () => Voice_default,
  Vtuber: () => Vtuber_default
});

// src/elements/Element.ts
var import_xmlbuilder23 = require("xmlbuilder2");

// src/parsers/Parser.ts
var import_xmlbuilder2 = require("xmlbuilder2");
var import_fast_xml_parser = require("fast-xml-parser");
var HEAD = '<?xml version="1.0"?>';
var xmlBuilder = new import_fast_xml_parser.XMLBuilder({
  attributeNamePrefix: "",
  ignoreAttributes: false,
  preserveOrder: true
});
var xmlParser = new import_fast_xml_parser.XMLParser({
  allowBooleanAttributes: true,
  ignoreAttributes: false,
  attributeNamePrefix: "",
  preserveOrder: true,
  parseTagValue: false,
  stopNodes: ["template.scene.voice.ssml"]
});
var Parser = class {
  static toXML(_template, pretty = false) {
    const template = (0, import_xmlbuilder2.create)().ele("template", {
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
    if (util_default.isObject(_template.original)) {
      for (let key in _template.original)
        template.att(`original-${key}`, _template.original[key]);
    }
    _template.children.forEach((node) => node.renderXML(template));
    const chunks = [HEAD];
    let formXML = "";
    if (_template.formObject) {
      formXML = xmlBuilder.build([_template.formObject]);
      chunks.push(formXML);
    }
    chunks.push(template.end({ headless: true, prettyPrint: pretty }));
    return chunks.join(pretty ? "\n" : "");
  }
  static toBuffer(tempalte) {
    return Buffer.from(tempalte.toXML());
  }
  static parseJSON(content, data = {}, vars2 = {}) {
    return new Template_default(util_default.isString(content) ? JSON.parse(content) : content, data, vars2);
  }
  static async parseJSONPreprocessing(content, data = {}, vars2 = {}, dataProcessor, varsProcessor) {
    const object = util_default.isString(content) ? JSON.parse(content) : content;
    if (util_default.isFunction(dataProcessor) && util_default.isString(object.dataSrc)) {
      const result = await dataProcessor(object.dataSrc);
      util_default.isObject(result) && util_default.merge(data, result);
    }
    if (util_default.isFunction(varsProcessor) && util_default.isString(object.varsSrc)) {
      const result = await varsProcessor(object.varsSrc);
      util_default.isObject(result) && util_default.merge(data, result);
    }
    return new Template_default(object, util_default.merge(object.data || {}, data), util_default.merge(object.vars || {}, vars2));
  }
  static parseSceneJSON(content, data = {}, vars2 = {}) {
    return new Scene_default(util_default.isString(content) ? JSON.parse(content) : content, data, vars2);
  }
  static async parseSceneJSONPreprocessing(content, data = {}, vars2 = {}, dataProcessor, varsProcessor) {
    const object = util_default.isString(content) ? JSON.parse(content) : content;
    if (util_default.isFunction(dataProcessor) && util_default.isString(object.dataSrc)) {
      const result = await dataProcessor(object.dataSrc);
      util_default.isObject(result) && util_default.merge(data, result);
    }
    if (util_default.isFunction(varsProcessor) && util_default.isString(object.varsSrc)) {
      const result = await varsProcessor(object.varsSrc);
      util_default.isObject(result) && util_default.merge(data, result);
    }
    return new Scene_default(object, util_default.merge(object.data || {}, data), util_default.merge(object.vars || {}, vars2));
  }
  static parseXMLObject(xmlObject, varsObject, dataObject, data = {}, vars2 = {}) {
    const completeObject = this.convertXMLObject(xmlObject);
    const _vars = {};
    const _data = {};
    if (varsObject || dataObject) {
      let processing = function(obj, target) {
        obj.children.forEach((o) => {
          if (!target[o.type])
            target[o.type] = {};
          if (o.value)
            target[o.type] = o.value;
          processing(o, target[o.type]);
        });
      };
      varsObject && processing(this.convertXMLObject(varsObject), _vars);
      dataObject && processing(this.convertXMLObject(dataObject), _data);
    }
    return {
      completeObject,
      data: util_default.merge(_data, data),
      vars: util_default.merge(_vars, vars2)
    };
  }
  static parseXML(content, data = {}, vars2 = {}) {
    let xmlObject, varsObject, dataObject, formObject, extendsScript = "";
    xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o) => {
      if (o.template)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
      if (o.form)
        formObject = o;
      if (o.script)
        extendsScript = o.script[0] && o.script[0]["#text"] || "";
    });
    if (!xmlObject)
      throw new Error("template xml invalid");
    const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, dataObject, varsObject, data, vars2);
    return new Template_default(completeObject, _data, _vars, extendsScript, formObject);
  }
  static async parseXMLPreprocessing(content, data = {}, vars2 = {}, dataProcessor, varsProcessor) {
    let xmlObject, varsObject, dataObject, formObject, extendsScript = "";
    xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o) => {
      if (o.template)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
      if (o.form)
        formObject = o;
      if (o.script)
        extendsScript = o.script[0] && o.script[0]["#text"] || "";
    });
    if (!xmlObject)
      throw new Error("template xml invalid");
    const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars2);
    if (dataObject == null ? void 0 : dataObject[":@"]) {
      const attrs = dataObject[":@"];
      if (util_default.isFunction(dataProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.merge(_data, result);
      }
    }
    if (varsObject == null ? void 0 : varsObject[":@"]) {
      const attrs = varsObject[":@"];
      if (util_default.isFunction(varsProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.merge(_vars, result);
      }
    }
    return new Template_default(completeObject, _data, _vars, extendsScript, formObject);
  }
  static parseSceneXML(content, data = {}, vars2 = {}) {
    let xmlObject, varsObject, formObject, dataObject, extendsScript;
    xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o) => {
      if (o.scene)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
      if (o.form)
        formObject = o;
      if (o.script)
        extendsScript = o.script[0] && o.script[0]["#text"] || "";
    });
    if (!xmlObject)
      throw new Error("template scene xml invalid");
    const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars2);
    return new Scene_default(completeObject, util_default.merge(_data, data), util_default.merge(_vars, vars2), extendsScript, formObject);
  }
  static async parseSceneXMLPreprocessing(content, data = {}, vars2 = {}, dataProcessor, varsProcessor) {
    let xmlObject, varsObject, formObject, dataObject, extendsScript;
    xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$")).forEach((o) => {
      if (o.scene)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
      if (o.form)
        formObject = o;
      if (o.script)
        extendsScript = o.script[0] && o.script[0]["#text"] || "";
    });
    if (!xmlObject)
      throw new Error("template scene xml invalid");
    const { completeObject, data: _data, vars: _vars } = this.parseXMLObject(xmlObject, varsObject, dataObject, data, vars2);
    if (dataObject == null ? void 0 : dataObject[":@"]) {
      const attrs = dataObject[":@"];
      if (util_default.isFunction(dataProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.merge(_data, result);
      }
    }
    if (varsObject == null ? void 0 : varsObject[":@"]) {
      const attrs = varsObject[":@"];
      if (util_default.isFunction(varsProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.merge(_vars, result);
      }
    }
    return new Scene_default(completeObject, _data, _vars, extendsScript, formObject);
  }
  static parseElementJSON(content, data = {}, vars2 = {}, extendsScript = "") {
    return ElementFactory_default.createElement(util_default.isString(content) ? JSON.parse(content) : content, data, vars2, extendsScript);
  }
  static parseElementXML(content, data = {}, vars2 = {}, extendsScript = "") {
    const xmlObject = xmlParser.parse(content.replace(/\s<\s/g, "$#").replace(/\s>\s/g, "#$"))[0];
    if (!xmlObject)
      throw new Error("template element xml invalid");
    const { completeObject } = this.parseXMLObject(xmlObject);
    return ElementFactory_default.createElement(completeObject, data, vars2, extendsScript);
  }
  static convertXMLObject(obj, target = {}, jsonParse = false) {
    const type = Object.keys(obj)[0];
    target.type = type;
    for (let key in obj[":@"]) {
      let value = obj[":@"][key];
      key = {
        type: "__type",
        value: "__value"
      }[key] || key;
      let index;
      if (jsonParse && value && value[0] === "{" || value[0] === "[")
        try {
          value = JSON.parse(value);
        } catch {
        }
      if (key === "for-index")
        key = "forIndex";
      else if (key === "for-item")
        key = "forItem";
      else if ((index = key.indexOf("-")) != -1) {
        const pkey = key.substring(0, index);
        const ckey = key.substring(index + 1, key.length);
        if (!target[pkey])
          target[pkey] = {};
        target[pkey][ckey] = value;
        continue;
      }
      target[key] = value;
    }
    target.children = [];
    obj[type].forEach((v) => {
      if (v["#text"])
        return target.value = v["#text"];
      const result = this.convertXMLObject(v, {});
      result && target.children.push(result);
    });
    return target;
  }
};
var Parser_default = Parser;

// src/parsers/OldParser.ts
var import_xmlbuilder22 = require("xmlbuilder2");
var import_fast_xml_parser2 = require("fast-xml-parser");
var xmlParser2 = new import_fast_xml_parser2.XMLParser({
  allowBooleanAttributes: true,
  ignoreAttributes: false,
  attributeNamePrefix: "",
  preserveOrder: true,
  parseTagValue: false,
  stopNodes: ["template.scene.voice.ssml"]
});
var OldParser = class {
  static toXML(template, pretty = false) {
    const root = (0, import_xmlbuilder22.create)({ version: "1.0" });
    const project = root.ele("project", {
      version: "1.0.0",
      id: template.id,
      name: template.name,
      actuator: template.actuator
    });
    const resources = project.ele("projRes");
    resources.map = {};
    const global = project.ele("global", {
      videoSize: template.aspectRatio,
      videoWidth: template.width,
      videoHeight: template.height,
      poster: template.poster,
      fps: template.fps,
      captureTime: !util_default.isUndefined(template.captureTime) ? template.captureTime / 1e3 : void 0,
      videoBitrate: 2097152,
      audioBitrate: 131072
    });
    if (template.backgroundColor) {
      global.ele("bgblock", {
        id: util_default.uniqid(),
        inPoint: 0,
        fillColor: template.backgroundColor
      });
    }
    const storyBoards = project.ele("storyBoards");
    template.children.forEach((node) => node.renderOldXML(storyBoards, resources, global));
    return project.end({ prettyPrint: pretty });
  }
  static toBuffer(template) {
    return Buffer.from(this.toXML(template));
  }
  static parseXML(content, data = {}, vars2 = {}) {
    const xmlObject = xmlParser2.parse(content);
    function merge(obj, target = {}) {
      Object.assign(target, obj[":@"]);
      const key = Object.keys(obj).filter((k) => k != ":@")[0];
      target.key = key;
      if (key === "#text")
        return obj[key];
      const items = obj[key];
      target.children = items.map((v) => v && merge(v, {}));
      return target;
    }
    const rawObject = merge(xmlObject[1] || xmlObject[0]);
    const {
      type,
      name,
      actuator,
      compile,
      children: [projRes, global, storyBoards]
    } = rawObject;
    const resourceMap = {};
    projRes.children.forEach((resource) => resourceMap[resource.id] = resource);
    function buildBaseData(obj, parentDuration) {
      return {
        id: obj.id,
        name: obj.name,
        x: obj.scaleX,
        y: obj.scaleY,
        width: obj.width,
        height: obj.height,
        opacity: obj.opacity,
        zIndex: obj.index,
        strokeStyle: obj.strokeStyle,
        strokeColor: obj.strokeColor,
        strokeWidth: obj.strokeWidth,
        enterEffect: obj.animationIn ? {
          type: obj.animationIn,
          duration: obj.animationInDuration * 1e3
        } : void 0,
        exitEffect: obj.animationOut ? {
          type: obj.animationOut,
          duration: obj.animationOutDuration * 1e3
        } : void 0,
        backgroundColor: obj.fillColor || void 0,
        startTime: Number(obj.inPoint) ? Number(obj.inPoint) * 1e3 : 0,
        endTime: Number(obj.outPoint) ? Number(obj.outPoint) * 1e3 : parentDuration ? parentDuration * 1e3 : void 0
      };
    }
    const templateChildren = [];
    let templateBackgroundColor;
    global.children.forEach((tag) => {
      switch (tag.key) {
        case "bgblock":
          templateBackgroundColor = tag.fillColor;
          break;
        case "bgimg":
          templateChildren.push(new Image_default(__spreadProps(__spreadValues({}, buildBaseData(tag)), {
            x: 0,
            y: 0,
            width: global.videoWidth,
            height: global.videoHeight,
            endTime: void 0,
            isBackground: true,
            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : void 0
          })));
          break;
        case "bgmusic":
          templateChildren.push(new Audio_default(__spreadProps(__spreadValues({}, buildBaseData(tag)), {
            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : void 0,
            volume: tag.volume,
            duration: tag.duration ? tag.duration * 1e3 : void 0,
            seekStart: tag.seekStart ? tag.seekStart * 1e3 : void 0,
            seekEnd: tag.seekEnd ? tag.seekEnd * 1e3 : void 0,
            muted: tag.muted,
            loop: tag.loop,
            isBackground: true,
            fadeInDuration: tag.inPoint ? tag.inPoint * 1e3 : void 0,
            fadeOutDuration: tag.outPoint ? tag.outPoint * 1e3 : void 0
          })));
          break;
        case "bgvideo":
          templateChildren.push(new Video_default(__spreadProps(__spreadValues({}, buildBaseData(tag)), {
            x: 0,
            y: 0,
            width: global.videoWidth,
            height: global.videoHeight,
            poster: tag.poster,
            src: resourceMap[tag.resId] ? resourceMap[tag.resId].resPath : void 0,
            duration: tag.duration ? tag.duration * 1e3 : void 0,
            volume: tag.volume,
            muted: tag.muted,
            loop: tag.loop,
            endTime: void 0,
            isBackground: true,
            seekStart: tag.seekStart ? tag.seekStart * 1e3 : void 0,
            seekEnd: tag.seekEnd ? tag.seekEnd * 1e3 : void 0,
            demuxSrc: tag.demuxSrc
          })));
          break;
      }
    });
    storyBoards.children.forEach((board) => {
      const { id, poster, duration } = board;
      const sceneChildren = [];
      let sceneBackgroundColor;
      let transition;
      board.children.forEach((data2) => {
        switch (data2.key) {
          case "bgblock":
            sceneBackgroundColor = data2.fillColor;
            break;
          case "bgimg":
            sceneChildren.push(new Image_default(__spreadProps(__spreadValues({}, buildBaseData(data2, duration)), {
              x: 0,
              y: 0,
              width: global.videoWidth,
              height: global.videoHeight,
              endTime: void 0,
              isBackground: true,
              src: resourceMap[data2.resId] ? resourceMap[data2.resId].resPath : void 0
            })));
            break;
          case "bgvideo":
            sceneChildren.push(new Video_default(__spreadProps(__spreadValues({}, buildBaseData(data2, duration)), {
              x: 0,
              y: 0,
              width: global.videoWidth,
              height: global.videoHeight,
              poster: data2.poster,
              src: resourceMap[data2.resId] ? resourceMap[data2.resId].resPath : void 0,
              duration: data2.duration ? data2.duration * 1e3 : void 0,
              volume: data2.volume,
              muted: data2.muted,
              loop: data2.loop,
              endTime: void 0,
              isBackground: true,
              seekStart: data2.seekStart ? data2.seekStart * 1e3 : void 0,
              seekEnd: data2.seekEnd ? data2.seekEnd * 1e3 : void 0
            })));
            break;
          case "transition":
            transition = {
              type: data2.name,
              duration: data2.duration * 1e3
            };
            break;
          case "captions":
            data2.children.forEach((caption) => {
              var _a;
              return sceneChildren.push(new Text_default(__spreadProps(__spreadValues({}, buildBaseData(caption, duration)), {
                value: (_a = caption.children[0]) == null ? void 0 : _a.children.join("\n"),
                fontFamily: caption.fontFamily ? caption.fontFamily.replace(/\.ttf|\.otf$/, "") : void 0,
                fontSize: caption.fontSize,
                fontColor: caption.fontColor,
                fontWeight: caption.bold ? 700 : void 0,
                fontStyle: caption.italic ? "italic" : void 0,
                lineHeight: parseFloat((Number(caption.lineHeight) / Number(caption.fontSize)).toFixed(3)),
                wordSpacing: caption.wordSpacing,
                textAlign: caption.textAlign,
                effectType: caption.effectType,
                effectWordDuration: caption.effectWordDuration ? caption.effectWordDuration * 1e3 : void 0,
                effectWordInterval: caption.effectWordInterval ? caption.effectWordInterval * 1e3 : void 0,
                styleType: caption.styleType,
                textShadow: caption.textShadow,
                textStroke: caption.textStroke,
                textBackground: caption.textBackground,
                textFillColor: caption.textFillColor,
                fillColorIntension: caption.fillColorIntension
              })));
            });
            break;
          case "resources":
            data2.children.forEach((tag) => {
              if (!resourceMap[tag.resId])
                return;
              const { type: type2, resPath } = resourceMap[tag.resId];
              let element;
              switch (type2) {
                case "img":
                case "gif":
                  element = new Image_default(__spreadProps(__spreadValues({}, buildBaseData(tag, duration)), {
                    crop: tag.cropStyle ? {
                      style: tag.cropStyle === "circle" ? "circle" : "rect",
                      x: tag.cropX,
                      y: tag.cropY,
                      width: tag.cropWidth,
                      height: tag.cropHeight
                    } : void 0,
                    src: resPath,
                    loop: tag.loop,
                    dynamic: resPath.indexOf(".gif") !== -1 ? true : type2 === "gif"
                  }));
                  break;
                case "video":
                  element = new Video_default(__spreadProps(__spreadValues({}, buildBaseData(tag, duration)), {
                    poster: data2.poster,
                    src: resPath,
                    crop: tag.cropStyle ? {
                      style: tag.cropStyle === "circle" ? "circle" : "rect",
                      x: tag.cropX,
                      y: tag.cropY,
                      width: tag.cropWidth,
                      height: tag.cropHeight
                    } : void 0,
                    duration: data2.duration ? data2.duration * 1e3 : void 0,
                    volume: data2.volume,
                    muted: data2.muted,
                    loop: data2.loop,
                    seekStart: data2.seekStart ? data2.seekStart * 1e3 : void 0,
                    seekEnd: data2.seekEnd ? data2.seekEnd * 1e3 : void 0,
                    demuxSrc: data2.demuxSrc
                  }));
                  break;
                case "sound":
                  element = new Audio_default(__spreadProps(__spreadValues({}, buildBaseData(tag, duration)), {
                    src: resPath,
                    duration: data2.duration,
                    volume: data2.volume,
                    muted: data2.muted,
                    loop: data2.loop,
                    seekStart: data2.seekStart ? data2.seekStart * 1e3 : void 0,
                    seekEnd: data2.seekEnd ? data2.seekEnd * 1e3 : void 0,
                    fadeInDuration: data2.inPoint ? data2.inPoint * 1e3 : void 0,
                    fadeOutDuration: data2.outPoint ? data2.outPoint * 1e3 : void 0
                  }));
              }
              element && sceneChildren.push(element);
            });
            break;
          case "dynDataCharts":
            data2.children.forEach((chart) => sceneChildren.push(new Chart_default(__spreadProps(__spreadValues({}, buildBaseData(chart, duration)), {
              chartId: chart.chartId,
              poster: chart.poster,
              duration: !util_default.isUndefined(chart.duration) ? chart.duration * 1e3 : void 0,
              configSrc: chart.optionsPath,
              dataSrc: chart.dataPath
            }))));
            break;
          case "textToSounds":
            data2.children.forEach((voice) => {
              var _a;
              return sceneChildren.push(new Voice_default(__spreadProps(__spreadValues({}, buildBaseData(voice, duration)), {
                src: resourceMap[voice.resId] ? resourceMap[voice.resId].resPath : void 0,
                volume: voice.volume,
                seekStart: voice.seekStart ? voice.seekStart * 1e3 : void 0,
                seekEnd: voice.seekEnd ? voice.seekEnd * 1e3 : void 0,
                loop: voice.loop,
                muted: voice.muted,
                provider: voice.provider,
                children: voice.children[0] ? [
                  new SSML_default({
                    value: (_a = voice.children[0]) == null ? void 0 : _a.children[0]
                  })
                ] : [
                  new SSML_default({
                    value: (0, import_xmlbuilder22.create)({
                      speak: {
                        "@provider": voice.provider,
                        voice: {
                          "@name": voice.voice,
                          prosody: {
                            "@contenteditable": true,
                            "@rate": Number(voice.speechRate) === 0 ? 1 : voice.speechRate,
                            p: voice.text
                          }
                        }
                      }
                    }).end()
                  })
                ],
                text: voice.text,
                declaimer: voice.voice,
                speechRate: Number(voice.speechRate) === 0 ? 1 : voice.speechRate,
                pitchRate: util_default.isFinite(Number(voice.pitchRate)) ? Number(voice.pitchRate) + 1 : void 0
              })));
            });
            break;
          case "vtubers":
            data2.children.forEach((vtuber) => sceneChildren.push(new Vtuber_default(__spreadProps(__spreadValues({}, buildBaseData(vtuber, duration)), {
              poster: vtuber.poster,
              src: resourceMap[vtuber.resId] ? resourceMap[vtuber.resId].resPath : void 0,
              provider: vtuber.provider,
              text: vtuber.text,
              solution: vtuber.solution,
              declaimer: vtuber.declaimer,
              cutoutColor: vtuber.cutoutColor,
              duration: vtuber.duration ? vtuber.duration * 1e3 : void 0,
              volume: vtuber.volume,
              muted: vtuber.muted,
              loop: vtuber.loop,
              seekStart: vtuber.seekStart ? vtuber.seekStart * 1e3 : void 0,
              seekEnd: vtuber.seekEnd ? vtuber.seekEnd * 1e3 : void 0,
              demuxSrc: vtuber.demuxSrc
            }))));
        }
      });
      templateChildren.push(new Scene_default({
        id,
        poster,
        width: global.videoWidth,
        height: global.videoHeight,
        aspectRatio: global.videoSize,
        duration: duration * 1e3,
        backgroundColor: sceneBackgroundColor,
        transition,
        filter: void 0,
        children: sceneChildren
      }));
    });
    return new Template_default({
      mode: type || "scene",
      name,
      poster: global.poster,
      actuator,
      width: global.videoWidth,
      height: global.videoHeight,
      aspectRatio: global.videoSize,
      backgroundColor: templateBackgroundColor,
      captureTime: util_default.isFinite(Number(global.captureTime)) ? global.captureTime * 1e3 : void 0,
      fps: global.fps,
      compile,
      children: templateChildren
    }, data, vars2);
  }
};
var OldParser_default = OldParser;

// src/parsers/OptionsParser.ts
var OptionsParser = class {
  static toOptions(template) {
    let globalImage;
    let globalVideo;
    let globalAudio;
    const children = [];
    template.children.forEach((node) => {
      if (Element_default.isInstance(node)) {
        node = node;
        if (node.isBackground) {
          switch (node.type) {
            case "image":
              globalImage = node;
              break;
            case "video":
              globalVideo = node;
              break;
            case "audio":
              globalAudio = node;
              break;
          }
        }
      } else
        children.push(node);
    });
    const storyBoards = [];
    children.forEach((node) => storyBoards.push(node.toOptions()));
    return {
      id: template.id,
      name: template.name,
      actuator: template.actuator,
      videoSize: template.aspectRatio,
      videoWidth: template.width,
      videoHeight: template.height,
      original: template.original,
      poster: template.poster,
      fps: template.fps,
      captureTime: !util_default.isUndefined(template.captureTime) ? template.captureTime / 1e3 : void 0,
      duration: util_default.millisecondsToSenconds(template.duration),
      videoBitrate: template.videoBitrate,
      audioBitrate: template.audioBitrate,
      bgColor: { id: util_default.uniqid(), fillColor: template.backgroundColor },
      bgImage: globalImage ? globalImage.toOptions() : void 0,
      bgVideo: globalVideo ? globalVideo.toOptions() : void 0,
      bgMusic: globalAudio ? globalAudio.toOptions() : void 0,
      storyboards: storyBoards
    };
  }
  static parseBaseOptions(obj, parentDuration) {
    return {
      id: obj.id,
      name: obj.name || void 0,
      x: obj.left,
      y: obj.top,
      width: obj.width,
      height: obj.height,
      opacity: obj.opacity,
      rotate: obj.rotate,
      zIndex: obj.index,
      strokeStyle: obj.strokeStyle,
      strokeColor: obj.strokeColor,
      strokeWidth: obj.strokeWidth,
      enterEffect: obj.animationIn && obj.animationIn.name && obj.animationIn.name !== "none" ? {
        type: obj.animationIn.name,
        duration: obj.animationIn.duration * 1e3
      } : void 0,
      exitEffect: obj.animationOut && obj.animationOut.name && obj.animationOut.name !== "none" ? {
        type: obj.animationOut.name,
        duration: obj.animationOut.duration * 1e3
      } : void 0,
      backgroundColor: obj.fillColor,
      startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1e3 : 0,
      endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1e3 : parentDuration ? parentDuration * 1e3 : void 0
    };
  }
  static parseElementOptions(options, parentDuration) {
    var _a, _b;
    if (util_default.isString(options))
      options = JSON.parse(options);
    switch (options.elementType) {
      case "image":
        return new Image_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          crop: options.crop ? {
            style: options.crop.style,
            x: options.crop.left,
            y: options.crop.top,
            width: options.crop.width,
            height: options.crop.height,
            clipType: options.crop.clipType,
            clipStyle: options.crop.clipStyle
          } : void 0,
          src: options.src,
          loop: options.loop,
          dynamic: options.src.indexOf(".gif") !== -1,
          naturalWidth: options.naturalWidth,
          naturalHeight: options.naturalHeight
        }));
      case "sticker":
        return new Sticker_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          src: options.src,
          loop: options.loop,
          drawType: options.drawType,
          editable: options.editable,
          distortable: options.distortable
        }));
      case "text":
        return new Text_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          width: options.width || options.renderWidth || 0,
          height: options.height || options.renderHeight || 0,
          value: options.content,
          fontFamily: options.fontFamily ? options.fontFamily.replace(/\.ttf|\.otf$/, "") : void 0,
          fontSize: options.fontSize,
          fontColor: options.fontColor,
          fontWeight: options.bold,
          fontStyle: options.italic === "italic" ? "italic" : void 0,
          lineHeight: parseFloat((Number(options.lineHeight) / Number(options.fontSize)).toFixed(3)),
          wordSpacing: options.wordSpacing,
          textAlign: options.textAlign,
          effectType: options.effectType,
          effectWordDuration: options.effectWordDuration ? options.effectWordDuration * 1e3 : void 0,
          effectWordInterval: options.effectWordInterval ? options.effectWordInterval * 1e3 : void 0,
          styleType: options.styleType === "" ? void 0 : options.styleType,
          isSubtitle: options.isSubtitle,
          textShadow: util_default.omitBy(options.textShadow, (v) => util_default.isNil(v) || v === 0 || v === ""),
          textStroke: util_default.omitBy(options.textStroke, (v) => util_default.isNil(v) || v === 0 || v === ""),
          textBackground: options.textBackground === "" ? void 0 : options.textBackground,
          textFillColor: options.textFillColor === "" ? void 0 : options.textFillColor,
          fillColorIntension: options.fillColorIntension === 0 ? void 0 : options.fillColorIntension
        }));
      case "audio":
        return new Audio_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          src: options.src,
          duration: options.duration ? options.duration * 1e3 : void 0,
          volume: options.volume,
          muted: options.muted,
          loop: options.loop,
          seekStart: options.seekStart ? options.seekStart * 1e3 : void 0,
          seekEnd: options.seekEnd ? options.seekEnd * 1e3 : void 0,
          isRecord: options.isRecord,
          fadeInDuration: options.fadeInDuration ? options.fadeInDuration * 1e3 : void 0,
          fadeOutDuration: options.fadeOutDuration ? options.fadeOutDuration * 1e3 : void 0
        }));
      case "voice":
        return new Voice_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          src: options.src,
          duration: options.duration ? options.duration * 1e3 : void 0,
          volume: options.volume,
          seekStart: options.seekStart ? options.seekStart * 1e3 : void 0,
          seekEnd: options.seekEnd ? options.seekEnd * 1e3 : void 0,
          loop: options.loop,
          muted: options.muted,
          provider: options.provider,
          children: options.ssml ? [
            new SSML_default({
              value: options.ssml
            })
          ] : [],
          text: options.text,
          declaimer: options.voice,
          speechRate: options.playbackRate ? options.playbackRate : void 0,
          pitchRate: options.pitchRate ? Number(options.pitchRate) + 1 : void 0
        }));
      case "video":
        return new Video_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          poster: options.poster,
          src: options.src,
          crop: options.crop ? {
            style: options.crop.style,
            x: options.crop.left,
            y: options.crop.top,
            width: options.crop.width,
            height: options.crop.height,
            clipType: options.crop.clipType,
            clipStyle: options.crop.clipStyle
          } : void 0,
          duration: options.duration ? options.duration * 1e3 : void 0,
          volume: options.volume,
          muted: options.muted,
          loop: options.loop,
          seekStart: options.seekStart ? options.seekStart * 1e3 : void 0,
          seekEnd: options.seekEnd ? options.seekEnd * 1e3 : void 0,
          demuxSrc: options.demuxSrc
        }));
      case "chart":
        return new Chart_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          chartId: options.chartId,
          poster: options.poster,
          duration: !util_default.isUndefined(options.duration) ? options.duration * 1e3 : void 0,
          configSrc: options.optionsPath,
          dataSrc: options.dataPath
        }));
      case "canvas":
        return new Canvas_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          chartId: options.chartId,
          poster: options.poster,
          duration: !util_default.isUndefined(options.duration) ? options.duration * 1e3 : void 0,
          configSrc: options.optionPath,
          dataSrc: options.dataPath
        }));
      case "vtuber":
        return new Vtuber_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          poster: options.poster,
          src: options.src,
          provider: options.provider,
          text: options.text,
          solution: options.solution,
          declaimer: options.declaimer,
          cutoutColor: options.cutoutColor,
          duration: options.duration ? options.duration * 1e3 : void 0,
          volume: options.volume,
          muted: options.muted,
          loop: options.loop,
          seekStart: options.seekStart ? options.seekStart * 1e3 : void 0,
          seekEnd: options.seekEnd ? options.seekEnd * 1e3 : void 0,
          demuxSrc: options.demuxSrc
        }));
      case "group":
        return new Group_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          children: (_a = options.children || options.elements) == null ? void 0 : _a.map((element) => this.parseElementOptions(element, parentDuration))
        }));
      case "subtitle":
        return new Subtitle_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options, parentDuration)), {
          children: (_b = options.children || options.elements) == null ? void 0 : _b.map((element) => this.parseElementOptions(element, parentDuration))
        }));
      default:
        return new Element_default({});
    }
  }
  static parseSceneOptions(options, formObject) {
    var _a;
    if (util_default.isString(options))
      options = JSON.parse(options);
    const children = [];
    const { id, poster, duration } = options;
    options.bgImage && children.push(new Image_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgImage, duration)), {
      endTime: void 0,
      isBackground: true,
      src: options.bgImage.src,
      naturalWidth: options.bgImage.naturalWidth,
      naturalHeight: options.bgImage.naturalHeight
    })));
    options.bgVideo && children.push(new Video_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgVideo, duration)), {
      poster: options.bgVideo.poster,
      src: options.bgVideo.src,
      duration: options.bgVideo.duration ? options.bgVideo.duration * 1e3 : void 0,
      volume: options.bgVideo.volume,
      muted: options.bgVideo.muted,
      loop: options.bgVideo.loop,
      endTime: void 0,
      isBackground: true,
      seekStart: options.bgVideo.seekStart ? options.bgVideo.seekStart * 1e3 : void 0,
      seekEnd: options.bgVideo.seekEnd ? options.bgVideo.seekEnd * 1e3 : void 0
    })));
    options.bgMusic && children.push(new Audio_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgMusic, duration)), {
      src: options.bgMusic.src,
      volume: options.bgMusic.volume,
      duration: options.bgMusic.duration ? options.bgMusic.duration * 1e3 : void 0,
      seekStart: options.bgMusic.seekStart ? options.bgMusic.seekStart * 1e3 : void 0,
      seekEnd: options.bgMusic.seekEnd ? options.bgMusic.seekEnd * 1e3 : void 0,
      muted: options.bgMusic.muted,
      loop: options.bgMusic.loop,
      isBackground: true,
      fadeInDuration: options.bgMusic.fadeInDuration ? options.bgMusic.fadeInDuration * 1e3 : void 0,
      fadeOutDuration: options.bgMusic.fadeOutDuration ? options.bgMusic.fadeOutDuration * 1e3 : void 0
    })));
    (_a = options.children || options.elements) == null ? void 0 : _a.forEach((element) => children.push(this.parseElementOptions(element, duration)));
    return new Scene_default({
      id,
      poster,
      width: options.videoWidth,
      height: options.videoHeight,
      aspectRatio: options.videoSize,
      original: options.original,
      duration: duration * 1e3,
      backgroundColor: options.bgColor ? options.bgColor.fillColor : void 0,
      transition: options.transition ? {
        type: options.transition.name,
        duration: options.transition.duration * 1e3
      } : void 0,
      filter: void 0,
      compile: options.compile,
      children
    }, void 0, void 0, void 0, formObject);
  }
  static parseOptions(options, formObject) {
    if (util_default.isString(options))
      options = JSON.parse(options);
    const children = [];
    options == null ? void 0 : options.storyboards.map((board) => children.push(this.parseSceneOptions(board)));
    options.bgImage && children.push(new Image_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgImage)), {
      endTime: void 0,
      isBackground: true,
      src: options.bgImage.src,
      naturalWidth: options.bgImage.naturalWidth,
      naturalHeight: options.bgImage.naturalHeight
    })));
    options.bgVideo && children.push(new Video_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgVideo)), {
      poster: options.bgVideo.poster,
      src: options.bgVideo.src,
      duration: options.bgVideo.duration ? options.bgVideo.duration * 1e3 : void 0,
      volume: options.bgVideo.volume,
      muted: options.bgVideo.muted,
      loop: options.bgVideo.loop,
      endTime: void 0,
      isBackground: true,
      seekStart: options.bgVideo.seekStart ? options.bgVideo.seekStart * 1e3 : void 0,
      seekEnd: options.bgVideo.seekEnd ? options.bgVideo.seekEnd * 1e3 : void 0
    })));
    options.bgMusic && children.push(new Audio_default(__spreadProps(__spreadValues({}, this.parseBaseOptions(options.bgMusic)), {
      src: options.bgMusic.src,
      volume: options.bgMusic.volume,
      duration: options.bgMusic.duration ? options.bgMusic.duration * 1e3 : void 0,
      seekStart: options.bgMusic.seekStart ? options.bgMusic.seekStart * 1e3 : void 0,
      seekEnd: options.bgMusic.seekEnd ? options.bgMusic.seekEnd * 1e3 : void 0,
      muted: options.bgMusic.muted,
      loop: options.bgMusic.loop,
      isBackground: true,
      fadeInDuration: options.bgMusic.fadeInDuration ? options.bgMusic.fadeInDuration * 1e3 : void 0,
      fadeOutDuration: options.bgMusic.fadeOutDuration ? options.bgMusic.fadeOutDuration * 1e3 : void 0
    })));
    return new Template_default({
      id: options.id,
      name: options.name,
      actuator: options.actuator || void 0,
      fps: options.fps,
      poster: options.poster,
      width: options.videoWidth,
      height: options.videoHeight,
      aspectRatio: options.videoSize,
      original: options.original,
      videoBitrate: `${options.videoBitrate}`,
      audioBitrate: `${options.audioBitrate}`,
      backgroundColor: options.bgColor ? options.bgColor.fillColor || void 0 : void 0,
      captureTime: util_default.isFinite(options.captureTime) ? options.captureTime * 1e3 : void 0,
      compile: options.compile,
      children
    }, void 0, void 0, void 0, formObject);
  }
};
var OptionsParser_default = OptionsParser;

// src/elements/Element.ts
var Effect = class {
  type = "";
  duration = 0;
  direction;
  path;
  constructor(options) {
    util_default.optionsInject(this, options, {
      duration: (v) => Number(v),
      path: (v) => util_default.isString(v) ? v.split(",") : v
    }, {
      type: (v) => util_default.isString(v),
      duration: (v) => util_default.isFinite(v),
      direction: (v) => util_default.isUndefined(v) || util_default.isString(v),
      path: (v) => util_default.isUndefined(v) || util_default.isArray(v)
    });
  }
  toOptions(startTime = 0) {
    return {
      name: this.type,
      delay: util_default.millisecondsToSenconds(startTime),
      duration: util_default.millisecondsToSenconds(this.duration),
      direction: this.direction,
      path: this.path
    };
  }
  static isInstance(value) {
    return value instanceof Effect;
  }
};
var _parent;
var _Element = class {
  constructor(options, type = ElementTypes_default.Element, data = {}, vars2 = {}) {
    __publicField(this, "type", ElementTypes_default.Element);
    __publicField(this, "id", "");
    __publicField(this, "name");
    __publicField(this, "x");
    __publicField(this, "y");
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "zIndex");
    __publicField(this, "rotate");
    __publicField(this, "opacity");
    __publicField(this, "scaleWidth");
    __publicField(this, "scaleHeight");
    __publicField(this, "enterEffect");
    __publicField(this, "exitEffect");
    __publicField(this, "stayEffect");
    __publicField(this, "isBackground");
    __publicField(this, "backgroundColor");
    __publicField(this, "startTime");
    __publicField(this, "endTime");
    __publicField(this, "strokeStyle");
    __publicField(this, "strokeColor");
    __publicField(this, "strokeWidth");
    __publicField(this, "fixedScale");
    __publicField(this, "trackId");
    __publicField(this, "value");
    __publicField(this, "children", []);
    __publicField(this, "absoluteStartTime");
    __publicField(this, "absoluteEndTime");
    __privateAdd(this, _parent, void 0);
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    options.compile && (options = Compiler_default.compile(options, data, vars2));
    util_default.optionsInject(this, options, {
      type: (v) => util_default.defaultTo(v, type),
      id: (v) => util_default.defaultTo(_Element.isId(v) ? v : void 0, util_default.uniqid()),
      x: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      y: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      width: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      height: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      zIndex: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      rotate: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      opacity: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      scaleWidth: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      scaleHeight: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      strokeWidth: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      startTime: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      endTime: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      fixedScale: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      enterEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      exitEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      stayEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      isBackground: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      children: (datas) => util_default.isArray(datas) ? datas.map((options2) => {
        const node = _Element.isInstance(options2) ? options2 : ElementFactory_default.createElement(options2, data, vars2);
        node.parent = this;
        return node;
      }) : []
    }, {
      type: (v) => util_default.isString(v),
      id: (v) => _Element.isId(v),
      name: (v) => util_default.isUndefined(v) || util_default.isString(v),
      x: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      y: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      width: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      height: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      zIndex: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      rotate: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      opacity: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      scaleWidth: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      scaleHeight: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      enterEffect: (v) => util_default.isUndefined(v) || Effect.isInstance(v),
      exitEffect: (v) => util_default.isUndefined(v) || Effect.isInstance(v),
      stayEffect: (v) => util_default.isUndefined(v) || Effect.isInstance(v),
      strokeStyle: (v) => util_default.isUndefined(v) || util_default.isString(v),
      strokeColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      strokeWidth: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      isBackground: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      backgroundColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      startTime: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      endTime: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      fixedScale: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      trackId: (v) => util_default.isUndefined(v) || util_default.isString(v),
      value: (v) => util_default.isUndefined(v) || util_default.isString(v) || v === null,
      children: (v) => util_default.isArray(v)
    });
  }
  getMaxDuration() {
    const maxDuration = Math.max(...this.children.map((node) => Voice_default.isInstance(node) || Vtuber_default.isInstance(node) ? node.getMaxDuration() : 0));
    return Math.max(maxDuration, (this.endTime || 0) - (this.startTime || 0));
  }
  renderXML(parent) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    const element = (parent || (0, import_xmlbuilder23.create)()).ele(this.type, {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      zIndex: this.zIndex,
      rotate: this.rotate,
      opacity: this.opacity,
      scaleWidth: this.scaleWidth,
      scaleHeight: this.scaleHeight,
      "enterEffect-type": (_b = (_a = this.enterEffect) == null ? void 0 : _a.type) != null ? _b : void 0,
      "enterEffect-duration": (_d = (_c = this.enterEffect) == null ? void 0 : _c.duration) != null ? _d : void 0,
      "enterEffect-direction": (_f = (_e = this.enterEffect) == null ? void 0 : _e.direction) != null ? _f : void 0,
      "enterEffect-path": (_i = (_h = (_g = this.enterEffect) == null ? void 0 : _g.path) == null ? void 0 : _h.join(",")) != null ? _i : void 0,
      "exitEffect-type": (_k = (_j = this.exitEffect) == null ? void 0 : _j.type) != null ? _k : void 0,
      "exitEffect-duration": (_m = (_l = this.exitEffect) == null ? void 0 : _l.duration) != null ? _m : void 0,
      "exitEffect-direction": (_o = (_n = this.exitEffect) == null ? void 0 : _n.direction) != null ? _o : void 0,
      "exitEffect-path": (_r = (_q = (_p = this.exitEffect) == null ? void 0 : _p.path) == null ? void 0 : _q.join(",")) != null ? _r : void 0,
      "stayEffect-type": (_t = (_s = this.stayEffect) == null ? void 0 : _s.type) != null ? _t : void 0,
      "stayEffect-duration": (_v = (_u = this.stayEffect) == null ? void 0 : _u.duration) != null ? _v : void 0,
      "stayEffect-path": (_y = (_x = (_w = this.stayEffect) == null ? void 0 : _w.path) == null ? void 0 : _x.join(",")) != null ? _y : void 0,
      strokeStyle: this.strokeStyle,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      isBackground: this.isBackground,
      backgroundColor: this.backgroundColor,
      startTime: this.startTime,
      endTime: this.endTime
    });
    (_z = this.children) == null ? void 0 : _z.forEach((node) => _Element.isInstance(node) && node.renderXML(element));
    return element;
  }
  renderOldXML(parent, resources, global, skip) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (skip) {
      (_a = this.children) == null ? void 0 : _a.forEach((node) => _Element.isInstance(node) && node.renderOldXML(parent, resources, global));
      return parent;
    }
    const attributes = {
      id: this.id,
      name: this.name,
      scaleX: this.x,
      scaleY: this.y,
      width: this.width,
      height: this.height,
      index: this.zIndex,
      rotate: this.rotate,
      opacity: this.opacity,
      animationIn: (_c = (_b = this.enterEffect) == null ? void 0 : _b.type) != null ? _c : void 0,
      animationInDuration: ((_d = this.enterEffect) == null ? void 0 : _d.duration) ? util_default.millisecondsToSenconds(this.enterEffect.duration) : void 0,
      animationOut: (_f = (_e = this.exitEffect) == null ? void 0 : _e.type) != null ? _f : void 0,
      animationOutDuration: ((_g = this.exitEffect) == null ? void 0 : _g.duration) ? util_default.millisecondsToSenconds(this.exitEffect.duration) : void 0,
      strokeStyle: this.strokeStyle,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      inPoint: util_default.isNumber(this.startTime) ? util_default.millisecondsToSenconds(this.startTime) : void 0,
      outPoint: util_default.isNumber(this.endTime) ? util_default.millisecondsToSenconds(this.endTime) : void 0
    };
    let element;
    if (global) {
      element = global.ele({
        [ElementTypes_default.Audio]: "bgmusic",
        [ElementTypes_default.Image]: "bgimg",
        [ElementTypes_default.Video]: "bgvideo"
      }[this.type], attributes);
    } else {
      element = (util_default.isFunction(parent) ? parent({
        [ElementTypes_default.Text]: "captions",
        [ElementTypes_default.Image]: "resources",
        [ElementTypes_default.Audio]: "resources",
        [ElementTypes_default.Video]: "resources",
        [ElementTypes_default.Voice]: "textToSounds",
        [ElementTypes_default.Chart]: "dynDataCharts",
        [ElementTypes_default.Canvas]: "dynDataCharts",
        [ElementTypes_default.Vtuber]: "vtubers"
      }[this.type]) : parent || (0, import_xmlbuilder23.create)()).ele({
        [ElementTypes_default.Text]: "caption",
        [ElementTypes_default.Image]: "resource",
        [ElementTypes_default.Audio]: "resource",
        [ElementTypes_default.Video]: "resource",
        [ElementTypes_default.Voice]: "textToSound",
        [ElementTypes_default.SSML]: "ssml",
        [ElementTypes_default.Chart]: "dynDataChart",
        [ElementTypes_default.Canvas]: "dynDataChart",
        [ElementTypes_default.Vtuber]: "vtuber"
      }[this.type], attributes);
    }
    (_h = this.children) == null ? void 0 : _h.forEach((node) => _Element.isInstance(node) && node.renderOldXML(element, resources, global));
    return element;
  }
  toXML(pretty = false) {
    const element = this.renderXML();
    return element.end({ prettyPrint: pretty, headless: true });
  }
  toOldXML(pretty = false) {
    const element = this.renderOldXML();
    return element.end({ prettyPrint: pretty, headless: true });
  }
  static parse(content, data = {}, vars2 = {}) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return ElementFactory_default.createElement(content, data, vars2);
    if (util_default.isString(content))
      return _Element.parseXML(content, data, vars2);
    return _Element.parseJSON(content, data, vars2);
  }
  toOptions() {
    var _a, _b;
    const children = [];
    this.children.forEach((node) => _Element.isInstance(node) && children.push(node.toOptions()));
    return {
      elementType: this.type,
      id: this.id,
      type: {
        image: "img",
        video: "video",
        audio: "sound"
      }[this.type] || this.type,
      name: this.name,
      left: this.x,
      top: this.y,
      width: this.width,
      height: this.height,
      rotate: this.rotate,
      opacity: this.opacity,
      index: this.zIndex || 0,
      strokeStyle: this.strokeStyle,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      animationIn: util_default.isNumber(this.startTime) ? ((_a = this.enterEffect) == null ? void 0 : _a.toOptions(this.startTime)) || { name: "none", delay: util_default.millisecondsToSenconds(this.startTime) } : void 0,
      animationOut: util_default.isNumber(this.endTime) ? ((_b = this.exitEffect) == null ? void 0 : _b.toOptions(this.endTime)) || { name: "none", delay: util_default.millisecondsToSenconds(this.endTime) } : void 0,
      children,
      elements: children,
      fillColor: this.backgroundColor
    };
  }
  update(value) {
    util_default.merge(this, value);
  }
  static isId(value) {
    return util_default.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
  }
  static isInstance(value) {
    return value instanceof _Element;
  }
  resize(width, height) {
    const scaleX = this.width ? width / this.width : 1;
    const scaleY = this.height ? height / this.height : 1;
    this.width && (this.width = width);
    this.height && (this.height = height);
    this.children.forEach((node) => node.rescale(scaleX, scaleY));
  }
  rescale(scaleX, scaleY) {
    this.x && (this.x = parseFloat((this.x * scaleX).toFixed(4)));
    this.y && (this.y = parseFloat((this.y * scaleY).toFixed(4)));
    this.width && (this.width = parseFloat((this.width * scaleX).toFixed(4)));
    this.height && (this.height = parseFloat((this.height * scaleY).toFixed(4)));
    this.children.forEach((node) => node.rescale(scaleX, scaleY));
  }
  resetEndTime(value) {
    this.endTime && (this.endTime += value);
    this.children.forEach((node) => node.resetEndTime(value));
  }
  generateTimeline(baseTime = 0, duration) {
    var _a;
    let track = [];
    (_a = this.children) == null ? void 0 : _a.forEach((node) => {
      track.push(__spreadProps(__spreadValues({}, node), {
        update: node.update.bind(node),
        absoluteStartTime: baseTime + (node.startTime || 0),
        absoluteEndTime: baseTime + (node.endTime || duration)
      }));
      track = track.concat(node.generateTimeline(baseTime, duration));
    });
    return track == null ? void 0 : track.sort((n1, n2) => n1.absoluteStartTime - n2.absoluteStartTime);
  }
  set parent(obj) {
    __privateSet(this, _parent, obj);
  }
  get parent() {
    return __privateGet(this, _parent);
  }
};
var Element2 = _Element;
_parent = new WeakMap();
__publicField(Element2, "Type", ElementTypes_default);
__publicField(Element2, "parseJSON", Parser_default.parseElementJSON.bind(Parser_default));
__publicField(Element2, "parseXML", Parser_default.parseElementXML.bind(Parser_default));
__publicField(Element2, "parseOptions", OptionsParser_default.parseElementOptions.bind(OptionsParser_default));
var Element_default = Element2;

// src/elements/Media.ts
var Media = class extends Element_default {
  poster;
  src;
  path;
  volume = 0;
  format;
  duration;
  seekStart;
  seekEnd;
  loop = false;
  playbackRate;
  filter;
  muted = false;
  constructor(options, type = ElementTypes_default.Media, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      loop: (v) => util_default.booleanParse(util_default.defaultTo(v, false)),
      volume: (v) => Number(util_default.defaultTo(v, 1)),
      duration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      seekStart: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      seekEnd: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      playbackRate: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      muted: (v) => util_default.booleanParse(util_default.defaultTo(v, false))
    }, {
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v),
      src: (v) => util_default.isUndefined(v) || util_default.isString(v),
      path: (v) => util_default.isUndefined(v) || util_default.isString(v),
      volume: (v) => util_default.isFinite(v),
      format: (v) => util_default.isUndefined(v) || util_default.isString(v),
      duration: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      seekStart: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      seekEnd: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      loop: (v) => util_default.isBoolean(v),
      playbackRate: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      filter: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      muted: (v) => util_default.isBoolean(v)
    });
  }
  renderXML(parent) {
    const media = super.renderXML(parent);
    media.att("poster", this.poster);
    media.att("src", this.src);
    media.att("volume", this.volume);
    media.att("format", this.format);
    media.att("duration", this.duration);
    media.att("seekStart", this.seekStart);
    media.att("seekEnd", this.seekEnd);
    media.att("loop", this.loop);
    media.att("playbackRate", this.playbackRate);
    media.att("muted", this.muted);
    return media;
  }
  renderOldXML(parent, resources, global) {
    const media = super.renderOldXML(parent, resources, global);
    let cacheResourceId, resourceId;
    if (this.src) {
      cacheResourceId = resources ? resources.map[this.src] : null;
      resourceId = cacheResourceId || util_default.uniqid();
    }
    media.att("poster", this.poster);
    media.att("volume", this.volume);
    media.att("format", this.format);
    media.att("resId", resourceId);
    util_default.isNumber(this.duration) && media.att("duration", this.duration / 1e3);
    util_default.isNumber(this.seekStart) && media.att("seekStart", this.seekStart / 1e3);
    util_default.isNumber(this.seekEnd) && media.att("seekEnd", this.seekEnd / 1e3);
    media.att("loop", this.loop);
    media.att("playbackRate", this.playbackRate);
    media.att("muted", this.muted);
    if (!this.src || cacheResourceId || !resources)
      return media;
    resources.map[this.src] = resourceId;
    resources.ele("resource", {
      id: resourceId,
      name: this.name,
      type: {
        [ElementTypes_default.Audio]: "sound",
        [ElementTypes_default.Voice]: "voice",
        [ElementTypes_default.Video]: "video"
      }[this.type],
      resPath: this.src
    });
    return media;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      src: this.src,
      poster: this.poster,
      format: this.format,
      duration: this.duration ? util_default.millisecondsToSenconds(this.duration) : void 0,
      volume: this.volume,
      loop: this.loop,
      seekStart: util_default.isNumber(this.seekStart) ? util_default.millisecondsToSenconds(this.seekStart) : void 0,
      seekEnd: util_default.isNumber(this.seekEnd) ? util_default.millisecondsToSenconds(this.seekEnd) : void 0,
      playbackRate: this.playbackRate,
      muted: this.muted,
      filter: this.filter
    });
  }
  static isInstance(value) {
    return value instanceof Media;
  }
};
var Media_default = Media;

// src/elements/Text.ts
var Text = class extends Element_default {
  fontFamily;
  fontSize = 0;
  fontColor = "";
  fontWeight = 0;
  fontStyle;
  lineHeight = 0;
  wordSpacing = 0;
  textAlign;
  lineWrap = false;
  effectType;
  effectWordDuration;
  effectWordInterval;
  styleType;
  isSubtitle = false;
  textShadow = {};
  textStroke = {};
  textBackground = {};
  textFillColor;
  fillColorIntension;
  constructor(options, type = ElementTypes_default.Text, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      fontSize: (v) => Number(util_default.defaultTo(v, 32)),
      fontWeight: (v) => Number(util_default.defaultTo(v, 400)),
      fontColor: (v) => util_default.defaultTo(v, "#000"),
      lineHeight: (v) => Number(util_default.defaultTo(v, 1)),
      wordSpacing: (v) => Number(util_default.defaultTo(v, 0)),
      lineWrap: (v) => util_default.defaultTo(util_default.booleanParse(v), true),
      isSubtitle: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : v,
      effectWordDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      effectWordInterval: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      fillColorIntension: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      fontFamily: (v) => util_default.isUndefined(v) || util_default.isString(v),
      fontSize: (v) => util_default.isFinite(v),
      fontWeight: (v) => util_default.isFinite(v),
      fontStyle: (v) => util_default.isUndefined(v) || util_default.isString(v),
      fontColor: (v) => util_default.isString(v),
      lineHeight: (v) => util_default.isFinite(v),
      wordSpacing: (v) => util_default.isFinite(v),
      textAlign: (v) => util_default.isUndefined(v) || util_default.isString(v),
      lineWrap: (v) => util_default.isBoolean(v),
      effectType: (v) => util_default.isUndefined(v) || util_default.isString(v),
      effectWordDuration: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      effectWordInterval: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      isSubtitle: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      styleType: (v) => util_default.isUndefined(v) || util_default.isString(v),
      textShadow: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      textStroke: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      textBackground: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      textFillColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      fillColorIntension: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
    });
  }
  renderXML(parent) {
    const text = super.renderXML(parent);
    this.value && text.txt(this.value);
    text.att("fontFamily", this.fontFamily);
    text.att("fontSize", this.fontSize);
    text.att("fontWeight", this.fontWeight);
    text.att("fontStyle", this.fontStyle);
    text.att("fontColor", this.fontColor);
    text.att("lineHeight", this.lineHeight);
    text.att("wordSpacing", this.wordSpacing);
    text.att("textAlign", this.textAlign);
    text.att("lineWrap", this.lineWrap);
    text.att("effectType", this.effectType);
    text.att("effectWordDuration", this.effectWordDuration);
    text.att("effectWordInterval", this.effectWordInterval);
    text.att("isSubtitle", this.isSubtitle);
    text.att("styleType", this.styleType);
    for (let key in this.textShadow) {
      const value = this.textShadow[key];
      text.att(`textShadow-${key}`, value);
    }
    for (let key in this.textStroke) {
      const value = this.textStroke[key];
      text.att(`textStroke-${key}`, value);
    }
    for (let key in this.textBackground) {
      const value = this.textBackground[key];
      text.att(`textBackground-${key}`, value);
    }
    text.att("textFillColor", this.textFillColor);
    text.att("fillColorIntension", this.fillColorIntension);
    return text;
  }
  renderOldXML(parent, resources, global) {
    const caption = super.renderOldXML(parent, resources, global);
    caption.att("fontFamily", this.fontFamily);
    caption.att("fontSize", this.fontSize);
    this.fontWeight > 400 && caption.att("bold", this.fontWeight);
    this.fontStyle === "italic" && caption.att("italic", true);
    caption.att("fontColor", this.fontColor);
    caption.att("lineHeight", (this.lineHeight || 1) * this.fontSize);
    caption.att("wordSpacing", this.wordSpacing);
    caption.att("textAlign", this.textAlign);
    caption.att("lineWrap", this.lineWrap);
    caption.att("effectType", this.effectType);
    caption.att("effectWordDuration", util_default.isFinite(this.effectWordDuration) ? util_default.millisecondsToSenconds(this.effectWordDuration) : void 0);
    caption.att("effectWordInterval", util_default.isFinite(this.effectWordInterval) ? util_default.millisecondsToSenconds(this.effectWordInterval) : void 0);
    caption.att("isSubtitle", this.isSubtitle);
    caption.att("styleType", this.styleType);
    for (let key in this.textShadow) {
      const value = this.textShadow[key];
      caption.att(`textShadow-${key}`, value);
    }
    for (let key in this.textStroke) {
      const value = this.textStroke[key];
      caption.att(`textStroke-${key}`, value);
    }
    for (let key in this.textBackground) {
      const value = this.textBackground[key];
      caption.att(`textBackground-${key}`, value);
    }
    caption.att("textFillColor", this.textFillColor);
    caption.att("fillColorIntension", this.fillColorIntension);
    const text = caption.ele("text");
    text.txt(this.value);
    return text;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      elementType: this.isSubtitle ? "subtitle" : this.type,
      content: this.value,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      textAlign: this.textAlign,
      fontFamily: this.fontFamily,
      lineHeight: (this.lineHeight || 1) * this.fontSize,
      wordSpacing: this.wordSpacing,
      bold: this.fontWeight > 400 ? this.fontWeight : void 0,
      italic: this.fontStyle === "italic" ? "italic" : "normal",
      isSubtitle: this.isSubtitle,
      effectType: this.effectType,
      effectWordDuration: util_default.isFinite(this.effectWordDuration) ? util_default.millisecondsToSenconds(this.effectWordDuration) : void 0,
      effectWordInterval: util_default.isFinite(this.effectWordInterval) ? util_default.millisecondsToSenconds(this.effectWordInterval) : void 0,
      styleType: this.styleType,
      textShadow: this.textShadow,
      textStroke: this.textStroke,
      textBackground: this.textBackground,
      textFillColor: this.textFillColor,
      fillColorIntension: this.fillColorIntension
    });
  }
  rescale(scaleX, scaleY) {
    super.rescale(scaleX, scaleY);
    this.fontSize && (this.fontSize = parseFloat((this.fontSize * scaleX).toFixed(4)));
  }
  static isInstance(value) {
    return value instanceof Text;
  }
};
var Text_default = Text;

// src/enums/ImageModes.ts
var ImageModes = /* @__PURE__ */ ((ImageModes2) => {
  ImageModes2["ScaleToFill"] = "scaleToFill";
  ImageModes2["AspectFit"] = "aspectFit";
  ImageModes2["AspectFill"] = "aspectFill";
  return ImageModes2;
})(ImageModes || {});
var ImageModes_default = ImageModes;

// src/elements/Crop.ts
var Crop = class {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  style = "";
  clipType;
  clipStyle;
  constructor(options) {
    util_default.optionsInject(this, options, {
      x: (v) => Number(util_default.defaultTo(v, 0)),
      y: (v) => Number(util_default.defaultTo(v, 0)),
      width: (v) => Number(v),
      height: (v) => Number(v)
    }, {
      x: (v) => util_default.isFinite(v),
      y: (v) => util_default.isFinite(v),
      width: (v) => util_default.isFinite(v),
      height: (v) => util_default.isFinite(v),
      style: (v) => util_default.isString(v),
      clipType: (v) => util_default.isUndefined(v) || util_default.isString(v),
      clipStyle: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
  }
  toOptions() {
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
  static isInstance(value) {
    return value instanceof Crop;
  }
};
var Crop_default = Crop;

// src/elements/Image.ts
var _Image = class extends Element_default {
  src = "";
  path;
  mode = ImageModes_default.ScaleToFill;
  crop;
  loop;
  dynamic;
  filter;
  naturalWidth;
  naturalHeight;
  constructor(options, type = ElementTypes_default.Image, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      mode: (v) => util_default.defaultTo(v, ImageModes_default.ScaleToFill),
      crop: (v) => v && new Crop_default(v),
      loop: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      dynamic: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      naturalWidth: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      naturalHeight: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      src: (v) => util_default.isString(v),
      path: (v) => util_default.isUndefined(v) || util_default.isString(v),
      mode: (v) => util_default.isString(v),
      crop: (v) => util_default.isUndefined(v) || Crop_default.isInstance(v),
      loop: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      dynamic: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      filter: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      naturalWidth: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      naturalHeight: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
    });
    if (this.isBackground) {
      this.endTime = void 0;
      this.exitEffect = void 0;
    }
  }
  renderXML(parent) {
    const image = super.renderXML(parent);
    image.att("src", this.src);
    image.att("mode", this.mode);
    image.att("dynamic", this.dynamic);
    image.att("loop", this.loop);
    image.att("naturalWidth", this.naturalWidth);
    image.att("naturalHeight", this.naturalHeight);
    if (this.crop) {
      image.att("crop-style", this.crop.style);
      image.att("crop-x", this.crop.x);
      image.att("crop-y", this.crop.y);
      image.att("crop-width", this.crop.width);
      image.att("crop-height", this.crop.height);
      image.att("crop-clipType", this.crop.clipType);
      image.att("crop-clipStyle", this.crop.clipStyle);
    }
    return image;
  }
  renderOldXML(parent, resources, global) {
    const image = super.renderOldXML(parent, resources, global);
    const cacheResourceId = resources ? resources.map[this.src] : null;
    const resourceId = cacheResourceId || util_default.uniqid();
    image.att("loop", this.loop);
    image.att("resId", resourceId);
    if (this.crop) {
      image.att("cropStyle", this.crop.style);
      image.att("cropX", this.crop.x);
      image.att("cropY", this.crop.y);
      image.att("cropWidth", this.crop.width);
      image.att("cropHeight", this.crop.height);
      image.att("clipType", this.crop.clipType);
      image.att("clipStyle", this.crop.clipStyle);
    }
    if (cacheResourceId || !resources)
      return image;
    resources.map[this.src] = resourceId;
    resources.ele("resource", {
      id: resourceId,
      name: this.name,
      type: "img",
      resPath: this.src
    });
    return image;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      src: this.src,
      mode: this.mode,
      crop: this.crop ? this.crop.toOptions() : void 0,
      loop: this.loop,
      dynamic: this.dynamic,
      naturalWidth: this.naturalWidth,
      naturalHeight: this.naturalHeight
    });
  }
  static isInstance(value) {
    return value instanceof _Image;
  }
};
var Image = _Image;
__publicField(Image, "Mode", ImageModes_default);
var Image_default = Image;

// src/elements/Audio.ts
var Audio = class extends Media_default {
  isRecord;
  fadeInDuration;
  fadeOutDuration;
  constructor(options, type = ElementTypes_default.Audio, ...values) {
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      isRecord: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      fadeInDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      fadeOutDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      isRecord: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      fadeInDuration: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      fadeOutDuration: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
    });
  }
  renderXML(parent) {
    const audio = super.renderXML(parent);
    audio.att("isRecord", this.isRecord);
    audio.att("fadeInDuration", this.fadeInDuration);
    audio.att("fadeOutDuration", this.fadeOutDuration);
    return audio;
  }
  renderOldXML(parent, resources, global) {
    const audio = super.renderOldXML(parent, resources, global);
    util_default.isNumber(this.fadeInDuration) && audio.att("fadeIn", this.fadeInDuration / 1e3);
    util_default.isNumber(this.fadeOutDuration) && audio.att("fadeOut", this.fadeOutDuration / 1e3);
    return audio;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      isRecord: this.isRecord,
      fadeInDuration: this.fadeInDuration,
      fadeOutDuration: this.fadeOutDuration
    });
  }
  static isInstance(value) {
    return value instanceof Audio;
  }
};
var Audio_default = Audio;

// src/elements/Voice.ts
var import_aggregation_ssml2 = require("aggregation-ssml");

// src/enums/VoiceProviders.ts
var VoiceProviders = /* @__PURE__ */ ((VoiceProviders2) => {
  VoiceProviders2["Aliyun"] = "aliyun";
  VoiceProviders2["Microsoft"] = "microsoft";
  VoiceProviders2["Huawei"] = "huawei";
  VoiceProviders2["Iflytek"] = "iflytek";
  VoiceProviders2["Tencent"] = "tencent";
  VoiceProviders2["Baidu"] = "baidu";
  return VoiceProviders2;
})(VoiceProviders || {});
var VoiceProviders_default = VoiceProviders;

// src/elements/SSML.ts
var import_aggregation_ssml = require("aggregation-ssml");
var _document;
var _SSML = class extends Element_default {
  constructor(options, type = ElementTypes_default.SSML, ...values) {
    super(options, type, ...values);
    __privateAdd(this, _document, void 0);
  }
  init(provider) {
    if (!this.value)
      return;
    const document = import_aggregation_ssml.Document.parse(this.value, provider);
    const realProvider = document.provider;
    document.provider = import_aggregation_ssml.Document.Provider.Aggregation;
    document.realProvider = realProvider;
    this.value = document.toSSML();
    __privateSet(this, _document, document);
  }
  renderXML(parent) {
    const ssml = super.renderXML(parent);
    this.value && ssml.ele(this.value);
    return ssml;
  }
  renderOldXML(parent, resources, global) {
    const ssml = super.renderOldXML(parent, resources, global);
    this.value && ssml.txt(this.value);
    return ssml;
  }
  get document() {
    return __privateGet(this, _document);
  }
  static isInstance(value) {
    return value instanceof _SSML;
  }
};
var SSML = _SSML;
_document = new WeakMap();
var SSML_default = SSML;

// src/elements/Voice.ts
var { Voice: _Voice, Prosody, Paragraph, Raw } = import_aggregation_ssml2.elements;
var _Voice2 = class extends Media_default {
  provider = "";
  text;
  declaimer;
  sampleRate;
  speechRate;
  pitchRate;
  enableSubtitle;
  constructor(options, type = ElementTypes_default.Voice, ...values) {
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      provider: (v) => util_default.defaultTo(v, import_aggregation_ssml2.Document.Provider.Aliyun),
      speechRate: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      pitchRate: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      provider: (v) => util_default.isString(v),
      text: (v) => util_default.isUndefined(v) || util_default.isString(v),
      declaimer: (v) => util_default.isUndefined(v) || util_default.isString(v),
      sampleRate: (v) => util_default.isUndefined(v) || util_default.isString(v),
      speechRate: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      pitchRate: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
    });
    !this.children.length && this.children.push(this.generateSSML());
    if (this.duration) {
      !util_default.isFinite(this.endTime) && (this.endTime = this.duration - (this.startTime || 0));
      return;
    }
    this.children.forEach((node) => {
      var _a;
      if (!SSML_default.isInstance(node))
        return;
      node.init(this.provider);
      const duration = ((_a = node.document) == null ? void 0 : _a.duration) + 1e3;
      if ((this.duration || 0) < duration)
        this.duration = duration;
      if ((this.endTime || 0) < duration)
        this.endTime = duration + (this.startTime || 0);
    });
  }
  renderXML(parent) {
    const voice = super.renderXML(parent);
    voice.att("provider", this.provider);
    voice.att("text", this.text);
    voice.att("declaimer", this.declaimer);
    voice.att("sampleRate", this.sampleRate);
    voice.att("speechRate", this.speechRate);
    voice.att("pitchRate", this.pitchRate);
    return voice;
  }
  renderOldXML(parent, resources, global) {
    const voice = super.renderOldXML(parent, resources, global);
    voice.att("provider", this.provider);
    voice.att("text", this.text);
    voice.att("voice", this.declaimer);
    voice.att("sampleRate", this.sampleRate);
    voice.att("speechRate", this.speechRate);
    voice.att("pitchRate", this.pitchRate);
    return voice;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      provider: this.provider,
      voice: this.declaimer,
      sampleRate: this.sampleRate,
      playbackRate: this.speechRate,
      speechRate: this.speechRate,
      pitchRate: this.pitchRate,
      enableSubtitle: this.enableSubtitle,
      content: this.text,
      ssml: this.ssml
    });
  }
  generateSSML() {
    const document = new import_aggregation_ssml2.Document({ provider: "aggregation", realProvider: this.provider });
    const voice = new _Voice({ name: this.declaimer });
    const prosody = new Prosody({ rate: this.playbackRate });
    const paragraph = new Paragraph();
    const raw = new Raw({ value: this.text });
    paragraph.appendChild(raw);
    prosody.appendChild(paragraph);
    voice.appendChild(prosody);
    document.appendChild(voice);
    return new SSML_default({ value: document.toSSML() });
  }
  resetEndTime(value) {
  }
  get ssml() {
    if (!this.children.length || !SSML_default.isInstance(this.children[0]))
      return null;
    return this.children[0].value;
  }
  static isInstance(value) {
    return value instanceof _Voice2;
  }
};
var Voice = _Voice2;
__publicField(Voice, "Provider", VoiceProviders_default);
var Voice_default = Voice;

// src/elements/Video.ts
var Video = class extends Media_default {
  crop;
  demuxSrc;
  constructor(options, type = ElementTypes_default.Video, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      crop: (v) => v && new Crop_default(v)
    }, {
      crop: (v) => util_default.isUndefined(v) || Crop_default.isInstance(v),
      demuxSrc: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
    if (this.isBackground) {
      this.endTime = void 0;
      this.exitEffect = void 0;
    }
  }
  renderXML(parent) {
    const video = super.renderXML(parent);
    if (this.crop) {
      video.att("crop-style", this.crop.style);
      video.att("crop-x", this.crop.x);
      video.att("crop-y", this.crop.y);
      video.att("crop-width", this.crop.width);
      video.att("crop-height", this.crop.height);
      video.att("crop-clipType", this.crop.clipType);
      video.att("crop-clipStyle", this.crop.clipStyle);
    }
    video.att("demuxSrc", this.demuxSrc);
    return video;
  }
  renderOldXML(parent, resources, global) {
    const video = super.renderOldXML(parent, resources, global);
    if (this.crop) {
      video.att("cropStyle", this.crop.style);
      video.att("cropX", this.crop.x);
      video.att("cropY", this.crop.y);
      video.att("cropWidth", this.crop.width);
      video.att("cropHeight", this.crop.height);
      video.att("clipType", this.crop.clipType);
      video.att("clipStyle", this.crop.clipStyle);
    }
    video.att("demuxSrc", this.demuxSrc);
    return video;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      crop: this.crop ? this.crop.toOptions() : void 0,
      demuxSrc: this.demuxSrc
    });
  }
  static isInstance(value) {
    return value instanceof Video;
  }
};
var Video_default = Video;

// src/enums/VtuberProviders.ts
var VtuberProviders = /* @__PURE__ */ ((VtuberProviders2) => {
  VtuberProviders2["YunXiaoWei"] = "yunXiaoWei";
  VtuberProviders2["XiangXin3D"] = "xiangXin3D";
  VtuberProviders2["XiangXinGAN"] = "xiangXinGAN";
  return VtuberProviders2;
})(VtuberProviders || {});
var VtuberProviders_default = VtuberProviders;

// src/elements/Vtuber.ts
var _Vtuber = class extends Media_default {
  provider = "";
  text = "";
  solution = "";
  declaimer;
  cutoutColor;
  demuxSrc;
  constructor(options, type = ElementTypes_default.Vtuber, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {}, {
      provider: (v) => util_default.isString(v),
      text: (v) => util_default.isString(v),
      solution: (v) => util_default.isString(v),
      declaimer: (v) => util_default.isUndefined(v) || util_default.isString(v),
      cutoutColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      demuxSrc: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
  }
  renderXML(parent) {
    const vtuber = super.renderXML(parent);
    vtuber.att("provider", this.provider);
    vtuber.att("text", this.value || this.text);
    vtuber.att("solution", this.solution);
    vtuber.att("declaimer", this.declaimer);
    vtuber.att("cutoutColor", this.cutoutColor);
    vtuber.att("demuxSrc", this.demuxSrc);
    return vtuber;
  }
  renderOldXML(parent, resources, global) {
    const vtuber = super.renderOldXML(parent, resources, global);
    vtuber.att("provider", this.provider);
    vtuber.att("text", this.value || this.text);
    vtuber.att("solution", this.solution);
    vtuber.att("declaimer", this.declaimer);
    vtuber.att("cutoutColor", this.cutoutColor);
    vtuber.att("demuxSrc", this.demuxSrc);
    return vtuber;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      provider: this.provider,
      text: this.value || this.text,
      declaimer: this.declaimer,
      solution: this.solution,
      cutoutColor: this.cutoutColor,
      demuxSrc: this.demuxSrc
    });
  }
  static isInstance(value) {
    return value instanceof _Vtuber;
  }
};
var Vtuber = _Vtuber;
__publicField(Vtuber, "Provider", VtuberProviders_default);
var Vtuber_default = Vtuber;

// src/elements/Canvas.ts
var Canvas = class extends Element_default {
  chartId = "";
  configSrc = "";
  dataSrc = "";
  config = null;
  data = null;
  duration;
  poster;
  constructor(options, type = ElementTypes_default.Canvas, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      duration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      chartId: (v) => util_default.isString(v),
      configSrc: (v) => util_default.isUndefined(v) || util_default.isNull(v) || util_default.isString(v),
      dataSrc: (v) => util_default.isUndefined(v) || util_default.isNull(v) || util_default.isString(v),
      duration: (v) => util_default.isUndefined(v) || util_default.isNumber(v),
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
    if (/^base64\:/.test(this.configSrc))
      this.config = JSON.parse(util_default.decodeBASE64(this.configSrc.substring(7)));
    else if (/^json\:/.test(this.configSrc))
      this.config = JSON.parse(this.configSrc.substring(5));
    if (/^base64\:/.test(this.dataSrc))
      this.data = JSON.parse(util_default.decodeBASE64(this.dataSrc.substring(7)));
    else if (/^json\:/.test(this.dataSrc))
      this.data = JSON.parse(this.dataSrc.substring(5));
    if (this.data)
      this.data.data = this.data.data || this.data.series || [];
  }
  renderXML(parent) {
    const canvas = super.renderXML(parent);
    canvas.att("chartId", this.chartId);
    canvas.att("poster", this.poster);
    canvas.att("duration", this.duration);
    canvas.att("configSrc", this.config ? "base64:" + util_default.encodeBASE64(this.config) : this.configSrc);
    canvas.att("dataSrc", this.data ? "base64:" + util_default.encodeBASE64(this.data) : this.dataSrc);
    return canvas;
  }
  renderOldXML(parent, resources, global) {
    const canvas = super.renderOldXML(parent, resources, global);
    canvas.att("chartId", this.chartId);
    canvas.att("poster", this.poster);
    canvas.att("duration", this.duration ? util_default.millisecondsToSenconds(this.duration) : void 0);
    canvas.att("optionsPath", this.config ? "base64:" + util_default.encodeBASE64(this.config) : this.configSrc);
    canvas.att("dataPath", this.data ? "base64:" + util_default.encodeBASE64(this.data) : this.dataSrc);
    return canvas;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      chartId: this.chartId,
      poster: this.poster,
      duration: this.duration ? util_default.millisecondsToSenconds(this.duration) : void 0,
      optionPath: this.config ? void 0 : this.configSrc,
      dataPath: this.data ? void 0 : this.dataSrc,
      optionJson: this.config,
      dataJson: this.data
    });
  }
  static isInstance(value) {
    return value instanceof Canvas;
  }
};
var Canvas_default = Canvas;

// src/elements/Chart.ts
var Chart = class extends Canvas_default {
  constructor(options, type = ElementTypes_default.Chart, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {}, {});
  }
  renderXML(parent) {
    return super.renderXML(parent);
  }
  renderOldXML(parent, resources, global) {
    return super.renderOldXML(parent, resources, global);
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadValues({
      optionsPath: this.config ? void 0 : this.configSrc,
      dataPath: this.data ? void 0 : this.dataSrc,
      ddcoptions: this.config,
      ddcdata: this.data
    }, parentOptions);
  }
  static isInstance(value) {
    return value instanceof Chart;
  }
};
var Chart_default = Chart;

// src/elements/Group.ts
var Group = class extends Element_default {
  constructor(options, type = ElementTypes_default.Group, ...values) {
    super(options, type, ...values);
  }
  renderOldXML(parent, resources, global) {
    return super.renderOldXML(parent, resources, global, true);
  }
  static isInstance(value) {
    return value instanceof Group;
  }
};
var Group_default = Group;

// src/elements/Sticker.ts
var Sticker = class extends Image_default {
  drawType;
  editable;
  distortable;
  constructor(options, type = ElementTypes_default.Sticker, ...values) {
    super(options, type, ...values);
    util_default.optionsInject(this, options, {
      editable: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      distortable: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0
    }, {
      drawType: (v) => util_default.isUndefined(v) || util_default.isString(v),
      editable: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      distortable: (v) => util_default.isUndefined(v) || util_default.isBoolean(v)
    });
  }
  renderXML(parent) {
    const sticker = super.renderXML(parent);
    sticker.att("drawType", this.drawType);
    sticker.att("editable", this.editable);
    sticker.att("distortable", this.distortable);
    return sticker;
  }
  renderOldXML(parent, resources, global) {
    const sticker = super.renderOldXML(parent, resources, global);
    sticker.att("drawType", this.drawType);
    sticker.att("editable", this.editable);
    sticker.att("distortable", this.distortable);
    return sticker;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      drawType: this.drawType,
      editable: this.editable,
      distortable: this.distortable
    });
  }
  static isInstance(value) {
    return value instanceof Sticker;
  }
};
var Sticker_default = Sticker;

// src/elements/Subtitle.ts
var Subtitle = class extends Text_default {
  constructor(options, type = ElementTypes_default.Subtitle, ...values) {
    super(options, ElementTypes_default.Subtitle, ...values);
  }
  static isInstance(value) {
    return value instanceof Subtitle;
  }
};
var Subtitle_default = Subtitle;

// src/ElementFactory.ts
var ElementFactory = class {
  static createElement(data, ...values) {
    if (!util_default.isObject(data))
      throw new TypeError("data must be an Object");
    switch (data.type) {
      case ElementTypes_default.Text:
        return new Text_default(data, void 0, ...values);
      case ElementTypes_default.Image:
        return new Image_default(data, void 0, ...values);
      case ElementTypes_default.Audio:
        return new Audio_default(data, void 0, ...values);
      case ElementTypes_default.Voice:
        return new Voice_default(data, void 0, ...values);
      case ElementTypes_default.Video:
        return new Video_default(data, void 0, ...values);
      case ElementTypes_default.Vtuber:
        return new Vtuber_default(data, void 0, ...values);
      case ElementTypes_default.Chart:
        return new Chart_default(data, void 0, ...values);
      case ElementTypes_default.Canvas:
        return new Canvas_default(data, void 0, ...values);
      case ElementTypes_default.Group:
        return new Group_default(data, void 0, ...values);
      case ElementTypes_default.Sticker:
        return new Sticker_default(data, void 0, ...values);
      case ElementTypes_default.Subtitle:
        return new Subtitle_default(data, void 0, ...values);
      case ElementTypes_default.SSML:
        return new SSML_default(data, void 0, ...values);
    }
    return new Element_default(data, void 0, ...values);
  }
};
var ElementFactory_default = ElementFactory;

// src/Scene.ts
var Transition = class {
  type = "";
  duration = 0;
  constructor(options) {
    util_default.optionsInject(this, options, {
      duration: (v) => Number(util_default.defaultTo(v, 0))
    }, {
      type: (v) => util_default.isString(v),
      duration: (v) => util_default.isFinite(v)
    });
  }
  renderXML(scene) {
    scene.att("transition-type", this.type);
    scene.att("transition-duration", this.duration);
  }
  renderOldXML(scene) {
    scene.ele("transition", {
      name: this.type,
      duration: this.duration / 1e3
    });
  }
  static isInstance(value) {
    return value instanceof Transition;
  }
};
var _formObject, _parent2, _createXMLRoot, createXMLRoot_fn;
var _Scene = class {
  constructor(options, data = {}, vars2 = {}, extendsScript = "", formObject) {
    __privateAdd(this, _createXMLRoot);
    __publicField(this, "type", "");
    __publicField(this, "id", "");
    __publicField(this, "name");
    __publicField(this, "poster");
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "aspectRatio", "");
    __publicField(this, "original");
    __publicField(this, "duration", 0);
    __publicField(this, "backgroundColor");
    __publicField(this, "transition");
    __publicField(this, "filter");
    __publicField(this, "children", []);
    __privateAdd(this, _formObject, void 0);
    __privateAdd(this, _parent2, void 0);
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    options.compile && (options = Compiler_default.compile(options, data, vars2, extendsScript));
    util_default.optionsInject(this, options, {
      type: () => "scene",
      id: (v) => util_default.defaultTo(_Scene.isId(v) ? v : void 0, util_default.uniqid()),
      width: (v) => Number(v),
      height: (v) => Number(v),
      duration: (v) => Number(v),
      transition: (v) => v && new Transition(v),
      children: (datas) => util_default.isArray(datas) ? datas.map((data2) => {
        const node = Element_default.isInstance(data2) ? data2 : ElementFactory_default.createElement(data2);
        node.parent = this;
        return node;
      }) : []
    }, {
      type: (v) => v === "scene",
      id: (v) => _Scene.isId(v),
      name: (v) => util_default.isUndefined(v) || util_default.isString(v),
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v),
      width: (v) => util_default.isFinite(v),
      height: (v) => util_default.isFinite(v),
      aspectRatio: (v) => util_default.isString(v),
      original: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      duration: (v) => util_default.isFinite(v),
      backgroundColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      transition: (v) => util_default.isUndefined(v) || Transition.isInstance(v),
      filter: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      children: (v) => util_default.isArray(v)
    });
    const maxDuration = Math.max(...this.children.map((node) => Voice_default.isInstance(node) || Vtuber_default.isInstance(node) ? node.getMaxDuration() : 0));
    if (maxDuration > this.duration) {
      this.resetEndTime(maxDuration - this.duration);
      this.duration = maxDuration;
    }
    __privateSet(this, _formObject, formObject);
  }
  appendChild(node) {
    node.parent = this;
    this.children.push(node);
  }
  setDuration(duration) {
    this.duration = duration;
  }
  toXML(pretty = false) {
    const scene = this.renderXML();
    return scene.end({ prettyPrint: pretty, headless: true });
  }
  toOldXML(pretty = false) {
    const board = this.renderOldXML();
    return board.end({ prettyPrint: pretty, headless: true });
  }
  toOptions() {
    const children = [];
    let backgroundImage;
    let backgroundVideo;
    let backgroundAudio;
    this.children.forEach((node) => {
      if (node.isBackground) {
        switch (node.type) {
          case "image":
            backgroundImage = node;
            break;
          case "video":
            backgroundVideo = node;
            break;
          case "audio":
            backgroundAudio = node;
            break;
        }
      } else
        children.push(node);
    });
    return {
      id: this.id,
      duration: util_default.millisecondsToSenconds(this.duration),
      poster: this.poster,
      videoWidth: this.width,
      videoHeight: this.height,
      videoSize: this.aspectRatio,
      original: this.original,
      bgColor: { id: util_default.uniqid(), fillColor: this.backgroundColor },
      bgImage: backgroundImage ? backgroundImage.toOptions() : void 0,
      bgVideo: backgroundVideo ? backgroundVideo.toOptions() : void 0,
      bgMusic: backgroundAudio ? backgroundAudio.toOptions() : void 0,
      transition: this.transition ? {
        name: this.transition.type,
        duration: util_default.millisecondsToSenconds(this.transition.duration)
      } : void 0,
      elements: children.map((node) => node.toOptions()).sort((a, b) => a.index - b.index)
    };
  }
  renderXML(parent) {
    var _a;
    const scene = parent ? parent.ele(this.type, {
      id: this.id,
      name: this.name,
      poster: this.poster,
      width: this.width,
      height: this.height,
      aspectRatio: this.aspectRatio,
      duration: this.duration,
      backgroundColor: this.backgroundColor
    }) : __privateMethod(this, _createXMLRoot, createXMLRoot_fn).call(this);
    if (util_default.isObject(this.original)) {
      for (let key in this.original)
        scene.att(`original-${key}`, this.original[key]);
    }
    (_a = this.transition) == null ? void 0 : _a.renderXML(scene);
    this.sortedChildren.forEach((node) => node.renderXML(scene));
    return scene;
  }
  renderOldXML(parent, resources) {
    var _a;
    const board = parent ? parent.ele("board", {
      id: this.id,
      name: this.name,
      poster: this.poster,
      duration: util_default.millisecondsToSenconds(this.duration)
    }) : __privateMethod(this, _createXMLRoot, createXMLRoot_fn).call(this, "board", {
      duration: util_default.millisecondsToSenconds(this.duration)
    });
    if (this.backgroundColor) {
      board.ele("bgblock", {
        id: util_default.uniqid(),
        inPoint: 0,
        fillColor: this.backgroundColor
      });
    }
    const tagMap = {};
    this.sortedChildren.forEach((node) => node.renderOldXML((tagName) => {
      if (tagMap[tagName])
        return tagMap[tagName];
      return tagMap[tagName] = board.ele(tagName);
    }, resources));
    (_a = this.transition) == null ? void 0 : _a.renderOldXML(board);
    return board;
  }
  static parse(content, data, vars2) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Scene(content);
    if (util_default.isString(content))
      return _Scene.parseXML(content, data, vars2);
    return _Scene.parseJSON(content, data, vars2);
  }
  static async parseAndProcessing(content, data, vars2, dataProcessor, varsProcessor) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Scene(content);
    if (util_default.isString(content))
      return _Scene.parseXMLPreprocessing(content, data, vars2, dataProcessor, varsProcessor);
    return _Scene.parseJSONPreprocessing(content, data, vars2, dataProcessor, varsProcessor);
  }
  static isId(value) {
    return util_default.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
  }
  static isInstance(value) {
    return value instanceof _Scene;
  }
  resize(width, height) {
    const scaleX = width / this.width;
    const scaleY = height / this.height;
    this.width = width;
    this.height = height;
    this.children.forEach((node) => node.rescale(scaleX, scaleY));
  }
  generateTimeline(baseTime = 0) {
    let track = [];
    this.children.forEach((node) => {
      track.push(__spreadProps(__spreadValues({}, node), {
        update: node.update.bind(node),
        absoluteStartTime: baseTime + (node.startTime || 0),
        absoluteEndTime: baseTime + (node.endTime || this.duration)
      }));
      track = track.concat(node.generateTimeline(baseTime, this.duration));
    });
    return track == null ? void 0 : track.sort((n1, n2) => n1.absoluteStartTime - n2.absoluteStartTime);
  }
  getFormInfo() {
    if (!__privateGet(this, _formObject))
      return null;
    const formOptions = Parser_default.convertXMLObject(__privateGet(this, _formObject), void 0, true);
    const rules = [];
    formOptions.children.forEach((node) => {
      const rule = util_default.omit(node, ["children"]);
      node.children.forEach((node2) => {
        if (!rule[node2.type])
          rule[node2.type] = [];
        const temp = util_default.omit(node2, ["type", "children"]);
        if (temp.__type) {
          temp.type = temp.__type;
          delete temp.__type;
        }
        rule[node2.type].push(temp);
      });
      rules.push(rule);
    });
    return {
      source: formOptions.source,
      rules,
      formObject: __privateGet(this, _formObject)
    };
  }
  resetEndTime(value) {
    this.children.forEach((node) => node.resetEndTime(value));
  }
  get sortedChildren() {
    const _children = util_default.clone(this.children);
    _children.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    return _children;
  }
  get fontFamilys() {
    const fontFamilys = [];
    this.children.forEach((node) => {
      if (Text_default.isInstance(node)) {
        const text = node;
        text.fontFamily && fontFamilys.push(text.fontFamily);
      }
    });
    return fontFamilys;
  }
  set parent(obj) {
    __privateSet(this, _parent2, obj);
  }
  get parent() {
    return __privateGet(this, _parent2);
  }
};
var Scene = _Scene;
_formObject = new WeakMap();
_parent2 = new WeakMap();
_createXMLRoot = new WeakSet();
createXMLRoot_fn = function(tagName = "scene", attributes = {}) {
  const scene = (0, import_xmlbuilder24.create)().ele(tagName, __spreadValues({
    id: this.id,
    name: this.name,
    poster: this.poster,
    width: this.width,
    height: this.height,
    aspectRatio: this.aspectRatio,
    duration: this.duration,
    backgroundColor: this.backgroundColor
  }, attributes));
  return scene;
};
__publicField(Scene, "type", "scene");
__publicField(Scene, "parseJSON", Parser_default.parseSceneJSON.bind(Parser_default));
__publicField(Scene, "parseJSONPreprocessing", Parser_default.parseSceneJSONPreprocessing.bind(Parser_default));
__publicField(Scene, "parseXML", Parser_default.parseSceneXML.bind(Parser_default));
__publicField(Scene, "parseXMLPreprocessing", Parser_default.parseSceneXMLPreprocessing.bind(Parser_default));
__publicField(Scene, "parseOptions", OptionsParser_default.parseSceneOptions.bind(OptionsParser_default));
var Scene_default = Scene;

// src/Template.ts
var _formObject2;
var _Template = class {
  constructor(options, data = {}, vars2 = {}, extendsScript = "", formObject) {
    __publicField(this, "type", "");
    __publicField(this, "id", "");
    __publicField(this, "mode", "");
    __publicField(this, "version", "");
    __publicField(this, "name");
    __publicField(this, "poster");
    __publicField(this, "actuator");
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "aspectRatio", "");
    __publicField(this, "original");
    __publicField(this, "fps", 0);
    __publicField(this, "crf");
    __publicField(this, "videoCodec");
    __publicField(this, "videoBitrate");
    __publicField(this, "pixelFormat");
    __publicField(this, "frameQuality");
    __publicField(this, "format");
    __publicField(this, "volume", 0);
    __publicField(this, "audioCodec");
    __publicField(this, "sampleRate");
    __publicField(this, "audioBitrate");
    __publicField(this, "backgroundColor");
    __publicField(this, "captureTime");
    __publicField(this, "createTime", 0);
    __publicField(this, "updateTime", 0);
    __publicField(this, "buildBy", "");
    __publicField(this, "children", []);
    __privateAdd(this, _formObject2, void 0);
    options.compile && (options = Compiler_default.compile(options, data, vars2, extendsScript, options.debug));
    util_default.optionsInject(this, options, {
      type: () => "template",
      id: (v) => util_default.defaultTo(_Template.isId(v) ? v : void 0, util_default.uuid(false)),
      mode: (v) => util_default.defaultTo(v, "scene"),
      version: (v) => util_default.defaultTo(v, "2.0.0"),
      width: (v) => Number(v),
      height: (v) => Number(v),
      fps: (v) => Number(util_default.defaultTo(v, 60)),
      crf: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      volume: (v) => Number(util_default.defaultTo(v, 1)),
      frameQuality: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      captureTime: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      createTime: (v) => Number(util_default.defaultTo(v, util_default.unixTimestamp())),
      updateTime: (v) => Number(util_default.defaultTo(v, util_default.unixTimestamp())),
      buildBy: (v) => util_default.defaultTo(v, "system"),
      children: (datas) => util_default.isArray(datas) ? datas.map((data2) => {
        let node;
        if (Scene_default.isInstance(data2) || Element_default.isInstance(data2))
          node = data2;
        else if (data2.type === "scene")
          node = new Scene_default(data2);
        else
          node = ElementFactory_default.createElement(data2);
        node.parent = this;
        return node;
      }) : []
    }, {
      type: (v) => v === "template",
      id: (v) => _Template.isId(v),
      mode: (v) => util_default.isString(v),
      version: (v) => util_default.isString(v),
      name: (v) => util_default.isUndefined(v) || util_default.isString(v),
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v),
      actuator: (v) => util_default.isUndefined(v) || util_default.isString(v),
      width: (v) => util_default.isFinite(v),
      height: (v) => util_default.isFinite(v),
      aspectRatio: (v) => util_default.isString(v),
      original: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      fps: (v) => util_default.isFinite(v),
      crf: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      volume: (v) => util_default.isFinite(v),
      videoCodec: (v) => util_default.isUndefined(v) || util_default.isString(v),
      videoBitrate: (v) => util_default.isUndefined(v) || util_default.isString(v),
      pixelFormat: (v) => util_default.isUndefined(v) || util_default.isString(v),
      frameQuality: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      backgroundColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      format: (v) => util_default.isUndefined(v) || util_default.isString(v),
      audioCodec: (v) => util_default.isUndefined(v) || util_default.isString(v),
      sampleRate: (v) => util_default.isUndefined(v) || util_default.isString(v),
      audioBitrate: (v) => util_default.isUndefined(v) || util_default.isString(v),
      captureTime: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      createTime: (v) => util_default.isUnixTimestamp(v),
      updateTime: (v) => util_default.isUnixTimestamp(v),
      buildBy: (v) => util_default.isString(v),
      children: (v) => util_default.isArray(v)
    });
    __privateSet(this, _formObject2, formObject);
  }
  scenesSplice(start, end) {
    let index = 0;
    this.children = this.children.filter((node) => {
      if (Scene_default.isInstance(node))
        return true;
      if (index < start) {
        index++;
        return false;
      }
      if (index >= end)
        return false;
      index++;
      return true;
    });
  }
  appendChild(node) {
    if (!Scene_default.isInstance(node) && !Element_default.isInstance(node))
      throw new TypeError("node must be an Scene instance or Element instance");
    node.parent = this;
    this.children.push(node);
  }
  toBASE64() {
    return this.toBuffer().toString("base64");
  }
  toOldBASE64() {
    return this.toOldBuffer().toString("base64");
  }
  toBuffer() {
    return Parser_default.toBuffer(this);
  }
  toOldBuffer() {
    return OldParser_default.toBuffer(this);
  }
  toXML(pretty = false) {
    return Parser_default.toXML(this, pretty);
  }
  toOldXML(pretty = false) {
    return OldParser_default.toXML(this, pretty);
  }
  toOptions() {
    return OptionsParser_default.toOptions(this);
  }
  static isId(value) {
    return util_default.isString(value) && /^[a-zA-Z0-9]{32}$/.test(value);
  }
  static isInstance(value) {
    return value instanceof _Template;
  }
  static parse(content, data, vars2) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Template(content);
    if (/\<template/.test(content))
      return _Template.parseXML(content, data, vars2);
    else if (/\<project/.test(content))
      return _Template.parseOldXML(content, data, vars2);
    else
      return _Template.parseJSON(content, data, vars2);
  }
  static async parseAndProcessing(content, data, vars2, dataProcessor, varsProcessor) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Template(content);
    if (/\<template/.test(content))
      return await _Template.parseXMLPreprocessing(content, data, vars2, dataProcessor, varsProcessor);
    else if (/\<project/.test(content))
      return _Template.parseOldXML(content, data, vars2);
    else
      return await _Template.parseJSONPreprocessing(content, data, vars2, dataProcessor, varsProcessor);
  }
  getFormInfo() {
    if (!__privateGet(this, _formObject2))
      return null;
    const formOptions = Parser_default.convertXMLObject(__privateGet(this, _formObject2), void 0, true);
    const rules = [];
    formOptions.children.forEach((node) => {
      const rule = util_default.omit(node, ["children"]);
      node.children.forEach((node2) => {
        if (!rule[node2.type])
          rule[node2.type] = [];
        const temp = util_default.omit(node2, ["type", "children"]);
        if (temp.__type) {
          temp.type = temp.__type;
          delete temp.__type;
        }
        rule[node2.type].push(temp);
      });
      rules.push(rule);
    });
    return {
      source: formOptions.source,
      rules,
      formObject: __privateGet(this, _formObject2)
    };
  }
  resize(width, height) {
    const scaleX = width / this.width;
    const scaleY = height / this.height;
    this.width = width;
    this.height = height;
    this.children.forEach((node) => {
      if (Scene_default.isInstance(node))
        node.resize(width, height);
      else
        node.rescale(scaleX, scaleY);
    });
  }
  generateTimeline() {
    let track = [];
    let baseTime = 0;
    this.children.forEach((node) => {
      if (Scene_default.isInstance(node)) {
        track = track.concat(node.generateTimeline(baseTime));
        baseTime += node.duration;
      } else {
        track.push(__spreadProps(__spreadValues({}, node), {
          update: node.update.bind(node),
          updateSceneDuration: () => {
          },
          absoluteStartTime: node.startTime || 0,
          absoluteEndTime: node.endTime || this.duration
        }));
      }
    });
    return track;
  }
  clone() {
    return _Template.parseJSON(JSON.stringify(this));
  }
  get duration() {
    return this.children.reduce((duration, node) => Scene_default.isInstance(node) ? duration + node.duration : duration, 0);
  }
  get sortedChilren() {
    const elements2 = this.elements;
    elements2.sort((a, b) => {
      if (Scene_default.isInstance(a))
        return -1;
      return (a.zIndex || 0) - (b.zIndex || 0);
    });
    return [
      ...this.scenes.map((scene) => scene.sortedChildren),
      ...this.elements
    ];
  }
  get fontFamilys() {
    let fontFamilys = [];
    this.children.forEach((node) => {
      if (Scene_default.isInstance(node))
        fontFamilys = fontFamilys.concat(node.fontFamilys);
      else if (node.fontFamily)
        fontFamilys.push(node.fontFamily);
    });
    return Array.from(new Set(fontFamilys));
  }
  get scenes() {
    return this.children.filter((node) => Scene_default.isInstance(node));
  }
  get elements() {
    return this.children.filter((node) => Element_default.isInstance(node));
  }
  get formObject() {
    return __privateGet(this, _formObject2);
  }
};
var Template = _Template;
_formObject2 = new WeakMap();
__publicField(Template, "packageVersion", "1.1.78");
__publicField(Template, "type", "template");
__publicField(Template, "parseJSON", Parser_default.parseJSON.bind(Parser_default));
__publicField(Template, "parseJSONPreprocessing", Parser_default.parseJSONPreprocessing.bind(Parser_default));
__publicField(Template, "parseXML", Parser_default.parseXML.bind(Parser_default));
__publicField(Template, "parseXMLPreprocessing", Parser_default.parseXMLPreprocessing.bind(Parser_default));
__publicField(Template, "parseOldXML", OldParser_default.parseXML.bind(OldParser_default));
__publicField(Template, "parseOptions", OptionsParser_default.parseOptions.bind(OptionsParser_default));
var Template_default = Template;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Scene,
  Template,
  elements
});
