@echo off
title AI-Powered Automated Retail Checkout System - Master Launcher
echo ======================================================================
echo    AI-Powered Automated Retail Checkout System (3-Tier Architecture)
echo ======================================================================
echo.
echo Starting all 3 microservices...
echo.

echo [1/3] Starting ML Microservice (Flask + YOLOv8 + OpenCV on port 5001)...
start "Retail ML Microservice (YOLOv8)" cmd /k "cd ml-service && python app.py"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Backend API (Node.js + Express.js + MySQL on port 5000)...
start "Retail Backend REST API (Node/Express)" cmd /k "cd backend && node server.js"

timeout /t 2 /nobreak > nul

echo [3/3] Starting Frontend SPA (React.js + Vite on port 5173)...
start "Retail Frontend SPA (React)" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo  All systems launched successfully!
echo.
echo  - Frontend UI:        http://localhost:5173
echo  - Backend API:        http://localhost:5000
echo  - ML Microservice:    http://localhost:5001/health
echo ======================================================================
pause
