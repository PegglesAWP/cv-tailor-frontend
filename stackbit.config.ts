// stackbit.config.ts
import { defineStackbitConfig } from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0", // Specify the required Stackbit version
  modelExtensions: [
    // Extend the "Page" and "Post" models by defining them as page models
    { name: "Page", type: "page" },
    { name: "Post", type: "page" }
  ]
});