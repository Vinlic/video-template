const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { Template } = require("../dist");

const fileServicePath = "/file-common-server/file";

(async () => {
    const [templateSource, templateBasePath, outputPath] = process.argv.slice(2);

    console.info("<<<< Template Pull >>>>");

    if (!templateSource)
        throw new Error("template source must be path or url");

    if (!templateBasePath)
        throw new Error("template name must be String");

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

    const lastIndex = templateBasePath.lastIndexOf("/");
    const templateName = templateBasePath.substring(lastIndex + 1);
    const fileServiceUrl = new URL(templateSource).origin + fileServicePath;

    const template = await Template.parseAndProcessing(templateContent, {}, {}, async source => {
        if (!source) return;
        const result = await axios.get(source, { timeout: 60000 });
        if (result.status !== 200) throw new Error("data source request error: " + result.statusText);
        const { code, msg, data } = result.data;
        if (code !== 0) throw new Error("data source response error: " + msg);
        return data;
    });

    console.info("template convert complete");

    const timeline = template.generateTimeline();  //生成时间线

    const templateVideoPath = `${templateBasePath}/videos`;
    const templateAudioPath = `${templateBasePath}/audios`;
    const templateImagePath = `${templateBasePath}/images`;
    const templateOtherPath = `${templateBasePath}/others`;

    const videoPath = path.join(outputPath, `/${templateName}/videos`);
    const audioPath = path.join(outputPath, `/${templateName}/audios`);
    const imagePath = path.join(outputPath, `/${templateName}/images`);
    const otherPath = path.join(outputPath, `/${templateName}/others`);

    await fs.promises.mkdir(videoPath, { recursive: true });
    await fs.promises.mkdir(audioPath, { recursive: true });
    await fs.promises.mkdir(imagePath, { recursive: true });
    await fs.promises.mkdir(otherPath, { recursive: true });

    async function download(url, outputPath) {
        if (fs.existsSync(outputPath)) return;
        console.log(`file ${url} downloading...`);
        const writeStream = fs.createWriteStream(outputPath);
        const result = await new Promise((resolve, reject) => {
            axios.get(url, {
                responseType: "stream",
                maxContentLength: Infinity,  //解除大小限制
                timeout: 60000,
            })
                .then(resolve)
                .catch(err => {
                    if (err.response)
                        resolve(err.response);
                    else
                        reject(err);
                });
        });
        await new Promise((resolve, reject) => {
            const { status, statusText, data } = result;
            if (status !== 200) {
                let message;
                try { message = data.read().toString() } catch (err) { message = "request error" };
                fs.rmSync(outputPath);
                return reject(new Error(`file ${url} download failed: ${statusText} -> ${message}`));
            }
            writeStream.on("error", reject);
            writeStream.on("finish", resolve);
            data.pipe(writeStream);
        });
        console.log(`file ${url} saved: ${outputPath}`);
    }

    await new Promise(resolve => {
        const coverPath = path.join(outputPath, templateName, "/cover.png");
        const demoPath = path.join(outputPath, templateName, "/demo.mp4");
        const coverFileUrl = `${fileServiceUrl}${templateBasePath}/cover.png`;
        const demoFileUrl = `${fileServiceUrl}${templateBasePath}/demo.mp4`;
        Promise.all([download(coverFileUrl, coverPath), download(demoFileUrl, demoPath)])
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });

    for (let node of timeline) {
        const { src, configSrc, dataSrc } = node;
        if (configSrc || dataSrc) {
            let filename, url;
            if (configSrc && configSrc.indexOf("/upload/") !== -1) {
                filename = path.basename(configSrc);  //获得文件名
                url = `${fileServiceUrl}${configSrc}`;
                node.update({ configSrc: `${templateOtherPath}/${filename}` });
                const filePath = path.join(otherPath, filename);
                await download(url, filePath);
            }
            if (dataSrc && dataSrc.indexOf("/upload/") !== -1) {
                filename = path.basename(dataSrc);  //获得文件名
                url = `${fileServiceUrl}${dataSrc}`;
                node.update({ dataSrc: `${templateOtherPath}/${filename}` });
                const filePath = path.join(otherPath, filename);
                await download(url, filePath);
            }
            
        }
        else if (src) {
            if (!src || (src.indexOf("/upload/") === -1 && src.indexOf("/tmplres/") === -1)) continue;
            const filename = path.basename(src);  //获得文件名
            const ext = path.extname(src).toLocaleLowerCase();  //获得文件扩展名
            const url = `${fileServiceUrl}${src}`;
            let basePath;
            switch (ext) {
                case ".mp4":
                    basePath = videoPath;
                    node.update({
                        src: `${templateVideoPath}/${filename}`
                    });
                    break;
                case ".mp3":
                    basePath = audioPath;
                    node.update({
                        src: `${templateAudioPath}/${filename}`
                    });
                    break;
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".svg":
                    basePath = imagePath;
                    node.update({
                        src: `${templateImagePath}/${filename}`
                    });
                    break;
                default:
                    basePath = otherPath;
                    node.update({
                        src: `${templateOtherPath}/${filename}`
                    });
            }
            const filePath = path.join(basePath, filename);
            await download(url, filePath);
        }
    }

    const templateFilePath = path.join(outputPath, `/${templateName}/template.xml`);
    await fs.promises.writeFile(templateFilePath, template.toXML(true));
    console.log(`template saved: ${templateFilePath}`);

})()
    .catch(err => console.error(err));