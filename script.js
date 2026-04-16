const fs = require('fs');
const path = 'c:/Users/adarsh/OneDrive/Desktop/Adarsh project/Adarsh Project/frontend/styles/global.css';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/Playfair Display/g, 'Outfit');
content = content.replace(/DM Sans/g, 'Inter');
// also fix navbar background
content = content.replace(/rgba\(245,241,232,0.94\)/g, 'rgba(2,6,23,0.85)');
fs.writeFileSync(path, content, 'utf8');
console.log('done');
