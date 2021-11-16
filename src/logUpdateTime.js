const fs = require('fs');
const path = require('path');

function writeFile(file, filecontent) {
  fs.writeFileSync(file,filecontent,'utf8');
  fs.mkdirSync(path.dirname('path/to/artifact/'+file), { recursive: true }); // put the files in the path to artifact too so this git action can deploy them because standard push watch is not being triggered
  fs.createReadStream(file).pipe(fs.createWriteStream('path/to/artifact/'+file));
}

let filename = process.argv[2];
if (filename.startsWith("./status/")) {
  let jsonData = {'PUBLISH_DATE':(new Date()).toISOString()};
  // write a new date file to make sure script runs even if there is no svg change  
  writeFile(filename, JSON.stringify(jsonData));
}
