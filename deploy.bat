@echo off
echo Deploying to Vercel...
cd frontend
npm run build
cd ..
vercel --prod --yes
pause