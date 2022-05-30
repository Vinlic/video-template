import util from "./util";

export default {

    //生成UUID
    "__UUID__": () => util.uuid(),

    //生成元素唯一ID
    "__UNIQID__": () => util.uniqid()

} as any;