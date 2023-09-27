const express = require('express');

const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  removeTask,
  getTaskMetrics,
} = require('./task.service');

const taskRouter = express.Router();

taskRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const { page, limit, ...filter } = req.query;
      const { count, rows: tasks } = await getTasks({ page, limit, filter });
      console.log('taskRoute -> getTasks:', count);

      if (!count)
        return res.status(404).json({ msg: 'No tasks found!', data: [] });

      return res.status(200).json({
        msg: 'Tasks retrieved successfully!',
        data: tasks,
      });
    } catch (err) {
      console.error('error while fetching the tasks:', { err });
      return res.status(500).json({ msg: err.message });
    }
  })
  .post(async (req, res) => {
    console.log('taskRoute -> createTask:', req.body);
    try {
      const task = await createTask({ task: req.body });

      return res
        .status(200)
        .json({ msg: 'Task added successfully!', data: task });
    } catch (err) {
      console.error('error while adding the task:', { err });
      return res.status(500).json({ msg: err.message });
    }
  });

taskRouter.route('/metrics').get(async (req, res) => {
  try {
    const metrics = await getTaskMetrics(req.query);
    console.log('taskRoute -> getTaskMetrics:', metrics);

    // if (!count)
    //   return res.status(404).json({ msg: 'No tasks found!', data: [] });

    return res.status(200).json({
      msg: 'Tasks retrieved successfully!',
      data: metrics,
    });
  } catch (err) {
    console.error('error while fetching the tasks:', { err });
    return res.status(500).json({ msg: err.message });
  }
});

taskRouter
  .route('/:id')
  .get(async (req, res) => {
    try {
      const task = await getTask({ taskId: req.params.id });
      // console.log('taskRoute -> getTask:', task);

      if (!task)
        return res.status(404).json({ msg: 'No task found!', data: task });

      return res
        .status(200)
        .json({ msg: 'Task retrieved successfully!', data: task });
    } catch (err) {
      console.error('error while fetching the task:', { err });
      return res.status(500).json({ msg: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      const [affectedCount, [task]] = await updateTask({
        taskId: req.params.id,
        task: req.body,
      });
      console.log('taskRoute -> updateTask:', affectedCount);

      if (!affectedCount)
        return res.status(404).json({ msg: 'Task not found.' });

      return res
        .status(200)
        .json({ msg: 'Task updated successfully!', data: task });
    } catch (err) {
      console.error('error while updating the task:', { err });
      return res.status(500).json({ msg: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const task = await removeTask({ taskId: req.params.id });
      console.log('taskRoute -> removeTask:', task);

      if (!task) return res.status(500).json({ msg: 'Task not found.' });

      return res
        .status(200)
        .json({ msg: 'Task deleted successfully!', data: task });
    } catch (err) {
      console.error('error while deleting the task:', { err });
      return res.status(500).json({ msg: err.message });
    }
  });

module.exports = taskRouter;
