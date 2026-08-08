// Shared source of truth for the toggleable navbar links.
// Used by the Nav (to hide links), the /admin panel (to toggle them),
// the route guard (to redirect disabled routes), and the config API.

export type NavKey = "gallery" | "places" | "about";

export type NavConfig = Record<NavKey, boolean>;

// Home ("/") is intentionally omitted — it can never be turned off.
export const TOGGLEABLE_LINKS: { key: NavKey; href: string; label: string }[] = [
  { key: "gallery", href: "/gallery", label: "gallery" },
  { key: "places", href: "/places", label: "places" },
  { key: "about", href: "/about", label: "about" },
];

export const DEFAULT_NAV_CONFIG: NavConfig = {
  gallery: true,
  places: true,
  about: true,
};

// Map a route href ("/gallery") to its config key ("gallery").
export const hrefToKey = (href: string): NavKey | null => {
  const key = href.replace(/^\//, "");
  return key in DEFAULT_NAV_CONFIG ? (key as NavKey) : null;
};

// Merge a partial/unknown-shaped object onto the defaults so the rest of the
// app always receives a complete, well-typed config.
export const normalizeConfig = (raw: unknown): NavConfig => {
  const merged: NavConfig = { ...DEFAULT_NAV_CONFIG };
  if (raw && typeof raw === "object") {
    for (const key of Object.keys(DEFAULT_NAV_CONFIG) as NavKey[]) {
      const value = (raw as Record<string, unknown>)[key];
      if (typeof value === "boolean") merged[key] = value;
    }
  }
  return merged;
};
