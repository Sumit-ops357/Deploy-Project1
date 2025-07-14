const PomodoroSession = require('../models/pomodoroSession');
const Task = require('../models/task');

// Get comprehensive analytics data
exports.getAnalytics = async (req, res) => {
  try {
    // Get date range (last 7 days by default)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Get all sessions in the date range
    const sessions = await PomodoroSession.find({
      completedAt: { $gte: startDate, $lte: endDate }
    }).sort({ completedAt: 1 });

    // Get all tasks
    const tasks = await Task.find({});

    // If no data exists, create sample data for demo
    if (sessions.length === 0 && tasks.length === 0) {
      await createSampleData();
      // Fetch the sample data
      const sampleSessions = await PomodoroSession.find({
        completedAt: { $gte: startDate, $lte: endDate }
      }).sort({ completedAt: 1 });
      const sampleTasks = await Task.find({});
      
      const analytics = calculateAnalytics(sampleSessions, sampleTasks, startDate, endDate);
      res.json(analytics);
      return;
    }

    // Calculate analytics
    const analytics = calculateAnalytics(sessions, tasks, startDate, endDate);

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get weekly progress data
exports.getWeeklyProgress = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const sessions = await PomodoroSession.find({
      completedAt: { $gte: startDate, $lte: endDate }
    }).sort({ completedAt: 1 });

    // If no sessions exist, create sample data
    if (sessions.length === 0) {
      await createSampleData();
      const sampleSessions = await PomodoroSession.find({
        completedAt: { $gte: startDate, $lte: endDate }
      }).sort({ completedAt: 1 });
      
      const weeklyData = calculateWeeklyData(sampleSessions, startDate, endDate);
      res.json(weeklyData);
      return;
    }

    const weeklyData = calculateWeeklyData(sessions, startDate, endDate);
    res.json(weeklyData);
  } catch (error) {
    console.error('Weekly progress error:', error);
    res.status(500).json({ message: 'Error fetching weekly progress', error: error.message });
  }
};

// Create sample data for demo
async function createSampleData() {
  try {
    // Create sample pomodoro sessions for the last 7 days
    const sampleSessions = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Create 2-6 sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 5) + 2;
      
      for (let j = 0; j < sessionsPerDay; j++) {
        const sessionTime = new Date(date);
        sessionTime.setHours(9 + Math.floor(Math.random() * 8)); // Random time between 9 AM and 5 PM
        sessionTime.setMinutes(Math.floor(Math.random() * 60));
        
        // Work session (25 minutes)
        sampleSessions.push({
          mode: 'Work',
          duration: 25 * 60, // 25 minutes in seconds
          completedAt: new Date(sessionTime)
        });
        
        // Break session (5 minutes) - 70% of the time
        if (Math.random() < 0.7) {
          const breakTime = new Date(sessionTime);
          breakTime.setMinutes(breakTime.getMinutes() + 25);
          sampleSessions.push({
            mode: 'Break',
            duration: 5 * 60, // 5 minutes in seconds
            completedAt: new Date(breakTime)
          });
        }
      }
    }
    
    await PomodoroSession.insertMany(sampleSessions);
    
    // Create sample tasks
    const sampleTasks = [
      { text: 'Complete project documentation', completed: true },
      { text: 'Review code changes', completed: true },
      { text: 'Plan weekly goals', completed: false },
      { text: 'Update portfolio', completed: true },
      { text: 'Learn new framework', completed: false },
      { text: 'Write blog post', completed: false },
      { text: 'Organize workspace', completed: true },
      { text: 'Schedule meetings', completed: true }
    ];
    
    await Task.insertMany(sampleTasks);
    
    console.log('Sample data created successfully');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

// Helper function to calculate analytics
function calculateAnalytics(sessions, tasks, startDate, endDate) {
  // Calculate session statistics
  const totalSessions = sessions.length;
  const workSessions = sessions.filter(s => s.mode === 'Work');
  const breakSessions = sessions.filter(s => s.mode === 'Break');
  
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const workTime = workSessions.reduce((sum, session) => sum + session.duration, 0);
  const breakTime = breakSessions.reduce((sum, session) => sum + session.duration, 0);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate average session length
  const averageSessionLength = totalSessions > 0 ? Math.round(totalTime / totalSessions / 60) : 0;

  // Find best day (day with most sessions)
  const dailySessions = {};
  sessions.forEach(session => {
    const day = session.completedAt.toLocaleDateString('en-US', { weekday: 'long' });
    dailySessions[day] = (dailySessions[day] || 0) + 1;
  });
  
  const bestDay = Object.keys(dailySessions).length > 0 
    ? Object.keys(dailySessions).reduce((a, b) => dailySessions[a] > dailySessions[b] ? a : b)
    : 'No data';

  // Calculate productivity score (based on consistency and completion)
  const daysWithSessions = new Set(sessions.map(s => s.completedAt.toDateString())).size;
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const consistencyScore = totalDays > 0 ? Math.round((daysWithSessions / totalDays) * 100) : 0;
  const productivityScore = Math.round((consistencyScore + taskCompletionRate) / 2);

  // Calculate focus time percentage
  const focusTimePercentage = totalTime > 0 ? Math.round((workTime / totalTime) * 100) : 0;

  return {
    totalSessions,
    totalTime: Math.round(totalTime / 60), // Convert to minutes
    workTime: Math.round(workTime / 60),
    breakTime: Math.round(breakTime / 60),
    averageSessionLength,
    bestDay,
    productivityScore,
    taskCompletionRate,
    focusTimePercentage,
    totalTasks,
    completedTasks,
    consistencyScore,
    workSessions: workSessions.length,
    breakSessions: breakSessions.length
  };
}

// Helper function to calculate weekly data
function calculateWeeklyData(sessions, startDate, endDate) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyData = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const daySessions = sessions.filter(session => 
      session.completedAt.toDateString() === currentDate.toDateString()
    );

    const workSessions = daySessions.filter(s => s.mode === 'Work');
    const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
    const workTime = workSessions.reduce((sum, session) => sum + session.duration, 0);

    weeklyData.push({
      day: days[currentDate.getDay()],
      sessions: daySessions.length,
      workSessions: workSessions.length,
      totalTime: Math.round(totalTime / 60),
      workTime: Math.round(workTime / 60)
    });
  }

  return weeklyData;
} 