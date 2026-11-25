# Zero-Cost (RM0) Static Deployment Evaluation & Readiness Guide

MiniChain's official website (`website/`) compiles into a 100% static HTML/CSS/JS bundle (`website/out/`) via `next build` (`output: "export"`), requiring **RM0** in hosting, database, or server costs.

## 1. Free Hosting Platform Evaluation (Budget: RM0 / No Credit Card)

| Criteria | **GitHub Pages** (Recommended Primary) | **Cloudflare Pages** (Recommended Mirror) | **Vercel Hobby** (Alternative) |
| :--- | :--- | :--- | :--- |
| **Total Cost** | **RM0** | **RM0** | **RM0** |
| **Payment Card Required?** | **No** (Standard free GitHub account) | **No** (Static Pages tier needs no card) | **No** (Hobby tier needs no card) |
| **Free Subdomain** | `<username>.github.io/<repo>/` | `<project>.pages.dev` | `<project>.vercel.app` |
| **ToS & Crypto Policy Fit** | **Permitted:** Open-source code + non-commercial technical docs + read-only testnet RPC (no mining, no token sale, no phishing). | **Permitted:** Static HTML/JS asset delivery with unlimited free static bandwidth; non-abusive educational project. | **Permitted (Non-Commercial Only):** Hobby plan strictly forbids commercial/for-profit activity; open-source research projects are eligible. |
| **Bandwidth / Build Limits** | 100 GB/mo soft limit · 2,000 Actions mins/mo | **Unlimited** static asset bandwidth · 500 builds/mo | 100 GB/mo fast data transfer |
| **Pre-Configured in Repo?** | Yes (`.github/workflows/deploy-github-pages.yml` + `.nojekyll`) | Yes (`website/out` + `website/public/_headers`) | Yes (`website/vercel.json`) |

### Terms of Service & Account Eligibility Notes
1. **Zero Crypto-Mining / Zero Financial Solicitation:** All three providers prohibit server-side cryptocurrency mining, deceptive financial promotions, or wallet-drainer scripts. MiniChain's website is a purely static client-side bundle with **zero wallet connection code** and **zero server compute**, fully complying with Acceptable Use Policies.
2. **Account Age / Youth Eligibility:** GitHub allows accounts for developers aged 13+ worldwide without a credit card; Cloudflare and Vercel accounts typically require standard ToS age eligibility (18+ or guardian-managed account depending on jurisdiction). Therefore, **GitHub Pages** is the most frictionless primary target since the source code already lives on GitHub.

---

## 2. Option A: Deploy to GitHub Pages (RM0, Automated via GitHub Actions)

1. Create a public GitHub repository named `minichain` (no payment method needed).
2. Push this sanitized repository:
   ```bash
   git remote add origin https://github.com/Oepjdihc2008/minichain.git
   git branch -M main
   git push -u origin main
   ```
3. In GitHub → **Settings** → **Pages** → **Build and deployment**, set **Source** to **GitHub Actions**.
4. `.github/workflows/deploy-github-pages.yml` automatically sets `NEXT_PUBLIC_BASE_PATH=/<repo-name>` (or `""` for `<username>.github.io`), builds `website/out`, and publishes to `https://oepjdihc2008.github.io/minichain/`.

---

## 3. Option B: Deploy to Cloudflare Pages (RM0, Root Subdomain `*.pages.dev`)

1. Sign in to Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** (or **Direct Upload** of `website/out`).
2. Build settings:
   - **Root directory:** `website`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Environment variable:** `NODE_VERSION = 22`

---

## 4. Option C: Deploy to Vercel Hobby (RM0, `*.vercel.app`)

1. Import the GitHub repository in Vercel (Hobby — Personal / Non-Commercial).
2. Set **Root Directory** to `website`. Framework preset **Next.js** automatically detects `output: "export"` and serves on `https://minichain.vercel.app` (or assigned free `.vercel.app` subdomain).
