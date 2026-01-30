@echo off
echo ==========================================
echo      Initializing Git for Todo Web App
echo ==========================================

echo [1/5] Initializing local repository...
git init

echo [2/5] Adding files...
git add .

echo [3/5] Committing files...
git commit -m "Initial commit"
git branch -M main

echo.
echo ==========================================
echo [4/5] GitHub Configuration
echo ==========================================
set /p repo_url="Paste your GitHub Repository URL (e.g., https://github.com/User/repo.git): "

git remote add origin %repo_url%

echo.
echo [5/5] Pushing to GitHub...
echo (You may be asked to log in in a browser window)
git push -u origin main

echo.
echo ==========================================
echo               DONE!
echo ==========================================
pause
