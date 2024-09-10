Instagram Downloader Telegram Bot
This Telegram bot allows users to download media from Instagram using direct URLs. It is built with Node.js, utilizing the instagramdirct-url npm package for fetching content, Telegram Bot API for communication, Express for handling webhooks, and deployed on Repl.it for hosting with UptimeRobot for server monitoring.

Bot Link
You can access the Instagram Downloader Telegram Bot here(https://t.me/InstagramDownloadInstaBot).

Features
Download Instagram Media: Send direct URLs of Instagram posts, reels, IGTV videos, or profiles to the bot to download.
Telegram Integration: Seamlessly interacts with users via Telegram's messaging platform.
Express Integration: Handles webhook events from Telegram for real-time updates and message handling.
Deployment: Deployed on Repl.it for easy setup and hosting. Monitored by UptimeRobot for server availability.

Deployment on Repl.it
Deploy on Repl.it:
Fork this repository on Repl.it.
Configure environment variables in Repl.it Secrets for TELEGRAM_BOT_TOKEN.
Start the Repl and your bot will be up and running.
Server Monitoring with UptimeRobot
Set up UptimeRobot:
Go to UptimeRobot and sign up/log in.
Add a new HTTP(s) monitor.
Set the monitor type to HTTP(s).
(https://replit.com/@sanketkorde2004/IntraBot#index.js)
Configure monitoring intervals and other settings as needed.
UptimeRobot will monitor your bot's availability and alert you if it goes down.
Usage
Telegram Bot Commands:
/start: Start the bot and get instructions.
Send an Instagram post URL directly to the bot to download the media.
Credits
instagramdirct-url: npm package for fetching Instagram content via URLs.
Telegram Bot API: Official API for building Telegram bots.
Express: Web framework for Node.js used for handling Telegram bot webhooks.
Repl.it: Online platform for quick Node.js application deployment.
UptimeRobot: Monitoring service to ensure server availability.
