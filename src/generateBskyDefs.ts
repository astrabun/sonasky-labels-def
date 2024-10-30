import * as fs from "fs";
import YAML from 'yaml'

const DEFAULT_REALM = "prime";

export const generateBskyDefs = (realm?: string, englishOnly?: boolean) => {
    const useRealm = realm || DEFAULT_REALM;
    let onDiskDefs = YAML.parse(
        fs.readFileSync(
            `./sonasky.yaml`,
            "utf8"
        )
    )
    let labelValues = Object.keys(onDiskDefs)
        .filter(i => onDiskDefs[i].realm === useRealm)
        .filter(i => onDiskDefs[i].flags === undefined ? true : onDiskDefs[i].flags.includes("NOT_USED_AFTER_LONG_TIME") === false) // exclude items that haven't been used since creation; e.g., someone requested the label and then never used it
        .filter(i => onDiskDefs[i].flags === undefined ? true : ["REMOVAL_DUE_TO_"].every((flag) => {
            return !onDiskDefs[i].flags.some(iFlag => iFlag.includes(flag))
        })) // exclude items with specific removal flags
    ;
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

export const generateBskyDefsEnglish = (realm?: string) => {
    return generateBskyDefs(realm || DEFAULT_REALM, true)
}

generateBskyDefsEnglish()