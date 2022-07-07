const { Task } = require('../../models');
const { reloadAppHome } = require('../../utils');

const reopenTaskCallback = async ({ ack, action, client, body }) => {
  await ack();
  await Task.updateOne({ _id: action.value }, { status: 'OPEN' });
  await reloadAppHome(client, body.user.id, body.team.id, 'completed');
};

module.exports = {
  reopenTaskCallback,
};
