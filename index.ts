import * as fs from 'fs';
import { google } from 'googleapis';

// If modifying these scopes, delete token.json.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
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

let token = '{}';
try {
  token = fs.readFileSync(TOKEN_PATH, { encoding: 'utf8' });
} catch (err) {
  console.error(err);
  process.exit(1);
}

oAuth2Client.setCredentials(JSON.parse(token));

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

gmail.users.messages.list({
  maxResults: 1,
  q: 'no-reply@ml.store.uniqlo.com',
  userId: 'me',
}).then((res) => {
  const messages = res.data.messages;
  if (messages === undefined) {
    throw new Error();
  }
  if (messages.length) {
    console.log('messages:' + messages.length);
    for (const message of messages) {
      console.log(message);
    }
  } else {
    console.log('No messages found.');
  }
}).catch((err) => {
  console.error('The API returned an error: ' + err);
});
