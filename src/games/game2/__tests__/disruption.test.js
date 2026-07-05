import { checkDisruptions } from '../logic/disruption';

function makeTask(overrides = {}) {
  return {
    id: 't-0', storyId: 'story-0', name: 'Build UI',
    estimatedHours: 10, progressHours: 5,
    status: 'inProgress', isWriteTests: false, isBug: false,
    changed: false, startedAt: 2, completedAt: null,
    ...overrides,
  };
}

function makeStories(taskOverrides = {}) {
  return [
    { id: 'story-0', priority: 1, tasks: [makeTask({ id: 't-0', storyId: 'story-0', status: 'done', progressHours: 10, completedAt: 5 })], completedAt: 5 },
    { id: 'story-1', priority: 2, tasks: [makeTask({ id: 't-1', storyId: 'story-1', ...taskOverrides })], completedAt: null },
    { id: 'story-2', priority: 3, tasks: [makeTask({ id: 't-2', storyId: 'story-2' })], completedAt: null },
  ];
}

const baseEvents = [
  { id: 'ev-1', storyId: 'story-1', targetTaskId: 't-1', firesAt: 8, triggered: false },
  { id: 'ev-2', storyId: 'story-2', targetTaskId: 't-2', firesAt: 20, triggered: false },
];

describe('checkDisruptions', () => {
  it('returns stories unchanged when no event has fired yet', () => {
    const stories = makeStories();
    const { stories: result } = checkDisruptions(stories, baseEvents, 5);
    expect(result[1].tasks[0].progressHours).toBe(5);
    expect(result[1].tasks[0].changed).toBe(false);
  });

  it('does not fire an event that has already triggered', () => {
    const triggered = [{ ...baseEvents[0], triggered: true }, baseEvents[1]];
    const stories = makeStories();
    const { stories: result } = checkDisruptions(stories, triggered, 10);
    expect(result[1].tasks[0].progressHours).toBe(5);
  });

  it('marks event as triggered after firing', () => {
    const stories = makeStories();
    const { events } = checkDisruptions(stories, baseEvents, 10);
    expect(events[0].triggered).toBe(true);
  });

  it('resets task to todo with progress 0 and changed flag when in progress', () => {
    const stories = makeStories({ status: 'inProgress', progressHours: 6 });
    const { stories: result } = checkDisruptions(stories, baseEvents, 10);
    const task = result[1].tasks[0];
    expect(task.status).toBe('todo');
    expect(task.progressHours).toBe(0);
    expect(task.changed).toBe(true);
  });

  it('resets a done task back to todo', () => {
    const stories = makeStories({ status: 'done', progressHours: 10, completedAt: 7 });
    const { stories: result } = checkDisruptions(stories, baseEvents, 10);
    expect(result[1].tasks[0].status).toBe('todo');
    expect(result[1].tasks[0].completedAt).toBeNull();
  });

  it('clears story completedAt when a done task in a complete story is reset', () => {
    const stories = [
      { id: 'story-1', priority: 2, completedAt: 8,
        tasks: [makeTask({ id: 't-1', storyId: 'story-1', status: 'done', progressHours: 10, completedAt: 8 })] },
    ];
    const events = [{ id: 'ev-1', storyId: 'story-1', targetTaskId: 't-1', firesAt: 10, triggered: false }];
    const { stories: result } = checkDisruptions(stories, events, 10);
    expect(result[0].completedAt).toBeNull();
  });

  it('has no effect when the target task is still in todo', () => {
    const stories = makeStories({ status: 'todo', progressHours: 0 });
    const { stories: result } = checkDisruptions(stories, baseEvents, 10);
    expect(result[1].tasks[0].changed).toBe(false);
    expect(result[1].tasks[0].status).toBe('todo');
  });
});
