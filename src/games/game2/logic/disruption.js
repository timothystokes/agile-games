export function checkDisruptions(stories, events, elapsedHours) {
  let current = stories;

  const updatedEvents = events.map((event) => {
    if (event.triggered || elapsedHours < event.firesAt) return event;

    const target = current.flatMap((s) => s.tasks).find((t) => t.id === event.targetTaskId);

    if (!target || target.status === 'todo') {
      return { ...event, triggered: true };
    }

    current = current.map((story) => {
      const hasTarget = story.tasks.some((t) => t.id === event.targetTaskId);
      if (!hasTarget) return story;
      return {
        ...story,
        completedAt: null,
        tasks: story.tasks.map((task) =>
          task.id === event.targetTaskId
            ? { ...task, status: 'todo', progressHours: 0, changed: true, completedAt: null }
            : task
        ),
      };
    });

    return { ...event, triggered: true };
  });

  return { stories: current, events: updatedEvents };
}
