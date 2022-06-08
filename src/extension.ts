import util from "./util";

const vars = {  //扩展变量

    //生成UUID
    "__UUID__": () => util.uuid(),

    //生成元素唯一ID
    "__UNIQID__": () => util.uniqid()

} as any;

const functions = {  //扩展函数

    

} as any;

export default { vars, functions };