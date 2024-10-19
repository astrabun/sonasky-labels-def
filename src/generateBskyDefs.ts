import * as fs from "fs";
import YAML from 'yaml'

export const generateBskyDefsEnglish = () => {
    let onDiskDefs = YAML.parse(
        fs.readFileSync(
            `./sonasky.yaml`,
            "utf8"
        )
    )
    let labelValues = Object.keys(onDiskDefs);
    let labelValueDefinitions = labelValues.map((id) => ({
        "blurs": "none",
        "locales": onDiskDefs[id].locales.filter((i: { lang: string; }) => i.lang == "en"),
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