import { BskyAgent } from "@atproto/api";
import { generateBskyDefsEnglish } from "./generateBskyDefs";
import { generateRealmsOptions } from "./generateRealmsOptions";

async function main() {
  const realms = generateRealmsOptions();
  let success = true;
  let failureError;

  for (const realm of realms) {
    const defs = generateBskyDefsEnglish(realm);
    const ozone_service_user_did = process.env[
      `${realm.toUpperCase()}_OZONE_SERVICE_USER_DID`
    ] as string;

    const agent = new BskyAgent({
      service: "https://bsky.social",
    });

    BskyAgent.configure({
      appLabelers: [
        process.env[`${realm.toUpperCase()}_OZONE_SERVICE_USER_DID`] ?? "",
      ],
    });

    try {
      await agent.login({
        identifier: (
          process.env[`${realm.toUpperCase()}_BSKY_USER`] as string
        ).toString(),
        password: (
          process.env[`${realm.toUpperCase()}_BSKY_PASS`] as string
        ).toString(),
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
        console.log(
          `[${realm.toUpperCase()}] Upload localizations successful: `,
          `[${response.success}]`
        );
      };

      // Await the uploadLocalizationLabels function to properly handle errors
      await uploadLocalizationLabels();

    } catch (err) {
      success = false;
      console.error(`Error processing realm ${realm}:`, err);
      // Store the error, but don't break the loop
      failureError = err;
    }
  }

  // After looping through all realms, if any failed, throw the failureError
  if (!success) {
    throw failureError;
  }
}

main()
  .then(() => {
    console.log("All realms processed successfully.");
  })
  .catch((err) => {
    console.error("An error occurred during processing:", err);
  });
