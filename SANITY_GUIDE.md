# Sanity CMS Guide for Your Portfolio

This guide explains how to activate, access, and use the Content Management System (CMS) integrated into your portfolio.

## 1. Activation & Setup

Your portfolio connects to Sanity.io. To "activate" it, you need to ensure your environment variables are set.

### A. Environment Variables
Check your `.env.local` file in the root directory. It must contain:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="508uqyvi"
NEXT_PUBLIC_SANITY_DATASET="production"
```

*Note: These values are public and safe to commit for a frontend-only build, but usually `.env.local` is gitignored.*

### B. Deployment Setup (Vercel)
When you deploy to Vercel, you **MUST** add these same variables in the Vercel Dashboard:
1.  Go to **Settings > Environment Variables**.
2.  Add `NEXT_PUBLIC_SANITY_PROJECT_ID` with value `508uqyvi`.
3.  Add `NEXT_PUBLIC_SANITY_DATASET` with value `production`.
4.  Redeploy.

---

## 2. Opening the Studio

You do not need to install a separate app. The studio is embedded in your Next.js website.

1.  **Run the development server**:
    ```bash
    npm run dev
    ```
2.  **Access the URL**:
    Open [http://localhost:3000/studio](http://localhost:3000/studio) in your browser.

3.  **Login**:
    Log in with the GitHub, Google, or Email account you used to create the Sanity project.

---

## 3. Managing Content

Once logged in, you will see the "Desk" with your content types.

### **Profile & Identity**
*This is currently hardcoded in `page.tsx` for SEO reasons, but can be moved to CMS later if needed.*

### **Stack (Skills & Tech)**
1.  Go to **Tools / Skills**.
2.  Create a new `Tool`.
3.  **Name**: Name of the technology (e.g., "Tailwind CSS").
4.  **Category**:
    *   `Currently Working With`: Shows in the top row (colored badges).
    *   `Exploring`: Shows in the bottom row (lighter badges).
5.  **Icon**: Upload a generic SVG or PNG.

### **Projects (Case Studies)**
1.  Go to **Projects**.
2.  Create a new `Project`.
3.  **Title**: The display title.
4.  **Slug**: Click "Generate" to create a URL-friendly ID.
5.  **Tech Stack**: Select tools you added in the previous step.
6.  **Content**: Use the rich text editor to write your case study.

### **Experience (Timeline)**
The homepage timeline is powered by the **Experience** schema.
1.  **Title**: Use precisely `"work"` or `"education"` to group them correctly in the UI tabs.
2.  Input your roles, dates, and descriptions.

---

## 4. Troubleshooting

**"You are not authorized to access this project"**
*   Ensure you are logged in with the correct account.
*   Ask the project owner (yourself) to add members at [sanity.io/manage](https://www.sanity.io/manage).

**"Changes are not showing up"**
*   Sanity is "real-time", but Next.js caches pages for performance.
*   In development (`npm run dev`), refresh the page.
*   In production, you may need to wait 60s (ISR revalidation) or redeploy.
