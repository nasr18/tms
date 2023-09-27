const { Op } = require('sequelize');

const taskModel = require('./task.model');
const { sequelize } = require('../config/db.config');

const getTasks = ({ page = 1, limit = 10, filter = {} }) => {
  const whereCondition = filter.title
    ? { title: { [Op.like]: `%${filter.title}%` } }
    : null;

  return taskModel.findAndCountAll({
    where: whereCondition,
    limit,
    offset: (page - 1) * limit,
  });
};

const getTaskMetrics = () => {
  return taskModel
    .findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', 'status'), 'statusCount'],
        [
          sequelize.fn('to_char', sequelize.col('updatedAt'), 'Month YYYY'),
          'date',
        ],
      ],
      group: ['status', 'date'],
      // order: [['updatedAt', 'desc']],
      raw: true,
    })
    .then((data) => {
      console.log('metrics:', data);
      return data.reduce((acc, cur) => {
        console.log('status:', cur['statusCount']);
        acc[`${cur.status}_tasks`] = cur.statusCount;
        return acc;
      }, {});
    });
};

const getTask = ({ taskId }) => taskModel.findByPk(taskId);

const createTask = ({ task }) => taskModel.create(task);

const updateTask = ({ taskId, task }) =>
  taskModel.update(
    { ...task },
    { where: { id: taskId }, returning: true, silent: true }
  );

const removeTask = ({ taskId }) =>
  taskModel.destroy({ where: { id: taskId }, force: true });

module.exports = {
  getTasks,
  getTaskMetrics,
  getTask,
  createTask,
  updateTask,
  removeTask,
};
