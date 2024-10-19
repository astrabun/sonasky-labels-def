import { BskyAgent } from "@atproto/api";
import { generateBskyDefsEnglish } from "./generateBskyDefs";

const defs = generateBskyDefsEnglish();

const ozone_service_user_did = process.env.OZONE_SERVICE_USER_DID as string;

const agent = new BskyAgent({
  service: "https://bsky.social",
});

BskyAgent.configure({
  appLabelers: [process.env.OZONE_SERVICE_USER_DID ?? ""],
});

async function main() {
  await agent.login({
    identifier: process.env.BSKY_USER as string,
    password: process.env.BSKY_PASS as string,
  });

  const uploadLocalizationLabels = async () => {
    await agent.refreshSession();
    let body = {
      repo: ozone_service_user_did,
      collection: "app.bsky.labeler.service",
      rkey: "self",
      record: {
        $type: "app.bsky.labeler.service",
        policies: {
          labelValues: defs.labelValues,
          labelValueDefinitions: defs.labelValueDefinitions,
        },
        createdAt: new Date().toISOString(),
      },
    };
    let response = await agent
      .withProxy("atproto_labeler", ozone_service_user_did)
      .api.com.atproto.repo.putRecord(body);
    console.log("Upload localizations successful: ", `[${response.success}]`);
  };

  uploadLocalizationLabels().then(() => {
    return "DONE"
  }).catch((err) => {
    throw Error(`${err}`);
  });
}

main().then(() => {
}).catch((err) => {
  throw Error(`${err}`);
});
