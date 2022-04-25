# Video Template
Template model describing video structure

## Installing

```bash
$ npm install video-template
```

## Example

### parse template

```javascript
const Template = require("video-template").Template;
const template = Template.parse("...XML Content...");
template.toXML(true);  //export pretty XML
```

### build template

```javascript
const { Template, Scene, elements: { Text } } = require("video-template");
const template = new Template({ width: 1920, height: 1080, aspectRatio: "16:9" });
const scene = new Scene({ width: 1920, height: 1080, duration: 5000 });
const text = new Text({ value: "Hello World" });
scene.appendChild(text);
template.appendChild(scene);
template.toXML(true);  //export pretty XML
JSON.stringify(template);  //export JSON
```

### compile template

Add the compile attribute to the template tag.
```xml
<template ... compile>
```
```javascript
const Template = require("video-template").Template;
const template = Template.parse("...Raw XML Content...");
template.toXML(true);  //export compiled pretty XML
```
raw xml:
```xml
<?xml version="1.0"?>
<data>
    <base>/files/</base>
    <name>Test Video</name>
    <mode>scene</mode>
    <width>1080</width>
    <height>1920</height>
    <aspectRatio>9:16</aspectRatio>
    <fps>60</fps>
    <date>2022-03-02</date>
    <text>Hello World</text>
</data>
<vars>

</vars>
<template name="{{name}}" mode="{{mode}}" poster="{{base}}cover.png" width="{{width}}" height="{{height}}" aspectRatio="{{aspectRatio}}" fps="{{fps}}" compile>
    <audio src="{{base}}audios/bgm.mp3" volume="0.2" loop="true"/>
    <scene width="{{width}}" height="{{height}}" duration="5000" transition-type="wipeLeft" transition-duration="300" for="{{2}}">
        <video x="0" y="0" width="{{width}}" height="{{height}}" src="{{base}}videos/pt.mp4" volume="1" loop="false" muted="false"/>
        <image x="270" y="220" width="70" height="60" zIndex="2" src="{{base}}images/left_jt.png"/>
        <image x="740" y="220" width="70" height="60" zIndex="2" src="{{base}}images/left_jt.png"/>
        <text x="393" y="200" width="295" height="80" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="80" fontWeight="400" fontColor="#000000">Test</text>
        <text x="0" y="1640" width="1080" height="32" textAlign="center" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="32" fontWeight="400" fontColor="#FFFFFF">{{date}}</text>
        <voice startTime="500" volume="100" loop="false" playbackRate="1" muted="false" provider="microsoft" text="{{text}}" declaimer="xiaoxiao" speechRate="0"/>
    </scene>
</template>
```
compiled xml:
```xml
<?xml version="1.0"?>
<template version="2.0.0" id="1bb0da20b6df11ecb40a272b48f69d94" name="Test Video" mode="scene" poster="/files/cover.png" width="1080" height="1920" aspectRatio="9:16" fps="60" duration="10000" volume="1" createTime="1649382990" updateTime="1649382990" buildBy="system">
  <audio id="1u4EA6WQNpbLUbuJ" src="/files/audios/bgm.mp3" volume="0.2" loop="true" muted="false"/>
  <scene id="1U4ea6OYPg24XOFQ" width="1080" height="1920" duration="5000" transition-type="wipeLeft" transition-duration="300">
    <video id="1U4Ea65wvvMlLooU" x="0" y="0" width="1080" height="1920" src="/files/videos/pt.mp4" volume="1" loop="false" muted="false"/>
    <image id="1U4Ea6lbmxlbtWi8" x="270" y="220" width="70" height="60" zIndex="2" src="/files/images/left_jt.png" mode="scaleToFill"/>
    <image id="1u4EA6pcZTp317rE" x="740" y="220" width="70" height="60" zIndex="2" src="/files/images/left_jt.png" mode="scaleToFill"/>
    <text id="1u4eA6zA6iISnMjX" x="393" y="200" width="295" height="80" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" enterEffect-easing="0" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="80" fontWeight="400" fontColor="#000000" lineHeight="1" wordSpacing="0" lineWrap="false">Test</text>
    <text id="1U4eA62BmlWhk4nT" x="0" y="1640" width="1080" height="32" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" enterEffect-easing="0" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="32" fontWeight="400" fontColor="#FFFFFF" lineHeight="1" wordSpacing="0" textAlign="center" lineWrap="false">2022-03-02</text>
    <voice id="1U4EA6ylkOofmQQF" startTime="500" volume="100" loop="false" playbackRate="1" muted="false" provider="microsoft" text="Hello World" declaimer="xiaoxiao" speechRate="0"/>
  </scene>
  <scene id="1u4eA64X3zD0D33P" width="1080" height="1920" duration="5000" transition-type="wipeLeft" transition-duration="300">
    <video id="1u4eA6GChkjJYXuL" x="0" y="0" width="1080" height="1920" src="/files/videos/pt.mp4" volume="1" loop="false" muted="false"/>
    <image id="1u4eA6PgFzKBvjut" x="270" y="220" width="70" height="60" zIndex="2" src="/files/images/left_jt.png" mode="scaleToFill"/>
    <image id="1U4eA66yCPZbzgDO" x="740" y="220" width="70" height="60" zIndex="2" src="/files/images/left_jt.png" mode="scaleToFill"/>
    <text id="1U4eA6GO1B7v8kXb" x="393" y="200" width="295" height="80" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" enterEffect-easing="0" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="80" fontWeight="400" fontColor="#000000" lineHeight="1" wordSpacing="0" lineWrap="false">Test</text>
    <text id="1U4Ea6SqCMZXUZS1" x="0" y="1640" width="1080" height="32" zIndex="2" enterEffect-type="fadeInUp" enterEffect-duration="500" enterEffect-easing="0" startTime="500" fontFamily="HarmonyOS_Sans_SC_Regular" fontSize="32" fontWeight="400" fontColor="#FFFFFF" lineHeight="1" wordSpacing="0" textAlign="center" lineWrap="false">2022-03-02</text>
    <voice id="1u4ea6waczrOHFIJ" startTime="500" volume="100" loop="false" playbackRate="1" muted="false" provider="microsoft" text="Hello World" declaimer="xiaoxiao" speechRate="0"/>
  </scene>
</template>
```