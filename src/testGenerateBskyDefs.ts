import { generateBskyDefsEnglish } from "./generateBskyDefs";
const def = generateBskyDefsEnglish();
console.log(def['labelValueDefinitions'].pop())
console.log(def['labelValues'].pop())