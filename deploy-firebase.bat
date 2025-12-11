@echo off
echo Deploying School Stock Management System to Firebase...

echo.
echo Step 1: Building React application...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Firebase...
cd ..
call firebase deploy
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ Deployment completed successfully!
echo Your app is now live at: https://school-management-63b8b-ce184.web.app
echo.
pause