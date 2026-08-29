# Email alerts: full setup

James gets an email when someone downloads his CV or clicks through to contact
him. The visitor fills in nothing and creates no account, and the click is not
slowed down.

**The code is already built and wired in.** It is dormant, and sends no request
at all, until one key is added. This document is that one key, step by step.

Total time: about five minutes. Cost: nothing, and there is no card involved at
any point.

---

## Step 1: get the access key

1. Open **https://web3forms.com**
2. On the front page there is a single box labelled something like *"Enter your
   email address"*. Type **jpfhutt@gmail.com**. This is the address the alerts
   will be delivered to, so it must be the inbox James actually reads.
3. Click **Create Access Key**.
4. Check that inbox. An email arrives within about a minute containing a long
   string that looks like this:

   ```
   c1a2b3d4-5e6f-7890-abcd-ef1234567890
   ```

   That is the access key. Copy it.

**There is no account, no password and no dashboard.** The key in that email is
the whole thing. Keep the email, or paste the key somewhere safe, because
retrieving it later means generating a new one.

**If the email does not arrive:** check spam, and confirm the address was typed
correctly. Web3Forms will not send alerts to an address that was never verified
this way.

---

## Step 2: add the key to Vercel

This is what switches it on for the live site.

1. Go to **vercel.com** and sign in as **MajinHutt**.
2. Open the **portfolio** project.
3. Click **Settings** in the top navigation.
4. Click **Environment Variables** in the left sidebar.
5. Add a new variable:

   | Field | What to enter |
   | --- | --- |
   | Key | `NEXT_PUBLIC_WEB3FORMS_KEY` |
   | Value | the key from the email |

   The name must be exactly right, including the `NEXT_PUBLIC_` prefix. Without
   that prefix Next.js will not expose it to the browser and nothing will work.

6. Make sure **all three environments** are ticked: Production, Preview and
   Development.
7. Click **Save**.

---

## Step 3: redeploy

**This step is not optional, and it is the one people miss.** Environment
variables are read when the site is built, not when it is visited, so the
deployment that is already live knows nothing about the key you just added.

1. Still in the project, click **Deployments** in the top navigation.
2. Find the deployment at the top of the list, the most recent one.
3. Click the **⋯** menu on its right-hand side.
4. Choose **Redeploy**.
5. Leave "Use existing Build Cache" as it is and confirm.
6. Wait for the status to go green. It usually takes under a minute.

---

## Step 4: test it

1. Open the live site and go to **Contact**.
2. Answer the quick check question.
3. Click any of the email links.
4. Check **jpfhutt@gmail.com**. An email with the subject
   **"Portfolio: Email link clicked"** should arrive within a few seconds.

**Check the spam folder on the first one.** It is a new sender, so the first
alert often lands there. Mark it as "not spam" and later ones will go to the
inbox.

**If nothing arrives**, work through these in order:

- Did the redeploy actually finish? A saved variable with no redeploy is the
  most common cause by far.
- Is the variable name exactly `NEXT_PUBLIC_WEB3FORMS_KEY`?
- Was the key copied whole, with no trailing space?
- Try a different browser, or turn off any ad blocker. Some blockers stop the
  request, which is a known and accepted limitation.
- One alert is sent per action per session. If you already clicked that same
  link in the same browser tab session, a second click sends nothing. Open a
  fresh tab to test again.

---

## Optional: also set it locally

Only needed if you want alerts while running the site on your own machine.
Most of the time you do not, and leaving it out keeps local testing silent.

In `.env.local` in the website folder:

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key-here
```

---

## What the emails contain

Subject: **Portfolio: CV downloaded**

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

**"Came from" is the field worth reading.** Somebody arriving from LinkedIn and
then downloading the CV is a real signal. Arriving from a university domain is
a better one. The rest is mostly noise.

Four actions are tracked:

- **CV downloaded**, the download button on `/cv`
- **CV requested by email**, the fallback shown when no PDF is published
- **Contact details revealed**, somebody passed the check on `/contact`
- **Email link clicked**, any mailto, with which one in the detail field

---

## What it cannot tell him

**It cannot tell him who.** Nothing here identifies a person and no setting will
change that. The realistic best case is "someone who came from LinkedIn
downloaded the CV on Friday afternoon".

Location is **off by default** and worth leaving off. Setting
`NEXT_PUBLIC_ENABLE_GEO=true` sends the visitor's IP to a third-party lookup to
get back a city, and that city is usually the ISP's routing location rather
than the person's. Behind a VPN it is fiction. A real privacy cost for a
low-quality clue.

---

## Honest limitations

- **The CV is a static file at a fixed URL.** A direct hit on
  `/james-hutt-cv.pdf` bypasses JavaScript entirely, so this records the click,
  not the download. Close enough in practice, but treat the count as a floor.
- **Ad blockers hide some of it.** A technical audience blocks more than
  average.
- **The key is public**, sitting in the JavaScript the browser downloads. That
  is how Web3Forms is designed, but it does mean somebody could post to it and
  fill the inbox or use up the monthly allowance. Low risk for a portfolio
  nobody is targeting. If it happens, generate a new key at web3forms.com and
  replace the variable. No code changes needed.
- **One alert per action per session**, so four clicks from one person is one
  email.
- **The free tier has a monthly cap**, well beyond anything this site will see,
  but it is not unlimited.

---

## Why there is no server involved

An API route would be the conventional way to do this, and it would also be a
serverless function: exactly what Vercel meters, and what
`scripts/check-static.mjs` fails the build over. Posting straight from the
browser to Web3Forms keeps the site fully static, so hosting stays free and
un-billable. See `docs/COST-CONTROLS.md`.

---

## Turning it off

Delete `NEXT_PUBLIC_WEB3FORMS_KEY` in Vercel and redeploy. With no key the code
returns immediately and makes no network request whatsoever.
