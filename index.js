require('dotenv').config();
const openai = require('openai');
const { TwitterApi } = require("twitter-api-v2");
const CronJob = require('cron').CronJob;
const topics = require('./topics.js');
const idx = Math.floor(Math.random() * topics.length);

// KEYS
const bearer= process.env.bearer;
const consumerKey = process.env.consumerKey;
const consumerSecret = process.env.consumerSecret;
const accessToken = process.env.accessToken;
const accessTokenSecret = process.env.accessTokenSecret;
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const openai_api_key = process.env.openai_api_key;
// Fill your API credentials
const client = new TwitterApi({
	appKey: consumerKey,
	appSecret: consumerSecret,
	accessToken: accessToken,
	accessSecret: accessTokenSecret,
	bearerToken: bearer,
});

// Initialize your OpenAI client
const openaiClient = new openai({
  apiKey: openai_api_key,
});

// Provide read write controls
const rwClient = client.readWrite;

const tweetText = async () => {
    try
    {
    // Use OpenAI API to generate a tweet
    const topic = topics[idx];
    const openaiRes = await openaiClient.completions.create({
      model: 'text-davinci-003',
      prompt: `Generate a tweet about ${topic}. Keep them under 90 words. Keep in mind that I am located in Kenya`,
      max_tokens: 150,
      temperature: 0,
    });

    const tweetText = openaiRes.choices[0].text.trim();        

		await rwClient.v2.tweet(tweetText);

	} catch (error) {
		console.log(error);
	}
};


const job = new CronJob('5 */10 * * *', function () {
  tweetText();
});
console.log("Running....");
job.start();