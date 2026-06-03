// Twitter wants its own image route, but visually it's identical to the OG card.
// Re-exports the OG component so we keep one source of truth.
export { default, alt, size, contentType } from "./opengraph-image";
