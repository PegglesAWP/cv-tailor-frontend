// stackbit.config.ts
import { defineStackbitConfig } from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  contentSources: [
    // ...
  ],
  modelExtensions: [{ name: "page", type: "page", urlPath: "/{slug}" }]
});
