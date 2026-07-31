const fs = require('fs');

const files = [
    'js/pages/pages_ai.js',
    'js/pages/pages_system.js',
    'js/pages/pages_core.js'
];

for (const file of files) {
    try {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('\\`')) {
            content = content.replace(/\\`/g, '`');
            fs.writeFileSync(file, content, 'utf8');
            console.log('Fixed ' + file);
        } else {
            console.log('No escaped backticks found in ' + file);
        }
    } catch (e) {
        console.error('Error on ' + file + ':', e.message);
    }
}
