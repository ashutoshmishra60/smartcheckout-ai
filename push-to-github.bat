@echo off
title Push AI Retail Checkout to GitHub
echo ======================================================================
echo          Push Project to GitHub Repository
echo ======================================================================
echo.
echo Make sure you have created an empty repository on GitHub first!
echo (e.g., https://github.com/your-username/ai-retail-checkout.git)
echo.
set /p REPO_URL="Enter your GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo Error: No repository URL entered!
    pause
    exit /b
)

echo.
echo Setting remote origin to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub main branch...
git push -u origin main

echo.
echo ======================================================================
echo Finished! Check your GitHub repository link.
echo ======================================================================
pause
