export function normalizeImageSrc(src: string) {
  if (!src) return src;
  const trimmed = src.trim();
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) {
    return encodeURI(trimmed);
  }
  return encodeURI(`/${trimmed}`);
}
