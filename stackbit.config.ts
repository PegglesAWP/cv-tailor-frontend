// stackbit.config.ts
import { defineStackbitConfig } from "@stackbit/types";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0", // Specify the required Stackbit version
  contentModels: [
    {
      name: "Page",
      type: "page",
      filePathPattern: "content/pages/{slug}.md", // Define where the content files are stored
      fields: [
        { name: "title", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "layout", type: "string", required: true, default: "default" }, // Add layout field
        { name: "content", type: "markdown" }
      ]
    },
    {
      name: "Post",
      type: "page",
      filePathPattern: "content/posts/{slug}.md", // Define where the content files are stored
      fields: [
        { name: "title", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "date", type: "datetime", required: true },
        { name: "author", type: "string" },
        { name: "layout", type: "string", required: true, default: "post" }, // Add layout field
        { name: "content", type: "markdown" }
      ]
    }
  ],
  site: {
    name: "CV Tailor",
    language: "en",
    favicon: "/static/favicon.ico"
  }
});