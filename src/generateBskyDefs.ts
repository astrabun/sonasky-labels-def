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
    let labelValues = Object.keys(onDiskDefs).filter(i => onDiskDefs[i].realm === useRealm);
    let labelValueDefinitions = labelValues.map((id) => ({
        "blurs": "none",
        "locales": englishOnly === true ? onDiskDefs[id].locales.filter((i: { lang: string; }) => i.lang == "en") : onDiskDefs[id].locales,
        "severity": "inform",
        "adultOnly": false,
        "identifier": id,
        "defaultSetting": "warn"
    }))
    fs.writeFileSync(
        `/home/user/sonatools/scripts/newdefstmp.json`,
        JSON.stringify({
            "labelValues": labelValues,
            "labelValueDefinitions": labelValueDefinitions
        })
    );
    return {
        "labelValues": labelValues,
        "labelValueDefinitions": labelValueDefinitions
    }
}

export const generateBskyDefsEnglish = (realm?: string) => {
    return generateBskyDefs(realm || DEFAULT_REALM, true)
}

generateBskyDefsEnglish()