export const eyeUsageData = {
  daily: [
    { day: 'Mon', duration: 320, reminders: 5, distance: 45 },
    { day: 'Tue', duration: 480, reminders: 8, distance: 40 },
    { day: 'Wed', duration: 410, reminders: 6, distance: 50 },
    { day: 'Thu', duration: 550, reminders: 10, distance: 38 },
    { day: 'Fri', duration: 600, reminders: 12, distance: 35 },
    { day: 'Sat', duration: 250, reminders: 4, distance: 55 },
    { day: 'Sun', duration: 180, reminders: 2, distance: 60 },
  ],
  averageDuration: 427,
  totalReminders: 47,
  averageDistance: 46,
};

export const postureData = {
  daily: [
    { day: 'Mon', reminders: 10, status: 'good', focus: 240 },
    { day: 'Tue', reminders: 15, status: 'fair', focus: 300 },
    { day: 'Wed', reminders: 8, status: 'good', focus: 280 },
    { day: 'Thu', reminders: 20, status: 'poor', focus: 320 },
    { day: 'Fri', reminders: 18, status: 'fair', focus: 350 },
    { day: 'Sat', reminders: 5, status: 'excellent', focus: 120 },
    { day: 'Sun', reminders: 3, status: 'excellent', focus: 90 },
  ],
  focusTimePeriods: 'Primarily between 10 AM - 1 PM and 3 PM - 6 PM on weekdays.',
  totalFocusDuration: 1700,
};

export const emotionalData = {
  trends: [
    { time: '9 AM', indicator: 'Calm' },
    { time: '11 AM', indicator: 'Stressed' },
    { time: '1 PM', indicator: 'Neutral' },
    { time: '3 PM', indicator: 'Anxious' },
    { time: '5 PM', indicator: 'Tired' },
    { time: '7 PM', indicator: 'Relaxed' },
  ],
  changeIndicators: 'User reports feelings of stress and anxiety during peak work hours, followed by tiredness. Calmness and relaxation are more common in the morning and evening.',
  timePeriods: 'Work hours (10 AM - 5 PM) show higher stress. Evenings (post 6 PM) show positive emotional shifts.',
};
