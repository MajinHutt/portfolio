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

## Step 0: Fix the repo's authorship first

The project was scaffolded on a machine whose global Git identity belongs to
someone else, so the one existing commit is attributed to the wrong person.
Clear it out and let James make the first commit himself.

In a terminal, from the `james-hutt-portfolio` folder:

```bash
rm -rf .git && git init -b main
```

Then set **his** identity, for this repo only:

```bash
git config user.name "James Hutt"
```

```bash
git config user.email "jpfhutt@gmail.com"
```

Turn on the safety hooks:

```bash
npm run install-hooks
```

Then make the first commit:

```bash
git add -A && git commit -m "Initial commit: portfolio site"
```

If the commit is refused, read the message: that's the identity or cost guard
doing its job.

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

## Step 2: Push the site to GitHub

1. On GitHub: **+ → New repository**.
   - Name: `portfolio` (or `jameshutt.co.uk`)
   - **Public**: recruiters and admissions tutors can look, which is a plus.
   - Do **not** tick "Add a README": the repo already has files.
2. GitHub then shows a "push an existing repository" snippet. It'll look like
   this, with his username:

```bash
git remote add origin https://github.com/majinhutt/portfolio.git
```

```bash
git push -u origin main
```

3. First push will ask him to sign in: a browser window, or a Personal Access
   Token. Follow the prompts; there's nothing to pay for.

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
