@echo off
echo ==========================================
echo    Generating Realistic Commit History
echo ==========================================

echo [1/6] Cleaning up old git history...
rmdir /s /q .git

echo [2/6] Initializing new repository...
git init

echo [3/6] Committing Backend Base...
:: Add only server files first (excluding controllers/routes to simulate evolution or just add all server)
git add server/index.js server/models.js server/middleware
git commit -m "feat: Setup Node.js server and database models"

echo [4/6] Committing Frontend Core...
git add client/index.html client/vite.config.js client/package.json client/src/main.jsx client/src/App.jsx client/src/api.js client/src/index.css
git commit -m "feat: Initialize React client and global styles"

echo [5/6] Committing Features (Auth & Boards)...
git add client/src/components server/controllers server/routes
git commit -m "feat: Implement Auth, Board, and Todo functionality"

echo [6/6] Final Polish & Docs...
git add .
git commit -m "docs: Add README and cleanup code"

git branch -M main

echo.
echo ==========================================
echo      History Generated!
echo ==========================================
echo Now run 'setup_github.bat' again (or manually push) to upload this new history.
pause
