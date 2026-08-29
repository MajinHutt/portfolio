# Email alerts

James gets an email when someone downloads the CV or clicks through to contact
him. No form for the visitor to fill in, no account for them to create, and
nothing that slows the click down.

The code is built and wired in. It is **dormant until one key is added**, and
sends no request at all until then.

---

## Turning it on

One free sign-up, no card.

1. Go to **https://web3forms.com**
2. Enter **jpfhutt@gmail.com**, the address the alerts should arrive at
3. The access key is emailed over in a few seconds. There is no account to
   create and no password to keep.

Then add it in two places.

**Vercel**, for the live site: Project → Settings → Environment Variables

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | the key from the email |

Apply it to Production, Preview and Development, save, then **Deployments →
Redeploy**. Environment variables are read at build time, so an existing
deployment will not pick it up on its own.

**`.env.local`**, for working locally:

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
```

Test it by opening the live site, passing the check on the contact page and
clicking an email link. The alert should arrive within a few seconds.

---

## What lands in his inbox

Subject line: **Portfolio: CV downloaded**

| Field | Example |
| --- | --- |
| Action | CV downloaded |
| Detail | Studio or placement enquiry |
| Page | /cv |
| Came from | https://www.linkedin.com/ |
| When | Fri Aug 29 2026 14:32:08 GMT+0100 |
| Device | desktop |
| Language | en-GB |
| Location | not collected |

**"Came from" is the field worth reading.** Arriving from LinkedIn and then
downloading the CV is a real signal. Arriving from a university domain is a
better one. The rest is mostly noise.

Four actions are tracked:

- **CV downloaded**, the download button on `/cv`
- **CV requested by email**, the fallback when no PDF is published
- **Contact details revealed**, someone passed the check on `/contact`
- **Email link clicked**, any mailto, with which one in the detail field

---

## What it cannot tell him

**It cannot tell him who.** Nothing here identifies a person, and no amount of
configuration will change that. The realistic best case is "someone who came
from LinkedIn downloaded the CV on Friday afternoon".

Location is **off by default**, and worth leaving off. Switching
`NEXT_PUBLIC_ENABLE_GEO=true` sends the visitor's IP to a third-party lookup to
get back a city, and that city is usually the ISP's routing location rather
than the person's. Behind a VPN it is fiction. It is a real privacy cost for
a low-quality clue.

---

## Honest limitations

- **The CV is a static file at a fixed URL.** A direct hit on
  `/james-hutt-cv.pdf` bypasses JavaScript entirely. This records the click,
  not the download. Close enough in practice, but the count is a floor.
- **Ad blockers will hide some of it.** A technical audience blocks more than
  average, so assume undercounting.
- **The key is public**, sitting in the JavaScript the browser downloads. That
  is how Web3Forms is designed to work, but it does mean somebody could post to
  it and fill his inbox or use up the monthly allowance. Low risk for a
  portfolio nobody is targeting. If it ever happens, request a new key and
  replace the variable: no code changes needed.
- **One alert per action per session.** Somebody clicking the CV four times is
  one person, and the free allowance is worth protecting.
- **Free tier has a monthly cap.** Well beyond what this site will see, but it
  is not unlimited.

---

## Why it does not use a server

An API route would be the conventional way to do this. It would also be a
serverless function, which is exactly what Vercel meters and what
`scripts/check-static.mjs` fails the build over. Posting straight from the
browser to Web3Forms keeps the site fully static, so hosting stays free and
un-billable. See `docs/COST-CONTROLS.md`.

---

## Turning it off

Clear `NEXT_PUBLIC_WEB3FORMS_KEY` in Vercel and redeploy. With no key the code
returns immediately and makes no network request.
