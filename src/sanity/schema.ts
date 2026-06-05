import { type SchemaTypeDefinition, defineField, defineType } from "sanity";

const linkField = defineField({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "URL", type: "url" }),
  ],
  options: { collapsible: true, collapsed: false },
});

const orderField = defineField({
  name: "order",
  title: "Order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 0,
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "links",
      title: "Nav links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "url" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name" } },
});

const currentDoc = defineType({
  name: "current",
  title: "Current (intro)",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }] }],
    }),
    defineField({ name: "availability", title: "Availability line", type: "string" }),
    defineField({ name: "showAvailability", title: "Show availability badge", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "availability" }, prepare: (s) => ({ title: s.title || "Current" }) },
});

const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    orderField,
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "org", title: "Organization", type: "string" }),
    defineField({ name: "dates", title: "Dates", type: "string" }),
    defineField({ name: "blurb", title: "Blurb", type: "text", rows: 2 }),
    linkField,
  ],
  preview: { select: { title: "role", subtitle: "org" } },
});

const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    orderField,
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "blurb", title: "Blurb", type: "text", rows: 2 }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    linkField,
  ],
  preview: { select: { title: "name", subtitle: "blurb" } },
});

const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    orderField,
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "date", title: "Date", type: "string" }),
    defineField({ name: "blurb", title: "Blurb", type: "text", rows: 2 }),
    linkField,
  ],
  preview: { select: { title: "name", subtitle: "date" } },
});

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  currentDoc,
  experience,
  project,
  event,
];
