
export const eyeUsageData = {
  daily: [
    { day: '周一', duration: 320, reminders: 5, distance: 45 },
    { day: '周二', duration: 480, reminders: 8, distance: 40 },
    { day: '周三', duration: 410, reminders: 6, distance: 50 },
    { day: '周四', duration: 550, reminders: 10, distance: 38 },
    { day: '周五', duration: 600, reminders: 12, distance: 35 },
    { day: '周六', duration: 250, reminders: 4, distance: 55 },
    { day: '周日', duration: 180, reminders: 2, distance: 60 },
  ],
  get averageDuration() {
    return this.daily.reduce((acc, cur) => acc + cur.duration, 0) / this.daily.length;
  },
  get totalReminders() {
    return this.daily.reduce((acc, cur) => acc + cur.reminders, 0);
  },
  get averageDistance() {
    return this.daily.reduce((acc, cur) => acc + cur.distance, 0) / this.daily.length;
  },
  get longestDuration() {
    return Math.max(...this.daily.map(d => d.duration));
  },
  get farthestDistance() {
    return Math.max(...this.daily.map(d => d.distance));
  },
  get nearestDistance() {
    return Math.min(...this.daily.map(d => d.distance));
  }
};

export const postureData = {
  daily: [
    { day: '周一', reminders: 10, status: '良好', focus: 240 },
    { day: '周二', reminders: 15, status: '一般', focus: 300 },
    { day: '周三', reminders: 8, status: '良好', focus: 280 },
    { day: '周四', reminders: 20, status: '差', focus: 320 },
    { day: '周五', reminders: 18, status: '一般', focus: 350 },
    { day: '周六', reminders: 5, status: '优秀', focus: 120 },
    { day: '周日', reminders: 3, status: '优秀', focus: 90 },
  ],
  get totalFocusDuration() {
    return this.daily.reduce((acc, cur) => acc + cur.focus, 0);
  },
  get totalReminders() {
    return this.daily.reduce((acc, cur) => acc + cur.reminders, 0);
  },
  get mostFrequentStatus() {
    const counts = this.daily.reduce((acc, cur) => {
      acc[cur.status] = (acc[cur.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  },
  get longestCorrectDuration() {
    const correctDurations = this.daily
      .filter(d => d.status === '良好' || d.status === '优秀')
      .map(d => d.focus);
    return correctDurations.length > 0 ? Math.max(...correctDurations) : 0;
  }
};

export const emotionalData = {
  trends: [
    { time: '上午9点', indicator: '平静' },
    { time: '上午11点', indicator: '紧张' },
    { time: '下午1点', indicator: '中性' },
    { time: '下午3点', indicator: '焦虑' },
    { time: '下午5点', indicator: '疲惫' },
    { time: '下午7点', indicator: '放松' },
  ],
  changeIndicators: '用户报告在工作高峰时段有紧张和焦虑感，随后感到疲惫。早上和晚上更常见的是平静和放松。',
  timePeriods: '工作时段（上午10点 - 下午5点）显示出较高的压力。晚上（下午6点后）显示出积极的情绪转变。',
};
