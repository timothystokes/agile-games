export function checkTddCondition(story) {
  const writeTests = story.tasks.find((t) => t.isWriteTests);
  if (!writeTests) return false;
  // Bug triggers if any non-bug task completes while Write Tests was not already done first
  return story.tasks.some(
    (t) =>
      !t.isWriteTests &&
      !t.isBug &&
      t.completedAt !== null &&
      (writeTests.completedAt === null || t.completedAt < writeTests.completedAt)
  );
}

export function createBugTask(storyId, remainingHours) {
  if (remainingHours < 6) return null;
  const hours = Math.min(Math.floor(Math.random() * 7) + 6, remainingHours);
  if (hours < 6) return null;
  return {
    id: `bug-${storyId}-${Date.now()}`,
    storyId,
    name: 'Bug Fix',
    estimatedHours: hours,
    progressHours: 0,
    status: 'todo',
    isWriteTests: false,
    isBug: true,
    changed: false,
    startedAt: null,
    completedAt: null,
  };
}
