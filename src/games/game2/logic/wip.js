export function countActiveTasks(stories) {
  return stories.reduce(
    (count, story) => count + story.tasks.filter((t) => t.status === 'inProgress').length,
    0
  );
}

export function hoursPerTick(n) {
  if (n === 0) return 0;
  if (n === 1) return 1 / 0.9;
  return 1 / (1 + 0.05 * n);
}

export function advanceTick(stories, elapsedHours) {
  const n = countActiveTasks(stories);
  const rate = hoursPerTick(n);

  return stories.map((story) => {
    const updatedTasks = story.tasks.map((task) => {
      if (task.status !== 'inProgress') return task;
      const newProgress = Math.min(task.progressHours + rate, task.estimatedHours);
      const isDone = newProgress >= task.estimatedHours;
      return {
        ...task,
        progressHours: newProgress,
        status: isDone ? 'done' : 'inProgress',
        completedAt: isDone && task.completedAt === null ? elapsedHours : task.completedAt,
      };
    });

    const allDone = updatedTasks.length > 0 && updatedTasks.every((t) => t.status === 'done');
    return {
      ...story,
      tasks: updatedTasks,
      completedAt: allDone && story.completedAt === null ? elapsedHours : story.completedAt,
    };
  });
}
