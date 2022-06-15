const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { Template } = require("../dist");

(async () => {
    const [templateSource, outputPath, toOld = false] = process.argv.slice(2);

    console.info("<<<< Template Convert >>>>");

    if (!templateSource)
        throw new Error("template source must be path or url");

    if (!outputPath || !fs.existsSync(path.dirname(outputPath)))
        throw new Error("template output directory path must exists");

    let templateContent;
    if (!/^(http|https)/.test(templateSource)) {
        if (!fs.existsSync(templateSource)) throw new Error("template file not exists");
        templateContent = (await fs.promises.readFile(templateSource)).toString();  //读取模板内容
    }
    else {
        const result = await axios.request({ method: "GET", url: templateSource });
        if (result.status !== 200) throw new Error(result.statusText);
        templateContent = result.data;
    }

    console.info("template convert complete");

    const template = await Template.parseAndProcessing(templateContent, {}, {}, async source => {
        if(!source) return;
        const result = await axios.get(source, { timeout: 60000 });
        if(result.status !== 200) throw new Error("data source request error: " + result.statusText);
        const { code, msg, data } = result.data;
        if(code !== 0) throw new Error("data source response error: " + msg);
        return data;
    });

    const ext = path.extname(outputPath);

    switch(ext) {
        case ".json":
            await fs.promises.writeFile(outputPath, toOld ? JSON.stringify(template.toOptions()) : JSON.stringify(template));
        break;
        case ".xml":
            await fs.promises.writeFile(outputPath, toOld ? template.toOldXML(true) : template.toXML(true));
        break;
        default:
            throw new Error(`format ${ext} is no supported`);
    }
    
})()
.catch(err => console.error(err));