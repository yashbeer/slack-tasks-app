# Setup Tasks App

## Installing

**Create Slack App**
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.yml](../manifest.yml) into the text box that says `*Paste your manifest code here*` and click *Next*
4. Review the configuration and click *Create*
5. Now click *Install to Workspace* and *Allow* on the screen that follows. You'll be redirected to the App Configuration dashboard.

**Environment variables**
Before you can run the app, you'll need to store some environment variables.

1. Copy `.env.sample` to `.env`
2. Open your apps configuration page from [this list](https://api.slack.com/apps), click *OAuth & Permissions* in the left hand menu, then copy the *Bot User OAuth Token* into your `.env` file under `SLACK_BOT_TOKEN`
3. Click *Basic Information* from the left hand menu and follow the steps in the *App-Level Tokens* section to create an app-level token with the `connections:write` scope. Copy that token into your `.env` as `SLACK_APP_TOKEN`.
4. For the `MONGODB_URL` value, you should enter the URL of the MongoDB database to store tasks in.

**Install dependencies**

`npm install`


**Run Bolt Server**

`node app.js`

## Tutorial

More of a visual person? You can checkout [a video walkthrough](https://www.youtube.com/watch?v=q3SBz_eqOq0) of these instructions.
