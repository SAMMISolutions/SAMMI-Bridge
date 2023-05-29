const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../../extensions');
let mergedData = { extensions: [] };

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach((file) => {
        if(path.extname(file) === '.json' && file !== 'sample.json'){
            let rawData = fs.readFileSync(path.join(directoryPath, file));
            let jsonData = JSON.parse(rawData);
            mergedData.extensions = [...mergedData.extensions, ...jsonData.extensions];
        }
    });

    fs.writeFileSync(path.join(directoryPath, 'extensions.json'), JSON.stringify(mergedData, null, 4));
});
