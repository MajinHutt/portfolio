# Deployment: James's accounts, step by step

Everything here is done **by James, signed in as James**. Nobody else should
create these accounts on his behalf: the GitHub account becomes his professional
identity (recruiters look at it), and the Vercel account is tied to whoever owns
it. Doing it under a parent's account now means an awkward migration later.

An adult should be sitting with him for the sign-ups if he's under 18: GitHub
requires users to be at least 13.

> Before starting, read `docs/COST-CONTROLS.md`. The short version: **do not
> enter card details anywhere.** Every step below is free and stays free.

---

## Step 0: repo authorship (already done)

The project was scaffolded on a machine whose global Git identity belongs to
someone else, so the one commit `create-next-app` made was attributed to the
wrong person. That has been fixed: the commit was amended so the history now
contains a single commit authored by **James Hutt <jpfhutt@gmail.com>**, and
nothing anywhere in the history carries the other name.

Confirm it yourself at any time:

```bash
git log --format="%an <%ae>"
```

The repo-local identity and the safety hooks are set already. If you ever clone
this fresh, set them again:

```bash
git config user.name "James Hutt"
```

```bash
git config user.email "jpfhutt@gmail.com"
```

```bash
npm run install-hooks
```

The pre-commit hook refuses any commit without a repo-local identity, so it is
not possible to author work under the wrong name by accident.

---

## Step 1: GitHub account

Already done: James's account is **majinhutt** (`jpfhutt@gmail.com`), and
Vercel is linked to it. Two things worth confirming while you're there:

1. **Two-factor authentication is on** (Settings → Password and
   authentication). GitHub requires it, and this account will hold his
   professional work.
2. **No Copilot or Team trial is active.** Free covers everything here, and
   trials convert to paid.

Then go straight to Step 2.

## Step 2: push the site to GitHub (done)

The repo is live at **https://github.com/MajinHutt/portfolio**, under James's
account, and local is in sync with it.

The branch is called `master` (the name `create-next-app` used), not `main`.
Nothing is wrong with that and Vercel handles either, but `main` is the current
convention and this repo is something recruiters may look at. If you want to
rename it, do it **before** connecting Vercel, because afterwards the
production branch has to be changed in the Vercel dashboard too:

```bash
git branch -m master main
```

```bash
git push -u origin main
```

Then on GitHub: **Settings → General → Default branch**, switch it to `main`,
and delete the old `master` branch when it offers.

Day to day, pushing is all that is needed. Vercel rebuilds on its own:

```bash
git add -A && git commit -m "Add project: Red Velvet Chair" && git push
```

---

## Step 3: Vercel account

Already set up and linked to the `majinhutt` GitHub account: so signing in at
**vercel.com** with **Continue with GitHub** is all that's needed. The steps
below are here in case the account ever has to be recreated.

1. Go to **vercel.com/signup**.
2. Choose **Continue with GitHub** and sign in as James. This links the two
   accounts, which is what makes automatic deploys work.
3. When asked, pick the **Hobby** plan. It is free and permanent.
4. **Skip every prompt to add a payment method or start a Pro trial.** An
   account with no card on file cannot be charged: that is the main protection.
5. Vercel asks for a "scope" name; his own name is fine.

## Step 4: Import the project

1. Vercel dashboard → **Add New… → Project**.
2. It lists his GitHub repos. Find `portfolio` → **Import**.
3. Vercel detects Next.js automatically. Leave build settings alone.
4. Before clicking Deploy, open **Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_ASSET_BASE_URL` | your CDN base URL (see `docs/ASSET-HOSTING.md`) |

   Leave it blank for now if assets aren't uploaded yet: the site deploys fine
   and shows empty plates instead of broken images.

5. **Deploy.** First build takes a couple of minutes.
6. The site is then live at something like
   `https://portfolio-majinhutt.vercel.app`.

## Step 5: Turn on notifications

Vercel → **Settings → Notifications**. Enable usage and deployment emails so he
hears about approaching limits rather than discovering them.

---

## After this: how updates work

Every `git push` to `main` rebuilds and redeploys automatically. There is no
manual deploy step ever again.

```bash
git add -A && git commit -m "Add new project: Red Velvet Chair"
```

```bash
git push
```

Adding a project is a text edit to one file: see
`docs/HOW-TO-ADD-PROJECT.md`.

---

## Later: a custom domain (optional, and the one real cost)

Not needed now. `*.vercel.app` works permanently and looks fine on an
application.

If James wants `jameshutt.co.uk`:

1. Buy it from any registrar (~£8–15/year). This is a **deliberate purchase**:
   the only unavoidable cost associated with this site.
2. Consider turning **auto-renew off** so it's a yearly decision, not an
   automatic charge.
3. Vercel → Project → **Settings → Domains** → add the domain, then follow the
   DNS records it gives you at the registrar.
4. Update `site.url` in `lib/site.ts` so the SEO and Open Graph tags point at
   the right place, then push.

---

## If something breaks

- **Build failed on Vercel**: open the deployment's build log. If it says
  `COST GUARD` or `ASSET GUARD`, a guard caught something; read
  `docs/COST-CONTROLS.md`.
- **Images or models don't appear**: `NEXT_PUBLIC_ASSET_BASE_URL` is probably
  missing or wrong in Vercel's environment variables. Fix it, then
  **Redeploy** from the Deployments tab.
- **Site looks unstyled**: usually a failed build serving an old deployment.
  Check the Deployments tab for a red entry.
