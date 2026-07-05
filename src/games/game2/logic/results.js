const TIPS = {
  success: 'You finished everything — great focus! Finishing beats starting: a done story delivers value, a started one does not.',
  tdd: 'Bugs appeared because tests were written after code. Writing tests first catches defects at source and cuts rework.',
  disruption: 'Requirement changes hit hardest mid-task. Prioritise ruthlessly — finishing high-value work first limits the blast radius.',
  wip: 'Stop starting, start finishing. Spreading effort across many tasks at once slows everything down — WIP limits speed up throughput.',
};

export function calculateResults(stories, elapsedHours) {
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
    elapsedHours,
  };
}

export function selectTip(results) {
  if (results.storiesCompleted === results.storiesTotal) return TIPS.success;
  if (results.hasBugs) return TIPS.tdd;
  if (results.hasDisruptions) return TIPS.disruption;
  return TIPS.wip;
}
