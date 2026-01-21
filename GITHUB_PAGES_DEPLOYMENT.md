# Deploy to GitHub Pages - Complete Guide

This guide will help you deploy your Next.js portfolio to GitHub Pages.

## Prerequisites

1. A GitHub repository (existing or new)
2. GitHub Actions enabled (enabled by default)
3. GitHub Pages enabled in repository settings

## Step 1: Configure Your Repository Name

**Important**: Update `next.config.ts` with your actual repository name.

If your repository is named `portfolio`, the base path is `/portfolio`.
If your repository is `username.github.io`, set basePath to empty string `""`.

Currently configured for repository name: **`portfolio`**

To change it, edit `next.config.ts`:
```typescript
basePath: process.env.NODE_ENV === "production" ? "/YOUR_REPO_NAME" : "",
assetPrefix: process.env.NODE_ENV === "production" ? "/YOUR_REPO_NAME" : "",
```

## Step 2: Push Your Code to GitHub

```bash
cd C:\vs_code\portfolio-next-v1

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio ready for GitHub Pages"

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git branch -M main
git push -u origin main --force
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

## Step 4: Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your Next.js app
- Export it as static files
- Deploy to GitHub Pages

**First deployment**: After pushing, go to **Actions** tab in your repo to see the deployment progress.

## Step 5: Access Your Site

Your portfolio will be available at:
- `https://YOUR_USERNAME.github.io/portfolio/` (if repo name is "portfolio")
- `https://YOUR_USERNAME.github.io/` (if repo name is "username.github.io")

## Important Configuration Notes

### Repository Name is "portfolio"
Current configuration works as-is. Your site will be at:
`https://abdallahzagh.github.io/portfolio/`

### Repository Name is "username.github.io" (Root Domain)
Edit `next.config.ts`:
```typescript
basePath: "",
assetPrefix: "",
```

### Different Repository Name
Edit `next.config.ts`:
```typescript
basePath: process.env.NODE_ENV === "production" ? "/your-repo-name" : "",
assetPrefix: process.env.NODE_ENV === "production" ? "/your-repo-name" : "",
```

## Environment Variables

For EmailJS (contact form), you have two options:

### Option 1: Use Environment Variables in GitHub Actions
Add to `.github/workflows/deploy.yml`:
```yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: ${{ secrets.EMAILJS_PUBLIC_KEY }}
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: ${{ secrets.EMAILJS_SERVICE_ID }}
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: ${{ secrets.EMAILJS_TEMPLATE_ID }}
```

Then add secrets in GitHub: Settings → Secrets and variables → Actions

### Option 2: Hardcode in Contact Form (Not Recommended)
Update `contact-form.tsx` directly (less secure).

## Troubleshooting

### 404 Errors or Broken Assets
- Check that `basePath` and `assetPrefix` match your repository name
- Make sure `trailingSlash: true` is set in `next.config.ts`
- Clear browser cache

### Build Fails in GitHub Actions
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Make sure Node.js version is compatible (20.x)

### Links Not Working
- All internal links should work automatically
- External links (GitHub, LinkedIn) should work as-is
- Make sure href attributes use full URLs for external links

### Theme Not Working
- Next-themes works with static export
- Ensure `suppressHydrationWarning` is on `<html>` tag

### Images Not Loading
- Images in `/public` folder work automatically
- Make sure image paths are correct
- Check browser console for 404 errors

## Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build static export
npm run build

# The output will be in ./out directory
# Push the 'out' folder contents to gh-pages branch
```

## Update Deployment

Every time you push to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site. Just wait a few minutes for the deployment to complete.

## Check Deployment Status

1. Go to your repository → **Actions** tab
2. Click on the latest workflow run
3. Check if all steps completed successfully
4. Visit your GitHub Pages URL to verify

---

**Your portfolio will be live at**: `https://abdallahzagh.github.io/portfolio/` (or your configured URL)
