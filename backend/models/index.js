const User = require('./User');
const Task = require('./Task');
const UserManager = require('./UserManager');

// Define relationships
User.belongsToMany(User, {
  through: UserManager,
  as: 'managedUsers',
  foreignKey: 'managerId',
  otherKey: 'userId'
});

User.belongsToMany(User, {
  through: UserManager,
  as: 'managers',
  foreignKey: 'userId',
  otherKey: 'managerId'
});

Task.belongsTo(User, {
  as: 'creator',
  foreignKey: 'creatorId'
});

Task.belongsTo(User, {
  as: 'assignee',
  foreignKey: 'assigneeId'
});

module.exports = { User, Task, UserManager };