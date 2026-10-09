export function resolveSiteUrl(value: string | undefined): string {
  try {
    const url = new URL(value || "https://nachikethreddyy.vercel.app");
    return /^https?:$/.test(url.protocol)
      ? url.origin
      : "https://nachikethreddyy.vercel.app";
  } catch {
    return "https://nachikethreddyy.vercel.app";
  }
}
