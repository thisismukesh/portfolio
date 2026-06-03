// External links open in a new tab; mailto/tel/in-page anchors stay in-place.
// Use: <a href={href} {...externalLinkProps(href)}>...</a>
export function externalLinkProps(href: string | undefined | null) {
  if (!href) return {};
  const isInternal = /^(mailto:|tel:|#|\/)/i.test(href);
  if (isInternal) return {};
  return { target: "_blank" as const, rel: "noopener noreferrer" };
}
