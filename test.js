const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Replace with your actual bot token
const token = process.env.TOKEN;

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Message to be sent to users
const maintenanceMessage = "The bot is currently under maintenance. We apologize for the inconvenience.";

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;

// Route to test the server
app.get('/', (req, res) => {
    res.send('Express server is running.');
});

// Telegram bot listener
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Send the maintenance message to the user
    bot.sendMessage(chatId, maintenanceMessage)
        .then(() => {
            console.log(`Sent maintenance message to chat ID: ${chatId}`);
        })
        .catch((error) => {
            console.error(`Failed to send message to chat ID ${chatId}:`, error);
        });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
    console.log('Maintenance bot is running...');
});
