import util from './util';
import extension from './extension';

class Compiler {

  /**
   * 编译模板
   *
   * @param {Object} rawData 待编译数据
   * @param {Object} data 绑定数据
   * @param {Object} valueMap 值映射对象
   * @returns {Object} 编译过的数据
   */
  public static compile(rawData: any, data = {}, valueMap = {}, extendsScript = "") {
    let extendsScriptCtx = {};
    if(util.isString(extendsScript) && extendsScript.length)  //如果存在扩展脚本则缓存为上下文
      extendsScriptCtx = Function(extendsScript)();
    const render = (value: any, data = {}, scope: any = {}): any => {
      if (util.isObject(value)) {
        if (util.isArray(value)) {
          const _scope = {}; //此层作用域
          let children: any = []; //子节点们
          value.forEach((v: any) => {
            const result = render(util.cloneDeep(v), data, _scope); //继续递归渲染下层数据
            if (result === null) return; //如果返回null则此节点丢弃
            if (util.isArray(result))
              //如果返回数组则包含了扩展节点合入
              children = [...children, ...result];
            //其它情况为普通节点塞回去
            else children.push(result);
          });
          return children; //返回给上层调用者
        }
        const attrs: any = value;
        const { for: $for, forItem, forIndex, if: $if, elif, else: $else } = attrs; //结构逻辑属性
        if ($if) {
          //如果分歧
          delete attrs.if; //去除if属性避免合到产出标签
          const expressions = this.expressionsExtract($if); //条件分歧表达式提取
          if (!expressions) {
            scope.ifFlag = false;
            return null; //丢弃节点
          }
          if (expressions.length) {
            //如果无表达式将默认为真因为if属性里有值
            const { expression } = expressions[0];
            let result;
            try {
              result = this.eval(expression, data, valueMap, extendsScriptCtx);
            } catch { } //尝试访问表达式指向的值
            if (!result) {
              //结果为假则抛弃节点并设置标识为假
              scope.ifFlag = false;
              return null; //丢弃节点
            }
          }
          scope.ifFlag = true; //设置分歧为真
        } else if (elif) {
          //否则如果分歧
          if (util.isUndefined(scope.ifFlag)) throw new Error('使用elif属性节点必须处于包含if属性节点的下一个节点');
          delete attrs.elif; //去除elif属性避免合到产出标签
          if (scope.ifFlag) {
            //如果上个ifFlag为真代表当前节点应该放弃
            scope.ifFlag = true;
            return null; //丢弃节点
          }
          const expressions = this.expressionsExtract(elif); //条件分歧表达式提取
          if (!expressions) {
            scope.ifFlag = false;
            return null;
          }
          if (!expressions.length) {
            //如果无表达式将默认为真因为elif属性里有值
            const { expression } = expressions[0];
            let result;
            try {
              result = this.eval(expression, data, valueMap, extendsScriptCtx);
            } catch { } //尝试访问表达式指向的值
            if (!result) {
              //结果为假则抛弃节点并设置标识为假
              scope.ifFlag = false;
              return null; //丢弃节点
            }
          }
          scope.ifFlag = true; //设置分歧为真
        } else if ($else) {
          //否则分歧
          if (util.isUndefined(scope.ifFlag)) throw new Error('使用elif属性节点必须处于包含if属性节点的下一个节点');
          delete attrs.else; //去除else属性避免合到产出标签
          if (scope.ifFlag) {
            //如果之前有分歧为真则当前节点应当丢弃
            delete scope.ifFlag; //删除分歧标识
            return null; //丢弃节点
          }
        }
        if ($for) {
          delete attrs.for; //去除for属性避免合到产出标签和造成无限递归
          delete attrs.forIndex; //去除forIndex属性避免合到产出标签
          delete attrs.forItem; //去除forItem属性避免合到产出标签
          const expressions = this.expressionsExtract($for); //提取循环表达式
          if (!expressions || !expressions.length) return null; //如果没有表达式则直接丢弃节点
          const { expression } = expressions[0];
          let list = [];
          try {
            list = this.eval(expression, data, valueMap, extendsScriptCtx);
          } catch { } //尝试访问数组数据
          if (util.isNumber(list)) {
            //如果表达式返回值是数字则直接循环渲染节点指定个数
            const items = [];
            for (let i = 0; i < list; i++) {
              items.push(
                render(value, {
                  ...data,
                  [forIndex || 'index']: i,
                }),
              );
            }
            return items;
          }
          if (!util.isArray(list) || !list.length) return null; //如果返回值非数组或为空数组则丢弃节点
          return list.map((v: any, i: number) => {
            const item = util.cloneDeep(value); //克隆节点
            return render(item, {
              ...data, //将父级作用域变量注入
              [forIndex || 'index']: i, //设置for-index标注的变量或默认index作用域值供下层节点访问
              [forItem || 'item']: v, //设置for-item标注的变量或默认item作用域值供下层节点访问
            }); //将原节点和新节点指向最新生成的节点
          }); //如果为数组则克隆节点并渲染
        }
        const result: any = {};
        for (const key in value) result[key] = render(attrs[key], data); //递归渲染
        return result;
      } else if (util.isString(value)) {
        //如果值为字符串进入字符串表达式解析
        const expressions = this.expressionsExtract(value); //表达式提取
        if (!expressions || !expressions.length) return value; //如无任何匹配表达式则直接返回原值
        return expressions.reduce((result: any, expression: any) => {
          try {
            if (extension.vars[expression.expression])
              expression.replace(result, extension.vars[expression.expression]());
            else
              result = expression.replace(result, this.eval(expression.expression, data, valueMap, extendsScriptCtx));
          } catch {
            result = null;
          }
          return result;
        }, value); //表达式全部替换并返回替换后的值
      }
      return value;
    };
    return render(rawData, data); //开始渲染数据
  }

