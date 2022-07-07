const { Task } = require('../models');

module.exports = async (taskIDs, slackUserID, client) => {
  await Task.updateMany({ _id:{ $in: taskIDs }}, { status: 'CLOSED' });

  // Find all the tasks provided where we have a scheduled message ID
  const tasksFromDB = await Task.find({
    _id: { $in: taskIDs },
    scheduledMessageId: { $ne: null }
  });

  // If a reminder is scheduled, cancel it and remove the ID from the datastore
  tasksFromDB.map(async (task) => {
    if (task.scheduledMessageId) {
      try {
        await client.chat.deleteScheduledMessage({
          channel: slackUserID,
          scheduled_message_id: task.scheduledMessageId,
        });
        await Task.updateOne({ _id: task.id }, { scheduledMessageId: null });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }

  });
};
