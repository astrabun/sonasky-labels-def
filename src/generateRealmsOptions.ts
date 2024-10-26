import * as fs from "fs";
import YAML from 'yaml'

export const generateRealmsOptions = () => {
    let onDiskDefs = YAML.parse(
        fs.readFileSync(
            `./sonasky.yaml`,
            "utf8"
        )
    )
    let vals = new Set(Object.keys(onDiskDefs).map(i => onDiskDefs[i].realm).filter(i => i !== undefined));
    return vals
}

const realms = generateRealmsOptions();
console.log(realms)