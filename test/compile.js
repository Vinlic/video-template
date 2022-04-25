const fs = require("fs");
const path = require("path");

const { Template } = require("../dist");

(async () => {
    const rawXMLPath = path.join(__dirname, "raw.xml");
    const compiledXMLPath = path.join(__dirname, "compiled.xml");
    const content = (await fs.promises.readFile(rawXMLPath)).toString();
    const template = await Template.parse(content);
    console.log(template);
    fs.writeFileSync(compiledXMLPath, template.toXML(true));
})()
.catch(err => console.error(err));