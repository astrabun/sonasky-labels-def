import * as fs from "fs";
import YAML from 'yaml'

export const generateBskyDefs = (englishOnly?: boolean) => {
    let onDiskDefs = YAML.parse(
        fs.readFileSync(
            `./sonasky.yaml`,
            "utf8"
        )
    )
    let labelValues = Object.keys(onDiskDefs);
    let labelValueDefinitions = labelValues.map((id) => ({
        "blurs": "none",
        "locales": englishOnly === true ? onDiskDefs[id].locales.filter((i: { lang: string; }) => i.lang == "en") : onDiskDefs[id].locales,
        "severity": "inform",
        "adultOnly": false,
        "identifier": id,
        "defaultSetting": "warn"
    }))
    return {
        "labelValues": labelValues,
        "labelValueDefinitions": labelValueDefinitions
    }
}

export const generateBskyDefsEnglish = () => {
    return generateBskyDefs(true)
}

generateBskyDefsEnglish()