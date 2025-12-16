@echo off
echo Building and deploying to GitHub Pages...

cd frontend
echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Build complete! 
echo.
echo Next steps:
echo 1. Replace YOUR_USERNAME in frontend/package.json with your GitHub username
echo 2. Push to GitHub repository
echo 3. Enable GitHub Pages in repository settings
echo 4. Set source to "GitHub Actions"
echo.
echo Your app will be available at: https://YOUR_USERNAME.github.io/school-stock-management

pause