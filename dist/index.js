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
      if (/^\_/.test(key))
        return;
      let value = options[key];
      if (this.isFunction(initializers[key]))
        value = initializers[key](value);
      if (this.isFunction(checkers[key]) && !checkers[key](value))
        throw new Error(`parameter ${key} invalid`);
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
var import_xmlbuilder2 = require("xmlbuilder2");

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
var Effect = class {
  type = "";
  duration = 0;
  path;
  constructor(options) {
    util_default.optionsInject(this, options, {
      duration: (v) => Number(v),
      path: (v) => util_default.isString(v) ? v.split(",") : v
    }, {
      type: (v) => util_default.isString(v),
      duration: (v) => util_default.isFinite(v),
      path: (v) => util_default.isUndefined(v) || util_default.isArray(v)
    });
  }
  toOptions(startTime = 0) {
    return {
      name: this.type,
      delay: util_default.millisecondsToSenconds(startTime),
      duration: util_default.millisecondsToSenconds(this.duration),
      path: this.path
    };
  }
  static isInstance(value) {
    return value instanceof Effect;
  }
};
var _absoluteStartTime, _absoluteEndTime;
var _Element = class {
  constructor(options, type = ElementTypes_default.Element) {
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
    __publicField(this, "fixedScale");
    __publicField(this, "trackId");
    __publicField(this, "value");
    __publicField(this, "children", []);
    __privateAdd(this, _absoluteStartTime, void 0);
    __privateAdd(this, _absoluteEndTime, void 0);
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
      startTime: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      endTime: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      fixedScale: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      enterEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      exitEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      stayEffect: (v) => util_default.isUndefined(v) ? v : new Effect(v),
      isBackground: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      children: (datas) => util_default.isArray(datas) ? datas.map((data) => _Element.isInstance(data) ? data : ElementFactory_default.createElement(data)) : []
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
      isBackground: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      backgroundColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      startTime: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      endTime: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      fixedScale: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      trackId: (v) => util_default.isUndefined(v) || util_default.isString(v),
      value: (v) => util_default.isUndefined(v) || util_default.isString(v),
      children: (v) => util_default.isArray(v)
    });
  }
  renderXML(parent) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
    const element = parent.ele(this.type, {
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
      "enterEffect-path": (_g = (_f = (_e = this.enterEffect) == null ? void 0 : _e.path) == null ? void 0 : _f.join(",")) != null ? _g : void 0,
      "exitEffect-type": (_i = (_h = this.exitEffect) == null ? void 0 : _h.type) != null ? _i : void 0,
      "exitEffect-duration": (_k = (_j = this.exitEffect) == null ? void 0 : _j.duration) != null ? _k : void 0,
      "exitEffect-path": (_n = (_m = (_l = this.exitEffect) == null ? void 0 : _l.path) == null ? void 0 : _m.join(",")) != null ? _n : void 0,
      "stayEffect-type": (_p = (_o = this.stayEffect) == null ? void 0 : _o.type) != null ? _p : void 0,
      "stayEffect-duration": (_r = (_q = this.stayEffect) == null ? void 0 : _q.duration) != null ? _r : void 0,
      "stayEffect-path": (_u = (_t = (_s = this.stayEffect) == null ? void 0 : _s.path) == null ? void 0 : _t.join(",")) != null ? _u : void 0,
      isBackground: this.isBackground,
      backgroundColor: this.backgroundColor,
      startTime: this.startTime,
      endTime: this.endTime
    });
    (_v = this.children) == null ? void 0 : _v.forEach((node) => _Element.isInstance(node) && node.renderXML(element));
    return element;
  }
  renderOldXML(parent, resources, global) {
    var _a, _b, _c, _d, _e, _f, _g;
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
      animationIn: (_b = (_a = this.enterEffect) == null ? void 0 : _a.type) != null ? _b : void 0,
      animationInDuration: ((_c = this.enterEffect) == null ? void 0 : _c.duration) ? util_default.millisecondsToSenconds(this.enterEffect.duration) : void 0,
      animationOut: (_e = (_d = this.exitEffect) == null ? void 0 : _d.type) != null ? _e : void 0,
      animationOutDuration: ((_f = this.exitEffect) == null ? void 0 : _f.duration) ? util_default.millisecondsToSenconds(this.exitEffect.duration) : void 0,
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
      }[this.type]) : parent).ele({
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
    (_g = this.children) == null ? void 0 : _g.forEach((node) => _Element.isInstance(node) && node.renderOldXML(element, resources, global));
    return element;
  }
  toOptions() {
    var _a, _b;
    const elements = [];
    this.children.forEach((node) => _Element.isInstance(node) && elements.push(node.toOptions()));
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
      animationIn: util_default.isNumber(this.startTime) ? ((_a = this.enterEffect) == null ? void 0 : _a.toOptions(this.startTime)) || { delay: util_default.millisecondsToSenconds(this.startTime) } : void 0,
      animationOut: util_default.isNumber(this.endTime) ? ((_b = this.exitEffect) == null ? void 0 : _b.toOptions(this.endTime)) || { delay: util_default.millisecondsToSenconds(this.endTime) } : void 0,
      elements,
      fillColor: this.backgroundColor
    };
  }
  static isId(value) {
    return util_default.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
  }
  static isInstance(value) {
    return value instanceof _Element;
  }
  setParentSection(baseTime, duration) {
    __privateSet(this, _absoluteStartTime, baseTime + (this.startTime || 0));
    __privateSet(this, _absoluteEndTime, baseTime + (this.endTime || duration));
  }
  get absoluteStartTime() {
    return __privateGet(this, _absoluteStartTime);
  }
  get absoluteEndTime() {
    return __privateGet(this, _absoluteEndTime);
  }
};
var Element = _Element;
_absoluteStartTime = new WeakMap();
_absoluteEndTime = new WeakMap();
__publicField(Element, "Type", ElementTypes_default);
var Element_default = Element;

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
  constructor(options, type = ElementTypes_default.Media) {
    super(options, type);
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
  constructor(options, type = ElementTypes_default.Text) {
    super(options, type);
    util_default.optionsInject(this, options, {
      fontSize: (v) => Number(util_default.defaultTo(v, 32)),
      fontWeight: (v) => Number(util_default.defaultTo(v, 400)),
      fontColor: (v) => util_default.defaultTo(v, "#000"),
      lineHeight: (v) => Number(util_default.defaultTo(v, 1)),
      wordSpacing: (v) => Number(util_default.defaultTo(v, 0)),
      lineWrap: (v) => util_default.defaultTo(util_default.booleanParse(v), true),
      effectWordDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      effectWordInterval: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
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
      effectWordInterval: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
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
    const text = caption.ele("text");
    text.txt(this.value);
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      content: this.value,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      textAlign: this.textAlign,
      fontFamily: this.fontFamily,
      lineHeight: (this.lineHeight || 1) * this.fontSize,
      wordSpacing: this.wordSpacing,
      bold: this.fontWeight > 400 ? this.fontWeight : void 0,
      italic: this.fontStyle === "italic" ? "italic" : "normal",
      effectType: this.effectType,
      effectWordDuration: util_default.isFinite(this.effectWordDuration) ? util_default.millisecondsToSenconds(this.effectWordDuration) : void 0,
      effectWordInterval: util_default.isFinite(this.effectWordInterval) ? util_default.millisecondsToSenconds(this.effectWordInterval) : void 0
    });
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
  constructor(options, type = ElementTypes_default.Image) {
    super(options, type);
    util_default.optionsInject(this, options, {
      mode: (v) => util_default.defaultTo(v, ImageModes_default.ScaleToFill),
      crop: (v) => v && new Crop_default(v),
      loop: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0,
      dynamic: (v) => !util_default.isUndefined(v) ? util_default.booleanParse(v) : void 0
    }, {
      src: (v) => util_default.isString(v),
      path: (v) => util_default.isUndefined(v) || util_default.isString(v),
      mode: (v) => util_default.isString(v),
      crop: (v) => util_default.isUndefined(v) || Crop_default.isInstance(v),
      loop: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      dynamic: (v) => util_default.isUndefined(v) || util_default.isBoolean(v),
      filter: (v) => util_default.isUndefined(v) || util_default.isObject(v)
    });
    if (this.isBackground)
      this.endTime = void 0;
  }
  renderXML(parent) {
    const image = super.renderXML(parent);
    image.att("src", this.src);
    image.att("mode", this.mode);
    image.att("dynamic", this.dynamic);
    image.att("loop", this.loop);
    if (this.crop) {
      image.att("crop-style", this.crop.style);
      image.att("crop-x", this.crop.x);
      image.att("crop-y", this.crop.y);
      image.att("crop-width", this.crop.width);
      image.att("crop-height", this.crop.height);
      image.att("crop-clipType", this.crop.clipType);
      image.att("crop-clipStyle", this.crop.clipStyle);
    }
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
      dynamic: this.dynamic
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
  fadeInDuration;
  fadeOutDuration;
  constructor(options) {
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    super(options, ElementTypes_default.Audio);
    util_default.optionsInject(this, options, {
      fadeInDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0,
      fadeOutDuration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      fadeInDuration: (v) => util_default.isUndefined(v) || util_default.isFinite(v),
      fadeOutDuration: (v) => util_default.isUndefined(v) || util_default.isFinite(v)
    });
  }
  renderXML(parent) {
    const audio = super.renderXML(parent);
    audio.att("fadeInDuration", this.fadeInDuration);
    audio.att("fadeOutDuration", this.fadeOutDuration);
  }
  renderOldXML(parent, resources, global) {
    const audio = super.renderOldXML(parent, resources, global);
    util_default.isNumber(this.fadeInDuration) && audio.att("fadeIn", this.fadeInDuration / 1e3);
    util_default.isNumber(this.fadeOutDuration) && audio.att("fadeOut", this.fadeOutDuration / 1e3);
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      fadeIn: this.fadeInDuration,
      fadeOut: this.fadeOutDuration
    });
  }
  static isInstance(value) {
    return value instanceof Audio;
  }
};
var Audio_default = Audio;

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
var SSML = class extends Element_default {
  constructor(options) {
    super(options, ElementTypes_default.SSML);
  }
  renderXML(parent) {
    const ssml = super.renderXML(parent);
    this.value && ssml.ele(this.value);
  }
  renderOldXML(parent, resources, global) {
    const ssml = super.renderOldXML(parent, resources, global);
    this.value && ssml.txt(this.value);
  }
  static isInstance(value) {
    return value instanceof SSML;
  }
};
var SSML_default = SSML;

