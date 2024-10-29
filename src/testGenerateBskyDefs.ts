import { generateBskyDefsEnglish } from "./generateBskyDefs";
const def = generateBskyDefsEnglish();
console.log(`There are ${def.labelValues.length} labels in the definition`)
console.log(def['labelValueDefinitions'].pop())
console.log(def['labelValues'].pop())