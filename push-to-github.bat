@echo off
title Push AI Retail Checkout to ashutoshmishra60/smartcheckout-ai
echo ======================================================================
echo    Pushing AI Retail Checkout to GitHub
echo    Target: https://github.com/ashutoshmishra60/smartcheckout-ai.git
echo ======================================================================
echo.

set PATH=C:\Users\admin\AppData\Local\Programs\Git\cmd;%PATH%

git remote remove origin 2>nul
git remote add origin https://github.com/ashutoshmishra60/smartcheckout-ai.git
git branch -M main

echo Uploading commits to main branch...
echo (If prompted, please sign in via browser or enter your GitHub credentials)
echo.

git push -u origin main

echo.
echo ======================================================================
echo Finished! Check your repo: https://github.com/ashutoshmishra60/smartcheckout-ai
echo ======================================================================
pause