// src/elements/Voice.ts
var _Voice = class extends Media_default {
  provider = "";
  text;
  declaimer;
  sampleRate;
  speechRate;
  pitchRate;
  enableSubtitle;
  constructor(options) {
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    super(options, ElementTypes_default.Voice);
    util_default.optionsInject(this, options, {
      provider: (v) => util_default.defaultTo(v, VoiceProviders_default.Aliyun),
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
  }
  renderXML(parent) {
    const voice = super.renderXML(parent);
    voice.att("provider", this.provider);
    voice.att("text", this.text);
    voice.att("declaimer", this.declaimer);
    voice.att("sampleRate", this.sampleRate);
    voice.att("speechRate", this.speechRate);
    voice.att("pitchRate", this.pitchRate);
  }
  renderOldXML(parent, resources, global) {
    const voice = super.renderOldXML(parent, resources, global);
    voice.att("provider", this.provider);
    voice.att("text", this.text);
    voice.att("voice", this.declaimer);
    voice.att("sampleRate", this.sampleRate);
    voice.att("speechRate", this.speechRate);
    voice.att("pitchRate", this.pitchRate);
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
    return new SSML_default({
      value: `<speak provider="${this.provider}"><voice name="${this.declaimer}"><prosody contenteditable="true" rate="${this.playbackRate}" volume="${this.volume}"><p>${this.text}</p></prosody></voice></speak>`
    });
  }
  get ssml() {
    var _a, _b;
    return ((_a = this.children) == null ? void 0 : _a.length) ? (_b = this.children[0].value) == null ? void 0 : _b.trim() : null;
  }
  static isInstance(value) {
    return value instanceof _Voice;
  }
};
var Voice = _Voice;
__publicField(Voice, "Provider", VoiceProviders_default);
var Voice_default = Voice;

// src/elements/Video.ts
var Video = class extends Media_default {
  crop;
  demuxSrc;
  constructor(options) {
    super(options, ElementTypes_default.Video);
    util_default.optionsInject(this, options, {
      crop: (v) => v && new Crop_default(v)
    }, {
      crop: (v) => util_default.isUndefined(v) || Crop_default.isInstance(v),
      demuxSrc: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
    if (this.isBackground)
      this.endTime = void 0;
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
  constructor(options) {
    super(options, ElementTypes_default.Vtuber);
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
  }
  renderOldXML(parent, resources, global) {
    const vtuber = super.renderOldXML(parent, resources, global);
    vtuber.att("provider", this.provider);
    vtuber.att("text", this.value || this.text);
    vtuber.att("solution", this.solution);
    vtuber.att("declaimer", this.declaimer);
    vtuber.att("cutoutColor", this.cutoutColor);
    vtuber.att("demuxSrc", this.demuxSrc);
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
  duration;
  poster;
  constructor(options, type = ElementTypes_default.Canvas) {
    super(options, type);
    util_default.optionsInject(this, options, {
      duration: (v) => !util_default.isUndefined(v) ? Number(v) : void 0
    }, {
      chartId: (v) => util_default.isString(v),
      configSrc: (v) => util_default.isString(v),
      dataSrc: (v) => util_default.isString(v),
      duration: (v) => util_default.isUndefined(v) || util_default.isNumber(v),
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v)
    });
  }
  renderXML(parent) {
    const canvas = super.renderXML(parent);
    canvas.att("chartId", this.chartId);
    canvas.att("poster", this.poster);
    canvas.att("duration", this.duration);
    canvas.att("configSrc", this.configSrc);
    canvas.att("dataSrc", this.dataSrc);
    return canvas;
  }
  renderOldXML(parent, resources, global) {
    const canvas = super.renderOldXML(parent, resources, global);
    canvas.att("chartId", this.chartId);
    canvas.att("poster", this.poster);
    canvas.att("duration", this.duration ? util_default.millisecondsToSenconds(this.duration) : void 0);
    canvas.att("optionsPath", this.configSrc);
    canvas.att("dataPath", this.dataSrc);
    return canvas;
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadProps(__spreadValues({}, parentOptions), {
      chartId: this.chartId,
      poster: this.poster,
      duration: this.duration ? util_default.millisecondsToSenconds(this.duration) : void 0,
      optionPath: this.configSrc,
      dataPath: this.dataSrc
    });
  }
  static isInstance(value) {
    return value instanceof Canvas;
  }
};
var Canvas_default = Canvas;

// src/elements/Chart.ts
var Chart = class extends Canvas_default {
  constructor(options) {
    super(options, ElementTypes_default.Chart);
    util_default.optionsInject(this, options, {}, {});
  }
  renderXML(parent) {
    super.renderXML(parent);
  }
  renderOldXML(parent, resources, global) {
    super.renderOldXML(parent, resources, global);
  }
  toOptions() {
    const parentOptions = super.toOptions();
    return __spreadValues({
      optionsPath: this.configSrc
    }, parentOptions);
  }
  static isInstance(value) {
    return value instanceof Chart;
  }
};
var Chart_default = Chart;

// src/elements/Group.ts
var Group = class extends Element_default {
  constructor(options) {
    super(options, ElementTypes_default.Group);
  }
  static isInstance(value) {
    return value instanceof Group;
  }
};
var Group_default = Group;

// src/elements/Sticker.ts
var Sticker = class extends Image_default {
  constructor(options) {
    super(options, ElementTypes_default.Sticker);
  }
  static isInstance(value) {
    return value instanceof Sticker;
  }
};
var Sticker_default = Sticker;

// src/elements/Subtitle.ts
var Subtitle = class extends Text_default {
  constructor(options) {
    super(options, ElementTypes_default.Subtitle);
  }
  static isInstance(value) {
    return value instanceof Subtitle;
  }
};
var Subtitle_default = Subtitle;

// src/ElementFactory.ts
var ElementFactory = class {
  static createElement(data) {
    if (!util_default.isObject(data))
      throw new TypeError("data must be an Object");
    switch (data.type) {
      case ElementTypes_default.Text:
        return new Text_default(data);
      case ElementTypes_default.Image:
        return new Image_default(data);
      case ElementTypes_default.Audio:
        return new Audio_default(data);
      case ElementTypes_default.Voice:
        return new Voice_default(data);
      case ElementTypes_default.Video:
        return new Video_default(data);
      case ElementTypes_default.Vtuber:
        return new Vtuber_default(data);
      case ElementTypes_default.Chart:
        return new Chart_default(data);
      case ElementTypes_default.Canvas:
        return new Canvas_default(data);
      case ElementTypes_default.Group:
        return new Group_default(data);
      case ElementTypes_default.Sticker:
        return new Sticker_default(data);
      case ElementTypes_default.Subtitle:
        return new Subtitle_default(data);
      case ElementTypes_default.SSML:
        return new SSML_default(data);
    }
    return new Element_default(data);
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
var _createXMLRoot, createXMLRoot_fn;
var _Scene = class {
  constructor(options) {
    __privateAdd(this, _createXMLRoot);
    __publicField(this, "type", "");
    __publicField(this, "id", "");
    __publicField(this, "name");
    __publicField(this, "poster");
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "aspectRatio", "");
    __publicField(this, "duration", 0);
    __publicField(this, "backgroundColor");
    __publicField(this, "transition");
    __publicField(this, "filter");
    __publicField(this, "children", []);
    if (!util_default.isObject(options))
      throw new TypeError("options must be an Object");
    util_default.optionsInject(this, options, {
      type: () => "scene",
      id: (v) => util_default.defaultTo(_Scene.isId(v) ? v : void 0, util_default.uniqid()),
      width: (v) => Number(v),
      height: (v) => Number(v),
      duration: (v) => Number(v),
      transition: (v) => v && new Transition(v),
      children: (datas) => util_default.isArray(datas) ? datas.map((data) => Element_default.isInstance(data) ? data : ElementFactory_default.createElement(data)) : []
    }, {
      type: (v) => v === "scene",
      id: (v) => _Scene.isId(v),
      name: (v) => util_default.isUndefined(v) || util_default.isString(v),
      poster: (v) => util_default.isUndefined(v) || util_default.isString(v),
      width: (v) => util_default.isFinite(v),
      height: (v) => util_default.isFinite(v),
      aspectRatio: (v) => util_default.isString(v),
      duration: (v) => util_default.isFinite(v),
      backgroundColor: (v) => util_default.isUndefined(v) || util_default.isString(v),
      transition: (v) => util_default.isUndefined(v) || Transition.isInstance(v),
      filter: (v) => util_default.isUndefined(v) || util_default.isObject(v),
      children: (v) => util_default.isArray(v)
    });
  }
  appendChild(node) {
    this.children.push(node);
  }
  toXML(pretty = false) {
    const scene = this.renderXML();
    return scene.end({ prettyPrint: pretty });
  }
  toOldXML(pretty = false) {
    const board = this.renderOldXML();
    return board.end({ prettyPrint: pretty });
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
  static isId(value) {
    return util_default.isString(value) && /^[a-zA-Z0-9]{16}$/.test(value);
  }
  static isInstance(value) {
    return value instanceof _Scene;
  }
  generateAllTrack(baseTime = 0) {
    const track = this.children.map((node) => {
      node.setParentSection(baseTime, this.duration);
      return node;
    });
    return track == null ? void 0 : track.sort((n1, n2) => n1.absoluteStartTime - n2.absoluteStartTime);
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
};
var Scene = _Scene;
_createXMLRoot = new WeakSet();
createXMLRoot_fn = function(tagName = "scene", attributes = {}, headless = true) {
  const root = headless ? (0, import_xmlbuilder2.create)() : (0, import_xmlbuilder2.create)({ version: "1.0" });
  const scene = root.ele(tagName, __spreadValues({
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
var Scene_default = Scene;

// src/parsers/Parser.ts
var import_xmlbuilder22 = require("xmlbuilder2");
var import_fast_xml_parser = require("fast-xml-parser");
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
    const root = (0, import_xmlbuilder22.create)({ version: "1.0" });
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
    _template.children.forEach((node) => node.renderXML(template));
    return template.end({ prettyPrint: pretty });
  }
  static toBuffer(tempalte) {
    return Buffer.from(tempalte.toXML());
  }
  static parseJSON(content, data = {}, vars = {}) {
    return new Template_default(util_default.isString(content) ? JSON.parse(content) : content, data, vars);
  }
  static async parseJSONPreProcessing(content, data = {}, vars = {}, dataProcessor, varsProcessor) {
    const object = util_default.isString(content) ? JSON.parse(content) : content;
    if (util_default.isFunction(dataProcessor) && util_default.isString(object.dataSrc)) {
      const result = await dataProcessor(object.dataSrc);
      util_default.isObject(result) && util_default.assign(data, result);
    }
    if (util_default.isFunction(varsProcessor) && util_default.isString(object.varsSrc)) {
      const result = await varsProcessor(object.varsSrc);
      util_default.isObject(result) && util_default.assign(data, result);
    }
    return new Template_default(object, util_default.assign(object.data || {}, data), util_default.assign(object.vars || {}, vars));
  }
  static parseXML(content, data = {}, vars = {}) {
    let xmlObject, varsObject, dataObject;
    xmlParser.parse(content).forEach((o) => {
      if (o.template)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
    });
    if (!xmlObject)
      throw new Error("template xml invalid");
    function parse(obj, target = {}) {
      const type = Object.keys(obj)[0];
      target.type = type;
      for (let key in obj[":@"]) {
        const value = obj[":@"][key];
        let index;
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
        const result = parse(v, {});
        result && target.children.push(result);
      });
      return target;
    }
    const completeObject = parse(xmlObject);
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
      varsObject && processing(parse(varsObject), _vars);
      dataObject && processing(parse(dataObject), _data);
    }
    return new Template_default(completeObject, util_default.assign(_data, data), util_default.assign(_vars, vars));
  }
  static async parseXMLPreProcessing(content, data = {}, vars = {}, dataProcessor, varsProcessor) {
    let xmlObject, varsObject, dataObject;
    xmlParser.parse(content).forEach((o) => {
      if (o.template)
        xmlObject = o;
      if (o.vars)
        varsObject = o;
      if (o.data)
        dataObject = o;
    });
    if (!xmlObject)
      throw new Error("template xml invalid");
    function parse(obj, target = {}) {
      const type = Object.keys(obj)[0];
      target.type = type;
      for (let key in obj[":@"]) {
        const value = obj[":@"][key];
        let index;
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
        const result = parse(v, {});
        result && target.children.push(result);
      });
      return target;
    }
    const completeObject = parse(xmlObject);
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
      varsObject && processing(parse(varsObject), _vars);
      dataObject && processing(parse(dataObject), _data);
    }
    if (dataObject == null ? void 0 : dataObject[":@"]) {
      const attrs = dataObject[":@"];
      if (util_default.isFunction(dataProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.assign(data, result);
      }
    }
    if (varsObject == null ? void 0 : varsObject[":@"]) {
      const attrs = varsObject[":@"];
      if (util_default.isFunction(varsProcessor) && attrs.source) {
        const result = await dataProcessor(attrs.source);
        util_default.isObject(result) && util_default.assign(vars, result);
      }
    }
    return new Template_default(completeObject, util_default.assign(_data, data), util_default.assign(_vars, vars));
  }
};
var Parser_default = Parser;

// src/parsers/OldParser.ts
var import_xmlbuilder23 = require("xmlbuilder2");
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
    const root = (0, import_xmlbuilder23.create)({ version: "1.0" });
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
  static parseXML(content, data = {}, vars = {}) {
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
        endTime: Number(obj.outPoint) ? Number(obj.outPoint) * 1e3 : parentDuration ? (parentDuration - (Number(obj.outPoint) || 0)) * 1e3 : void 0
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
                effectWordInterval: caption.effectWordInterval ? caption.effectWordInterval * 1e3 : void 0
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
                    value: (0, import_xmlbuilder23.create)({
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
    }, data, vars);
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
  static parseOptions(options) {
    const templateChildren = [];
    function buildBaseData(obj, parentDuration) {
      var _a;
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
        enterEffect: obj.animationIn && obj.animationIn.name !== "none" ? {
          type: obj.animationIn.name,
          duration: obj.animationIn.duration * 1e3
        } : void 0,
        exitEffect: obj.animationOut && obj.animationOut.name !== "none" ? {
          type: obj.animationOut.name,
          duration: obj.animationOut.duration * 1e3
        } : void 0,
        backgroundColor: obj.fillColor,
        startTime: obj.animationIn && obj.animationIn.delay > 0 ? obj.animationIn.delay * 1e3 : 0,
        endTime: obj.animationOut && obj.animationOut.delay > 0 ? obj.animationOut.delay * 1e3 : parentDuration ? (parentDuration - (((_a = obj == null ? void 0 : obj.animationOut) == null ? void 0 : _a.duration) || 0)) * 1e3 : void 0
      };
    }
    options == null ? void 0 : options.storyboards.forEach((board) => {
      const { id, poster, duration } = board;
      const sceneChildren = [];
      board.bgImage && sceneChildren.push(new Image_default(__spreadProps(__spreadValues({}, buildBaseData(board.bgImage, duration)), {
        endTime: void 0,
        isBackground: true,
        src: board.bgImage.src
      })));
      board.bgVideo && sceneChildren.push(new Video_default(__spreadProps(__spreadValues({}, buildBaseData(board.bgVideo, duration)), {
        poster: board.bgVideo.poster,
        src: board.bgVideo.src,
        duration: board.bgVideo.duration ? board.bgVideo.duration * 1e3 : void 0,
        volume: board.bgVideo.volume,
        muted: board.bgVideo.muted,
        loop: board.bgVideo.loop,
        endTime: void 0,
        isBackground: true,
        seekStart: board.bgVideo.seekStart ? board.bgVideo.seekStart * 1e3 : void 0,
        seekEnd: board.bgVideo.seekEnd ? board.bgVideo.seekEnd * 1e3 : void 0
      })));
      board.bgMusic && templateChildren.push(new Audio_default(__spreadProps(__spreadValues({}, buildBaseData(board.bgMusic, duration)), {
        src: board.bgMusic.src,
        volume: board.bgMusic.volume,
        duration: board.bgMusic.duration ? board.bgMusic.duration * 1e3 : void 0,
        seekStart: board.bgMusic.seekStart ? board.bgMusic.seekStart * 1e3 : void 0,
        seekEnd: board.bgMusic.seekEnd ? board.bgMusic.seekEnd * 1e3 : void 0,
        muted: board.bgMusic.muted,
        loop: board.bgMusic.loop,
        isBackground: true,
        fadeInDuration: board.bgMusic.fadeInDuration ? board.bgMusic.fadeInDuration * 1e3 : void 0,
        fadeOutDuration: board.bgMusic.fadeOutDuration ? board.bgMusic.fadeOutDuration * 1e3 : void 0
      })));
      board == null ? void 0 : board.elements.forEach((element) => {
        switch (element.elementType) {
          case "image":
            sceneChildren.push(new Image_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              crop: element.crop ? {
                style: element.crop.style,
                x: element.crop.left,
                y: element.crop.top,
                width: element.crop.width,
                height: element.crop.height,
                clipType: element.crop.clipType,
                clipStyle: element.crop.clipStyle
              } : void 0,
              src: element.src,
              loop: element.loop,
              dynamic: element.src.indexOf(".gif") !== -1
            })));
            break;
          case "text":
            sceneChildren.push(new Text_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              width: element.width || element.renderWidth || 0,
              height: element.height || element.renderHeight || 0,
              value: element.content,
              fontFamily: element.fontFamily ? element.fontFamily.replace(/\.ttf|\.otf$/, "") : void 0,
              fontSize: element.fontSize,
              fontColor: element.fontColor,
              fontWeight: element.bold,
              fontStyle: element.italic === "italic" ? "italic" : void 0,
              lineHeight: parseFloat((Number(element.lineHeight) / Number(element.fontSize)).toFixed(3)),
              wordSpacing: element.wordSpacing,
              textAlign: element.textAlign,
              effectType: element.effectType,
              effectWordDuration: element.effectWordDuration ? element.effectWordDuration * 1e3 : void 0,
              effectWordInterval: element.effectWordInterval ? element.effectWordInterval * 1e3 : void 0
            })));
            break;
          case "audio":
            sceneChildren.push(new Audio_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              src: element.src,
              duration: element.duration ? element.duration * 1e3 : void 0,
              volume: element.volume,
              muted: element.muted,
              loop: element.loop,
              seekStart: element.seekStart ? element.seekStart * 1e3 : void 0,
              seekEnd: element.seekEnd ? element.seekEnd * 1e3 : void 0,
              fadeInDuration: element.fadeInDuration ? element.fadeInDuration * 1e3 : void 0,
              fadeOutDuration: element.fadeOutDuration ? element.fadeOutDuration * 1e3 : void 0
            })));
            break;
          case "voice":
            sceneChildren.push(new Voice_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              src: element.src,
              duration: element.duration ? element.duration * 1e3 : void 0,
              volume: element.volume,
              seekStart: element.seekStart ? element.seekStart * 1e3 : void 0,
              seekEnd: element.seekEnd ? element.seekEnd * 1e3 : void 0,
              loop: element.loop,
              muted: element.muted,
              provider: element.provider,
              children: element.ssml ? [
                new SSML_default({
                  value: element.ssml
                })
              ] : [],
              text: element.text,
              declaimer: element.voice,
              speechRate: element.playbackRate ? element.playbackRate : void 0,
              pitchRate: element.pitchRate ? Number(element.pitchRate) + 1 : void 0
            })));
            break;
          case "video":
            sceneChildren.push(new Video_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              poster: element.poster,
              src: element.src,
              crop: element.crop ? {
                style: element.crop.style,
                x: element.crop.left,
                y: element.crop.top,
                width: element.crop.width,
                height: element.crop.height,
                clipType: element.crop.clipType,
                clipStyle: element.crop.clipStyle
              } : void 0,
              duration: element.duration ? element.duration * 1e3 : void 0,
              volume: element.volume,
              muted: element.muted,
              loop: element.loop,
              seekStart: element.seekStart ? element.seekStart * 1e3 : void 0,
              seekEnd: element.seekEnd ? element.seekEnd * 1e3 : void 0,
              demuxSrc: element.demuxSrc
            })));
            break;
          case "chart":
            sceneChildren.push(new Chart_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              chartId: element.chartId,
              poster: element.poster,
              duration: !util_default.isUndefined(element.duration) ? element.duration * 1e3 : void 0,
              configSrc: element.optionsPath,
              dataSrc: element.dataPath
            })));
            break;
          case "canvas":
            sceneChildren.push(new Canvas_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              chartId: element.chartId,
              poster: element.poster,
              duration: !util_default.isUndefined(element.duration) ? element.duration * 1e3 : void 0,
              configSrc: element.optionPath,
              dataSrc: element.dataPath
            })));
            break;
          case "vtuber":
            sceneChildren.push(new Vtuber_default(__spreadProps(__spreadValues({}, buildBaseData(element, duration)), {
              poster: element.poster,
              src: element.src,
              provider: element.provider,
              text: element.text,
              solution: element.solution,
              declaimer: element.declaimer,
              cutoutColor: element.cutoutColor,
              duration: element.duration ? element.duration * 1e3 : void 0,
              volume: element.volume,
              muted: element.muted,
              loop: element.loop,
              seekStart: element.seekStart ? element.seekStart * 1e3 : void 0,
              seekEnd: element.seekEnd ? element.seekEnd * 1e3 : void 0,
              demuxSrc: element.demuxSrc
            })));
            break;
        }
      });
      templateChildren.push(new Scene_default({
        id,
        poster,
        width: options.videoWidth,
        height: options.videoHeight,
        aspectRatio: options.videoSize,
        duration: duration * 1e3,
        backgroundColor: board.bgColor ? board.bgColor.fillColor : void 0,
        transition: board.transition ? {
          type: board.transition.name,
          duration: board.transition.duration * 1e3
        } : void 0,
        filter: void 0,
        children: sceneChildren
      }));
    });
    options.bgImage && templateChildren.push(new Image_default(__spreadProps(__spreadValues({}, buildBaseData(options.bgImage)), {
      endTime: void 0,
      isBackground: true,
      src: options.bgImage.src
    })));
    options.bgVideo && templateChildren.push(new Video_default(__spreadProps(__spreadValues({}, buildBaseData(options.bgVideo)), {
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
    options.bgMusic && templateChildren.push(new Audio_default(__spreadProps(__spreadValues({}, buildBaseData(options.bgMusic)), {
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
      videoBitrate: `${options.videoBitrate}`,
      audioBitrate: `${options.audioBitrate}`,
      backgroundColor: options.bgColor ? options.bgColor.fillColor || void 0 : void 0,
      captureTime: util_default.isFinite(options.captureTime) ? options.captureTime * 1e3 : void 0,
      compile: options.compile,
      children: templateChildren
    });
  }
};
var OptionsParser_default = OptionsParser;

// src/Compiler.ts
var Compiler = class {
  static compile(rawData, data = {}, valueMap = {}) {
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
              result2 = this.eval(expression, data2, valueMap);
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
              result2 = this.eval(expression, data2, valueMap);
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
            list = this.eval(expression, data2, valueMap);
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
          switch (expression.expression) {
            case "__UUID__":
              result = expression.replace(result, util_default.uuid());
              break;
            case "__UNIQID__":
              result = expression.replace(result, util_default.uniqid());
              break;
            default:
              try {
                result = expression.replace(result, this.eval(expression.expression, data2, valueMap));
              } catch {
                result = null;
              }
          }
          return result;
        }, value);
      }
      return value;
    };
    return render(rawData, data);
  }
  static eval(expression, data = {}, valueMap = {}) {
    let result;
    const _data = __spreadValues(__spreadValues({}, data), valueMap);
    const scope = {
      data: _data,
      eval: Function(`const {${Object.keys(_data).join(",")}}=this.data;return ${expression}`)
    };
    try {
      result = scope.eval();
    } catch (err) {
      result = "";
    }
    if (util_default.isString(result) && Object.keys(valueMap).length) {
      const expressions = this.expressionsExtract(result);
      if (!expressions || !expressions.length)
        return result;
      return expressions.reduce((_result, expression2) => {
        try {
          _result = expression2.replace(_result, this.eval(expression2.expression, util_default.assign(data, valueMap)));
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
    const match = value.toString().match(/(?<={{)[^}]*(?=}})/g);
    if (!match)
      return [];
    const list = match;
    return Array.from(new Set(list)).map((expression) => {
      return {
        expression: expression.replace(/\$\#/g, "{").replace(/\#\$/g, "}"),
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
};
var Compiler_default = Compiler;

// src/Template.ts
var _Template = class {
  type = "";
  id = "";
  mode = "";
  version = "";
  name;
  poster;
  actuator;
  width = 0;
  height = 0;
  aspectRatio = "";
  fps = 0;
  crf;
  videoCodec;
  videoBitrate;
  pixelFormat;
  frameQuality;
  format;
  volume = 0;
  audioCodec;
  sampleRate;
  audioBitrate;
  backgroundColor;
  captureTime;
  createTime = 0;
  updateTime = 0;
  buildBy = "";
  compile = false;
  children = [];
  constructor(options, data = {}, vars = {}) {
    options.compile && (options = Compiler_default.compile(options, data, vars));
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
      compile: (v) => util_default.booleanParse(util_default.defaultTo(v, false)),
      children: (datas) => util_default.isArray(datas) ? datas.map((data2) => {
        if (Scene_default.isInstance(data2) || Element_default.isInstance(data2))
          return data2;
        if (data2.type === "scene")
          return new Scene_default(data2);
        else
          return ElementFactory_default.createElement(data2);
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
      compile: (v) => util_default.isBoolean(v),
      children: (v) => util_default.isArray(v)
    });
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
  static parse(content, data, vars) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Template(content);
    if (/\<template/.test(content))
      return _Template.parseXML(content, data, vars);
    else if (/\<project/.test(content))
      return _Template.parseOldXML(content, data, vars);
    else
      return _Template.parseJSON(content, data, vars);
  }
  static async parseAndProcessing(content, data, vars, dataProcessor, varsProcessor) {
    if (!util_default.isString(content) && !util_default.isObject(content))
      throw new TypeError("content must be an string or object");
    if (util_default.isBuffer(content))
      content = content.toString();
    if (util_default.isObject(content))
      return new _Template(content);
    if (/\<template/.test(content))
      return await _Template.parseXMLPreProcessing(content, data, vars, dataProcessor, varsProcessor);
    else if (/\<project/.test(content))
      return _Template.parseOldXML(content, data, vars);
    else
      return await _Template.parseJSONPreProcessing(content, data, vars, dataProcessor, varsProcessor);
  }
  generateAllTrack() {
    let track = [];
    let baseTime = 0;
    const duration = this.duration;
    this.children.forEach((node) => {
      if (Scene_default.isInstance(node)) {
        track = track.concat(node.generateAllTrack(baseTime));
        baseTime += node.duration;
      } else {
        node.setParentSection(0, duration);
        track.push(node);
      }
    });
    return track;
  }
  get duration() {
    return this.children.reduce((duration, node) => Scene_default.isInstance(node) ? duration + node.duration : duration, 0);
  }
  get sortedChilren() {
    const elements = this.elements;
    elements.sort((a, b) => {
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
};
var Template = _Template;
__publicField(Template, "type", "template");
__publicField(Template, "parseJSON", Parser_default.parseJSON);
__publicField(Template, "parseJSONPreProcessing", Parser_default.parseJSONPreProcessing);
__publicField(Template, "parseXML", Parser_default.parseXML);
__publicField(Template, "parseXMLPreProcessing", Parser_default.parseXMLPreProcessing);
__publicField(Template, "parseOldXML", OldParser_default.parseXML);
__publicField(Template, "parseOptions", OptionsParser_default.parseOptions);
var Template_default = Template;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Scene,
  Template,
  elements
});
