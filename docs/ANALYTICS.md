# Visitor analytics

Cloudflare Web Analytics: how many people visit, which pages they read, where
they arrived from, and roughly which country they are in.

It is **free and unmetered, needs no card, and sets no cookies**. That last
point matters more than it sounds: because it stores nothing on the visitor's
device, it does not require a consent banner under UK PECR. A cookie dialog
would be the worst possible first interaction for an admissions tutor opening
this link.

The code is already in place and **dormant**. With no token it renders nothing
and makes no request. This document is the one token it needs.

Total time: about five minutes.

---

## Step 1: create a Cloudflare account

Only needed once, and nothing here asks for payment details.

1. Go to **https://dash.cloudflare.com/sign-up**
2. Sign up with **jpfhutt@gmail.com**
3. Verify the email

**You do not need to move the domain to Cloudflare.** Web Analytics works on
any site through a small script, which is exactly how we are using it. If it
offers to add a domain or change nameservers, skip it: that is a different
product and you do not want it here.

---

## Step 2: add the site

1. In the Cloudflare dashboard, open **Analytics & Logs** in the left sidebar
2. Choose **Web Analytics**
3. Click **Add a site**
4. Enter the hostname, with no `https://` and no trailing slash:

   ```
   portfolio-flax-pi-n17wrr08c7.vercel.app
   ```

5. Click **Done**

Cloudflare shows a snippet of JavaScript. **You do not need the snippet**, only
the token inside it. It looks like this:

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"}'></script>
```

Copy just the token: the long string between the quotes after `"token":`.

---

## Step 3: add the token to Vercel

1. **vercel.com**, signed in as MajinHutt, open the **portfolio** project
2. **Settings**, then **Environment Variables**
3. Add:

   | Field | Value |
   | --- | --- |
   | Key | `NEXT_PUBLIC_CF_BEACON_TOKEN` |
   | Value | the token from step 2 |

   The `NEXT_PUBLIC_` prefix is required. Without it Next.js will not expose the
   value to the browser and nothing will be recorded.

4. Tick **Production**, **Preview** and **Development**, then **Save**

---

## Step 4: redeploy

**Not optional.** Environment variables are read when the site is built, so the
deployment already live knows nothing about the token you just saved.

1. **Deployments** tab
2. The topmost deployment, **⋯** menu, **Redeploy**
3. Wait for green, usually under a minute

---

## Step 5: check it

Visit the live site, then go back to **Analytics & Logs → Web Analytics** in
Cloudflare. Your own visit should appear within a minute or two.

**If nothing appears:**

- Did the redeploy finish? A saved variable with no redeploy is the usual cause.
- Is the key exactly `NEXT_PUBLIC_CF_BEACON_TOKEN`?
- Was only the token copied, without the surrounding quotes or JSON?
- Disable any ad blocker and try again. Many block analytics beacons, including
  this one.

---

## What it reports

- **Page views and visits**, and which pages
- **Referrers**: where people arrived from. The most useful field by far, since
  arriving from LinkedIn or a university domain is real information
- **Country**
- **Browser, operating system and device type**
- **Core Web Vitals**, so you can see whether the models are slowing the site
  down on real devices rather than guessing

## What it does not report

It cannot tell you **who** visited. No names, no individuals, no company
identification. It sets no cookies and does not follow anyone between sites, by
design.

For anything closer to a signal about a specific person, the email alerts in
`docs/NOTIFICATIONS.md` are the other half of the picture: they fire when
somebody actually acts, by downloading the CV or clicking through to contact.

Analytics tells you how many people came and from where. The alerts tell you
when one of them did something. Neither tells you their name, and nothing
honestly can.

---

## Turning it off

Delete `NEXT_PUBLIC_CF_BEACON_TOKEN` in Vercel and redeploy. With no token the
component renders nothing and the beacon is never requested.
