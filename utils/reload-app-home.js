const {
  openTasksView,
  completedTasksView,
} = require('../user-interface/app-home');
const { User } = require('../models');

module.exports = async (client, slackUserID, slackWorkspaceID, navTab) => {
  try {
    const user = await User.findOrCreate({
      slackUserID,
      slackWorkspaceID,
    });

    if (navTab === 'open') {
      const openTasks = await user.getAssignedTasks({
        status: 'OPEN'
        // order: [['dueDate', 'ASC']],
      });

      await client.views.publish({
        user_id: slackUserID,
        view: openTasksView(openTasks),
      });
      return;
    }

    if (navTab === 'completed') {
      const recentlyCompletedTasks = await user.getAssignedTasks({
        status: 'CLOSED',
        updatedAt: {
          $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
        },
      });

      await client.views.publish({
        user_id: slackUserID,
        view: completedTasksView(recentlyCompletedTasks),
      });
      return;
    }

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
