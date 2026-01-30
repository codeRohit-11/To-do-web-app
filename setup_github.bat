@echo off
echo ==========================================
echo      Initializing Git for Todo Web App
echo ==========================================

echo [1/5] Initializing local repository...
git init

echo [2/5] Adding files...
git add .

echo [3/5] Committing files...
:: Check if there is anything to commit, if not skip
git commit -m "Initial commit"
git branch -M main

echo.
echo ==========================================
echo [4/5] GitHub Configuration
echo ==========================================
set /p repo_url="Paste your GitHub Repository URL (e.g., https://github.com/User/repo.git): "

:: Remove origin if it exists to avoid errors on re-run
git remote remove origin 2>nul
git remote add origin %repo_url%

echo.
echo [5/5] Pushing to GitHub (Force)...
echo (We are using --force to overwrite any existing files on GitHub with your new project)
git push -u origin main --force

echo.
echo ==========================================
echo               DONE!
echo ==========================================
pause
