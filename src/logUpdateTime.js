const fs = require('fs');
const path = require('path');

function writeFile(file, filecontent) {
  fs.writeFileSync(file,filecontent,'utf8');
  fs.mkdirSync(path.dirname('path/to/artifact/'+file), { recursive: true }); // put the files in the path to artifact too so this git action can deploy them because standard push watch is not being triggered
  fs.createReadStream(file).pipe(fs.createWriteStream('path/to/artifact/'+file));
}

let filename = process.argv[2];
if (filename.startsWith("./status/")) {
  let pubDate = new Date();

  // add 15 minutes to account for normal publishing delay
  let addMS = 15 * 60 * 1000;
  pubDate = new Date(pubDate.getTime() + addMS);

  let roundedDate = pubDate;
  // set seconds/milliseconds to zero for prettiness
  let trimMS = roundedDate.getMilliseconds() + roundedDate.getSeconds()*1000;
  roundedDate = new Date(roundedDate.getTime() - trimMS);

  // round to next half hour for prettiness
  let minutes = roundedDate.getMinutes();
  if (minutes % 30 != 0) {
    let extraMinutes = 30 - (minutes % 30);
    let addMS = extraMinutes * 60 * 1000;
    roundedDate = new Date(roundedDate.getTime() + addMS);
  }

  let jsonData = {'PUBLISH_DATE':pubDate.toISOString(),
                  'ROUNDED_PUBLISH_DATE':roundedDate.toISOString()
                 };
  // write a new date file to make sure script runs even if there is no svg change  
  writeFile(filename, JSON.stringify(jsonData));
}
