"use client";

/**
 * Fire-and-forget email alerts when someone acts on the CV or the contact
 * details.
 *
 * HOW IT WORKS WITHOUT A SERVER
 * Posting straight to Web3Forms from the browser, which relays the payload to
 * James's inbox. No API route, so the site stays 100% static and cannot
 * generate Vercel function charges. See docs/COST-CONTROLS.md.
 *
 * WHAT IT CAN AND CANNOT TELL HIM
 * It can say what was clicked, when, which page it happened on, and where the
 * visitor arrived from. The referrer is the useful part: "arrived from
 * LinkedIn, then downloaded the CV" is a real signal.
 *
 * It cannot say who. Nothing here identifies a person, and nothing should be
 * read as if it does.
 *
 * DELIBERATE CHOICES
 * - Never blocks or delays the click. sendBeacon where available, otherwise
 *   fetch with keepalive, so the request survives the page unloading into a
 *   mailto: or a PDF.
 * - Silent on failure. A blocked request must never surface an error to a
 *   visitor, who did nothing wrong and cannot fix it.
 * - One alert per action per session. Somebody clicking the CV four times is
 *   one person, and the free tier has a monthly cap worth protecting.
 * - Does nothing at all when the key is unset, so local development and
 *   previews stay silent.
 */

const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

/**
 * Coarse location lookup, off unless explicitly switched on.
 *
 * Default off on purpose: it sends the visitor's IP to a third party to get a
 * city back, and a city is rarely worth that. It is usually the ISP's routing
 * location rather than the person's, and a VPN makes it fiction. Set
 * NEXT_PUBLIC_ENABLE_GEO=true only if the trade is worth it to you.
 */
const GEO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GEO === "true";

export type NotifyAction =
  | "CV downloaded"
  | "CV requested by email"
  | "Contact details revealed"
  | "Email link clicked";

function alreadySent(action: string): boolean {
  try {
    const key = `jh-alert-${action}`;
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
    return false;
  } catch {
    // Blocked storage: better to send a duplicate than to send nothing.
    return false;
  }
}

async function coarseLocation(): Promise<string> {
  if (!GEO_ENABLED) return "not collected";
  try {
    const res = await fetch("https://ipwho.is/?fields=city,region,country,connection", {
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return "unavailable";
    const d = await res.json();
    const place = [d?.city, d?.region, d?.country].filter(Boolean).join(", ");
    const isp = d?.connection?.isp ? ` (${d.connection.isp})` : "";
    return place ? `${place}${isp}` : "unavailable";
  } catch {
    return "unavailable";
  }
}

function send(payload: Record<string, string>) {
  const body = JSON.stringify({ access_key: KEY, ...payload });

  // sendBeacon survives the page unloading, which a mailto: or a PDF will do.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("https://api.web3forms.com/submit", blob)) return;
    }
  } catch {
    /* fall through to fetch */
  }

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* silent by design */
  });
}

export function notify(action: NotifyAction, detail = "") {
  if (!KEY) return;
  if (typeof window === "undefined") return;
  if (alreadySent(action)) return;

  const base: Record<string, string> = {
    subject: `Portfolio: ${action}`,
    from_name: "James Hutt portfolio",
    action,
    detail: detail || "none",
    page: window.location.pathname,
    came_from: document.referrer || "direct or unknown",
    when: new Date().toString(),
    device: window.matchMedia("(pointer: coarse)").matches ? "touch" : "desktop",
    language: navigator.language || "unknown",
  };

  if (!GEO_ENABLED) {
    send({ ...base, location: "not collected" });
    return;
  }

  // Resolve location if it is quick, but never hold the alert up for it.
  coarseLocation()
    .then((location) => send({ ...base, location }))
    .catch(() => send({ ...base, location: "unavailable" }));
}
