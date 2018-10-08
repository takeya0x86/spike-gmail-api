import * as fs from 'fs';
import { google } from 'googleapis';
import * as readline from 'readline';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';

let credentials;
try {
  const content = fs.readFileSync('credentials.json', { encoding: 'utf8' });
  credentials = JSON.parse(content);
} catch (err) {
  console.error('Error loading client secret file:', err);
  process.exit(1);
}

// Create an OAuth2 client with the given credentials
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Get and store new token after prompting for user authorization
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});
console.log('Authorize this app by visiting this url:', authUrl);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code).then((token) => {

    // Store the token to disk for later program executions
    try {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token.tokens, null, 4));
      console.log('Token stored to', TOKEN_PATH);
    } catch (err) {
      console.error(err);
    }
  }).catch((err) => {
    console.error('Error retrieving access token', err);
  });
});