  /**
   * 数据作用域表达式执行
   *
   * @param {String} expression 表达式
   * @param {Object} data 当前作用域数据
   * @returns {Any} 执行结果
   */
  private static eval(expression: string, data = {}, valueMap = {}, extendsScriptCtx = {}) {
    let result;
    const _data = { ...data, ...valueMap, ...extension.functions, ...extendsScriptCtx };
    const evalFun = Function(`const {${Object.keys(_data).join(',')}}=this;return ${expression}`); //将表达式和数据注入在方法内
    try {
      result = evalFun.bind(_data)();
    } catch (err) {
      result = '';
    } //eval函数对象解构并执行表达式
    if (util.isString(result)) {
      //如果值中也包含了表达式也需要进行解析处理
      const expressions = this.expressionsExtract(result); //从值提取表达式
      if (!expressions || !expressions.length) return result; //如果不包含表达式则返回原值
      return expressions.reduce((_result: any, expression: any) => {
        try {
          _result = expression.replace(_result, this.eval(expression.expression, util.assign(data, valueMap), extendsScriptCtx));
        } catch (err) {
          _result = null;
        } //替换表达式为值
        return _result;
      }, result); //表达式全部替换并返回替换后的值
    }
    return result;
  }

  /**
   * 多个表达式提取并提供批量替换函数
   *
   * @param {String} value 表达式
   * @returns {Object} 被提取的表达式以及替换函数
   */
  private static expressionsExtract(value: any) {
    //如果表达式值不存在则返回空
    if (util.isUndefined(value) || value == null) return null;
    const match = value.toString().match(/(?<={{)[^}]*(?=}})/g); //匹配所有的表达式
    //不存在表达式则返回空数组
    if (!match) return [];
    const list: string[] = match;
    return Array.from(new Set(list)).map((expression: any) => {
      return {
        expression: expression.replace(/\$\#/g, "{").replace(/\#\$/g, "}"), //被提取表达式
        replace: (oldValue: string, newValue: string) => {
          //如果新值为空或未定义则返回空
          if (util.isUndefined(newValue) || newValue == null)
            return oldValue.replace(new RegExp(`\\{\\{${util.escapeRegExp(expression)}\\}\\}`, 'g'), '') || null; //将旧表达式替换为空字符串
          //如果旧值为空则直接返回新值
          if (oldValue == null) return newValue;
          return oldValue.replace(new RegExp(`\\{\\{${util.escapeRegExp(expression)}\\}\\}`, 'g'), newValue); //将旧表达式替换为新值
        }, //替换函数
      };
    }); //匹配结果排重并替换为包含对应替换方法的对象
  }
}

export default Compiler;
