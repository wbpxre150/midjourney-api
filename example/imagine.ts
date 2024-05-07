import "dotenv/config";
import { Midjourney } from "../src";
/**
 *
 * a simple example of how to use the imagine command
 * ```
 * npx tsx example/imagine.ts
 * ```
 */
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline');

function downloadImage(url, filename) {
    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Error downloading image. Status code: ${response.statusCode}`);
            return;
        }

        const chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk);
        });

        response.on('end', () => {
            const imageData = Buffer.concat(chunks);
            const savePath = path.join(__dirname, 'img', `${filename}.png`);
            fs.writeFile(savePath, imageData, (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                } else {
                    console.log(`Image saved successfully as "${filename}".png in the "img" folder.`);
                }
            });
        });
    }).on('error', (err) => {
        console.error('Error downloading image:', err);
    });
}

async function main() {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: false,
    Ws: false,
  });
  // loop over list of words
  filePath = "./verbs"
  try {
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity, // Recognize all instances of CR LF ('\r\n') as a single line break
    });

    // Read each line from the file
    for await (const word of rl) {
        //console.log(`Line from file: ${word}`);
        // trim spaces
        trimedword = word.trim();

        // generate the image 
        const msg = await client.Imagine(trimedword);
        const imageUrl = msg.uri;

        // jumble this word up
        const jumbledword = trimedword.split("").sort(() => 0.5 - Math.random()).join("");
        console.log(jumbledword); 

        // save png of generated image as the jumbled word.
        downloadImage(imageUrl, jumbledword);
    }
} catch (err) {
    console.error('Error reading file:', err);
}
  
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
