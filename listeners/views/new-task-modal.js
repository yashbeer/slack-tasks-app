const { DateTime } = require('luxon');
const { User, Task } = require('../../models');
const { modals } = require('../../user-interface');
const { taskReminder } = require('../../user-interface/messages');
const { reloadAppHome } = require('../../utils');


const newTaskModalCallback = async ({ ack, view, body, client }) => {
  const providedValues = view.state.values;

  const taskTitle = providedValues.taskTitle.taskTitle.value;
  const selectedUser =
    providedValues.taskAssignUser.taskAssignUser.selected_user;
  const selectedDate = providedValues.taskDueDate.taskDueDate.selected_date;
  const selectedTime = providedValues.taskDueTime.taskDueTime.selected_time;

  const task = Task({ title: taskTitle });

  if (selectedDate) {
    if (!selectedTime) {
      await ack({
        response_action: 'errors',
        errors: {
          taskDueTime: 'Please set a time for the date you\'ve chosen',
        },
      });
      return;
    }
    const taskDueDate = DateTime.fromISO(`${selectedDate}T${selectedTime}`);
    const diffInDays = taskDueDate.diffNow('days').toObject().days;
    // Task due date is in the past, so reject
    if (diffInDays < 0) {
      await ack({
        response_action: 'errors',
        errors: {
          taskDueDate: 'Please select a due date in the future',
          taskDueTime: 'Please select a time in the future',
        },
      });
      return;
    }
    task.dueDate = taskDueDate;
  }

  try {
    // Grab the creating user from the DB
    const user = await User.findOrCreate({
      slackUserID: body.user.id,
      slackWorkspaceID: body.team.id,
    });

    // Grab the assignee user from the DB
    const selectedUserObject = await User.findOrCreate({
      slackUserID: selectedUser,
      slackWorkspaceID: body.team.id, // TODO better compatibility with Slack Connect.
    });

    task.creatorId = user;
    task.currentAssigneeId = selectedUserObject;

    if (task.dueDate) {
      const dateObject = DateTime.fromJSDate(task.dueDate);
      // The `chat.scheduleMessage` endpoint only accepts messages in the next 120 days,
      // so if the date is further than that, don't set a reminder, and let the user know.
      if (dateObject.diffNow('days').toObject().days < 120) {
        await client.chat
          .scheduleMessage(
            taskReminder(
              dateObject.toSeconds(),
              selectedUserObject.slackUserID,
              task.title,
              dateObject.toRelativeCalendar(),
              task.id,
            ),
          )
          .then(async (response) => {
            task.scheduledMessageId = response.scheduled_message_id;
            await task.save();
          });
      }
      else {
        // TODO better error message and store it in /user-interface
        await client.chat.postMessage({
          text: `Sorry, but we couldn't set a reminder for ${taskTitle}, as it's more than 120 days from now`,
          channel: selectedUserObject.slackUserID,
        });
      }
    }
    
    await task.save();
    
    await ack({
      response_action: 'update',
      view: modals.taskCreated(taskTitle),
    });

    if (selectedUser !== body.user.id) {
      await client.chat.postMessage({
        channel: selectedUser,
        text: `<@${body.user.id}> assigned you a new task:\n- *${taskTitle}*`,
      });
      await reloadAppHome(client, selectedUser, body.team.id, 'open');
    }

    await reloadAppHome(client, body.user.id, body.team.id, 'open');
  }
  catch (error) {
    await ack({
      response_action: 'update',
      view: modals.taskCreationError(taskTitle),
    });
    // eslint-disable-next-line no-console
    console.error(error);
  }
};


module.exports = { newTaskModalCallback };
