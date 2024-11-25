require('dotenv').config();
const tmi = require('tmi.js');
const fetch = require('node-fetch');

// Configure the bot
const client = new tmi.Client({
  options: { debug: true },
  identity: {
      username: process.env.TWITCH_BOT_USERNAME,
      password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [process.env.TWITCH_CHANNEL]
});

// Connect to Abacus AI
async function getAbacusResponse() {
  try {
      const response = await fetch('https://api.abacus.ai/v0/prediction', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${process.env.ABACUS_API_KEY}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              prompt: "Generate a sarcastic and despondent response for a Twitch chat",
              max_tokens: 100
          })
      });

      const data = await response.json();
      return data.prediction || "Error: Could not generate response";
  } catch (error) {
      console.error('Error:', error);
      return "Sorry, I'm too despondent to respond right now...";
  }
}

// Handle messages
client.on('message', async (channel, tags, message, self) => {
  if (self) return;

  if (message.toLowerCase() === '!underscore') {
      const response = await getAbacusResponse();
      client.say(channel, response);
  }
});

// Connect to Twitch
client.connect().catch(console.error);

console.log('Bot is running!');