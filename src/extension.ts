import util from "./util";

const vars = {  //扩展变量

    //生成UUID
    "__UUID__": () => util.uuid(),

    //生成元素唯一ID
    "__UNIQID__": () => util.uniqid()

} as any;

const functions = {  //扩展函数

    o2u: (v: any) => "json:" + JSON.stringify(v),

    o2b: (v: any) => "base64:" + util.encodeBASE64(v)

} as any;

export default { vars, functions };