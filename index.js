require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const instagramUrlDirect = require("instagram-url-direct");
const axios = require("axios");
const express = require("express");
const app = express();

const token = process.env.TOKEN;

if (!token) {
    console.error('Telegram bot token is missing. Please set the TOKEN environment variable.');
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

app.get('/', function (req, res) {
  res.send('Home');
});

// Store the link associated with each chat ID
const userLinks = {};

// Delay utility function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Error handling function
function handleInstagramError(error, chatId) {
    if (error.response && error.response.status === 429) {
        bot.sendMessage(chatId, "Too many requests. Please wait a moment and try again.");
    } else if (error.response && error.response.status === 404) {
        bot.sendMessage(chatId, "The provided link is invalid or the content has been removed.");
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        bot.sendMessage(chatId, "The request timed out. Please try again later.");
    } else if (error.response && error.response.status === 500) {
        bot.sendMessage(chatId, "There was an issue with the server. Please try again later.");
    } else {
        bot.sendMessage(chatId, "There was an error processing your request. Please try again.");
    }
    console.error(`Error processing Instagram link for chat ID: ${chatId}`, error);
}

// Function to process Instagram link
async function processInstagramLink(messageText, chatId, callbackData) {
    try {
        let data = await instagramUrlDirect(messageText);
        console.log(data);
        
        for (const url of data.url_list) {
            if (callbackData === "video") {
                await bot.sendVideo(chatId, url, { caption: "Here's your video!" });
            } else if (callbackData === "image") {
                await bot.sendPhoto(chatId, url, { caption: "Here's your image!" });
            } else if (callbackData === "both") {
                await bot.sendVideo(chatId, url);
            }
            await delay(1000); // Adding delay between each request
        }
        
        await delay(10000); // 10-second delay after processing the link
    } catch (error) {
        handleInstagramError(error, chatId);
    }
}

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const userName = msg.from.first_name;  // Get the user's first name
    const userLastName = msg.from.last_name || ''; // Get the user's last name (if available)

    if (!messageText) {
        console.log(`Received empty message from chat ID: ${chatId}`);
        return;
    }

    if (messageText === "/start") {
        bot.sendMessage(chatId, 
            `Welcome to Instra, ${userName}!\nSend me an Instagram video or image link to download it.`
        );
        return;
    }

    if (messageText.includes("instagram.com")) {
        // Store the Instagram link in the userLinks object
        userLinks[chatId] = messageText;

        // Log user information and the link
        console.log(`User: ${userName} ${userLastName} (Chat ID: ${chatId}) wants to download: ${messageText}`);

        // Define inline keyboard buttons
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Video", callback_data: "video" },
                        { text: "Image", callback_data: "image" },
                        { text: "Both", callback_data: "both" }
                    ]
                ]
            }
        };
    
        // Send the message with inline keyboard
        bot.sendMessage(chatId, "Please select the type of content:", options);
    }
});

// Handle the callback query
bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data; // 'video', 'image', or 'both'

    // Answer the callback query immediately to avoid timeout issues
    bot.answerCallbackQuery(callbackQuery.id);

    // Retrieve the stored Instagram link for this chat ID
    const messageText = userLinks[chatId];
    
    if (!messageText) {
        bot.sendMessage(chatId, "Something went wrong. Please send the link again.");
        return;
    }

    bot.sendMessage(chatId, "Please wait for a moment...");
    await processInstagramLink(messageText, chatId, callbackData);

    // Clear the stored link after processing
    delete userLinks[chatId];
});

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
