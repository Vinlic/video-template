import lodash from 'lodash';

import { v1 as uuid } from 'uuid';
import uniqid from 'goodid.js';

export default {
  ...lodash,

  uuid: (separator: boolean = true): string => (separator ? uuid() : uuid().replace(/\-/g, '')),

  uniqid,

  optionsInject(that: any, options: any, initializers: any = {}, checkers: any = {}) {
    Object.keys(that).forEach((key) => {
      if (/^\_/.test(key)) return;
      let value = options[key];
      if (this.isFunction(initializers[key])) value = initializers[key](value);
      if (this.isFunction(checkers[key]) && !checkers[key](value)) throw new Error(`parameter ${key} invalid`);
      if ((!this.isFunction(initializers[key]) && !this.isFunction(checkers[key])) || this.isUndefined(value)) return;
      if (this.isSymbol(that[key]) && !this.isSymbol(value)) return;
      that[key] = value;
    });
  },

  isURL(value: any): boolean {
    return !this.isUndefined(value) && /^(http|https)/.test(value);
  },

  isBASE64(value: any): boolean {
    return !this.isUndefined(value) && /^[a-zA-Z0-9\/\+]+(=?)+$/.test(value);
  },

  isStringNumber(value: any): boolean {
    return this.isFinite(Number(value));
  },

  isUnixTimestamp(value: any): boolean {
    return /^[0-9]{10}$/.test(`${value}`);
  },

  isTimestamp(value: any): boolean {
    return /^[0-9]{13}$/.test(`${value}`);
  },

  unixTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  },

  timestamp(): number {
    return Date.now();
  },

  urlJoin(...values: string[]): string {
    let url = values[0];
    for (let i = 1; i < values.length; i++) url += `/${values[i].replace(/^\/*/, '')}`;
    return url;
  },

  millisecondsToHmss(milliseconds: string | number): string {
    if (this.isString(milliseconds)) return milliseconds as string;
    const sec = Math.floor((milliseconds as number) / 1000);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - hours * 3600) / 60);
    const seconds = sec - hours * 3600 - minutes * 60;
    const ms = ((milliseconds as number) % 60000) - seconds * 1000;
    return `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${
      seconds > 9 ? seconds : '0' + seconds
    }.${ms}`;
  },

  millisecondsToSenconds(milliseconds: number, precision: number = 3): number {
    return parseFloat((milliseconds / 1000).toFixed(precision));
  },

  arrayParse(value: string | string[]): string[] {
    return this.isArray(value) ? value as string[] : [value as string];
  },

  booleanParse(value: any) {
    switch (Object.prototype.toString.call(value)) {
      case '[object String]':
        return ['true', 't', 'yes', 'y', 'on', '1'].indexOf(value.trim().toLowerCase()) !== -1;
      case '[object Number]':
        return value.valueOf() === 1;
      case '[object Boolean]':
        return value.valueOf();
      default:
        return false;
    }
  },
};
