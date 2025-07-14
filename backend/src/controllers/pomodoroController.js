const PomodoroSession = require('../models/pomodoroSession');

exports.addSession = async (req, res) => {
  const { mode, duration } = req.body;
  const session = new PomodoroSession({
    mode,
    duration
  });
  await session.save();
  res.status(201).json(session);
};

exports.getSessions = async (req, res) => {
  const sessions = await PomodoroSession.find({}).sort({ completedAt: -1 });
  res.json(sessions);
};