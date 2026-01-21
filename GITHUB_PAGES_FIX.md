# Fix GitHub Pages Deployment Issue

If your GitHub Pages is showing the README instead of your portfolio, follow these steps:

## Step 1: Verify GitHub Pages Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source**: Must be **"GitHub Actions"** (NOT "Deploy from a branch")
4. Save if you made changes

## Step 2: Check GitHub Actions Workflow

1. Go to **Actions** tab in your repository
2. Check if the latest workflow run completed successfully
3. If it failed, check the error logs

## Step 3: Re-run the Workflow

If the workflow completed but site isn't working:

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Click **"Re-run all jobs"**

Or manually trigger it:
1. Go to **Actions** tab
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** button (top right)
4. Select branch: **main**
5. Click **"Run workflow"**

## Step 4: Wait for Deployment

- GitHub Pages deployments can take 1-5 minutes
- Check the Actions tab to see deployment progress
- Once complete, visit your site: `https://abdallahzagh.github.io/portfolio/`

## Step 5: Clear Browser Cache

If the site still shows README:
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear browser cache

## Troubleshooting

### If workflow is failing:
- Check the error message in Actions tab
- Make sure `NODE_ENV=production` is set (it's in the workflow)
- Verify all dependencies are in package.json

### If site shows 404:
- Check that basePath in `next.config.ts` matches your repo name
- Current setting: `repoName = "portfolio"`
- If your repo is different, update this value

### If assets are broken:
- Check browser console for 404 errors
- Verify basePath and assetPrefix are set correctly
- Make sure trailingSlash: true is enabled

## Verify Build Output

The build should create an `out` folder with:
- `index.html`
- `_next/` folder with assets
- All other static files

The workflow uploads this `out` folder to GitHub Pages.
