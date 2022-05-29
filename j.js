const { elements: {Element} } = require("./");

const xml = "<text>{{123 + 5}}</text>";

const scene = Element.parse(xml);

console.log(scene.toXML());