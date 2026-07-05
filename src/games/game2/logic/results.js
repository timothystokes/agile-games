const TIPS = {
  success: 'You finished everything — great focus! Finishing beats starting: a done story delivers value. You prioritised the work and applied TDD.',
  tdd: 'Apply TDD. Bugs appeared because tests were written after the code. Writing tests first catches defects at source and cuts rework.',
  disruption: 'Requirement changes hit hardest after work has started. Prioritise ruthlessly — finishing all high-value work before starting on the next story so that changes have little to no impact.',
  wip: 'Stop starting, start finishing. Spreading effort across many tasks at once slows everything down — WIP limits speed up throughput.',
};

export function calculateResults(stories, elapsedHours, maxWip = 1) {
  const completed = stories.filter((s) => s.completedAt !== null);
  const valueDelivered = completed.reduce((sum, s) => sum + s.businessValue, 0);
  const potentialValue = stories.reduce((sum, s) => sum + s.businessValue, 0);
  const throughput = valueDelivered / 10;
  const cycleTime = completed.length > 0
    ? completed.reduce((sum, s) => sum + s.completedAt, 0) / completed.length
    : null;

  const allTasks = stories.flatMap((s) => s.tasks);
  const hasBugs = allTasks.some((t) => t.isBug);
  const hasDisruptions = allTasks.some((t) => t.changed);

  return {
    valueDelivered,
    potentialValue,
    throughput,
    cycleTime,
    storiesCompleted: completed.length,
    storiesTotal: stories.length,
    hasBugs,
    hasDisruptions,
    maxWip,
    elapsedHours,
  };
}

export function selectTips(results) {
  const tips = [];

  if (results.storiesCompleted === results.storiesTotal) tips.push(TIPS.success);
  if (results.hasBugs) tips.push(TIPS.tdd);
  if (results.hasDisruptions) tips.push(TIPS.disruption);

  // WIP tip shown independently whenever WIP exceeded 1 and sprint wasn't fully complete
  if (results.maxWip > 1 && results.storiesCompleted < results.storiesTotal) {
    tips.push(TIPS.wip);
  }

  return tips.length > 0 ? tips : [TIPS.wip];
}
