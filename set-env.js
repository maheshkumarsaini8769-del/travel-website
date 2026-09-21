const { execSync } = require('child_process');
const fs = require('fs');
const uri = fs.readFileSync('.tmp-mongo-uri.txt', 'utf8').trim();

console.log('Setting MONGODB_URI...');
execSync(`npx vercel env rm MONGODB_URI production --yes`, { stdio: 'inherit' });
execSync(`npx vercel env add MONGODB_URI production --yes --value "${uri}"`, { stdio: 'inherit' });
console.log('Done!');
