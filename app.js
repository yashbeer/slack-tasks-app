require('dotenv').config();

require('./models/mongoose');

const { App, LogLevel } = require('@slack/bolt');

const { registerListeners } = require('./listeners');

const { customRoutes } = require('./custom-routes');

let logLevel;
switch (process.env.LOG_LEVEL) {
  case 'debug':
    logLevel = LogLevel.DEBUG;
    break;
  case 'info':
    logLevel = LogLevel.INFO;
    break;
  case 'warn':
    logLevel = LogLevel.WARN;
    break;
  case 'error':
    logLevel = LogLevel.ERROR;
    break;
  default:
    logLevel = LogLevel.INFO;
}

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel,
  customRoutes,
});
registerListeners(app);


(async () => {
  try {
    // await sequelize.authenticate();
    // await sequelize.sync({ force: true });
    // eslint-disable-next-line no-console
    // console.log('All models were synchronized successfully.');
    // eslint-disable-next-line no-console
    // console.log('Connection has been established successfully.');
    // Start your app
    await app.start(3000);

    // eslint-disable-next-line no-console
    console.log('⚡️ Tasks app is running!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start App', error);
    process.exit(1);
  }
})();
