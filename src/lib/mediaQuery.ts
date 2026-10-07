export function subscribeToMediaQuery(
  media: MediaQueryList,
  listener: (event: MediaQueryListEvent) => void,
) {
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }

  const legacyListener = listener as (this: MediaQueryList, event: MediaQueryListEvent) => void;
  media.addListener(legacyListener);
  return () => media.removeListener(legacyListener);
}
