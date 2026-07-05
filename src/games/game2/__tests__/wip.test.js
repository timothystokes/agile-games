import { countActiveTasks, hoursPerTick, advanceTick } from '../logic/wip';

function makeStory(tasks) {
  return [{ id: 'story-0', tasks, completedAt: null }];
}

function makeTask(overrides = {}) {
  return {
    id: 't-0', storyId: 'story-0', name: 'Build UI',
    estimatedHours: 10, progressHours: 0,
    status: 'todo', isWriteTests: false, isBug: false,
    changed: false, startedAt: null, completedAt: null,
    ...overrides,
  };
}

describe('countActiveTasks', () => {
  it('returns 0 when no tasks are in progress', () => {
    const stories = makeStory([makeTask({ status: 'todo' })]);
    expect(countActiveTasks(stories)).toBe(0);
  });

  it('counts only inProgress tasks across all stories', () => {
    const stories = [
      { id: 's-0', tasks: [makeTask({ id: 't-0', status: 'inProgress' }), makeTask({ id: 't-1', status: 'blocked' })], completedAt: null },
      { id: 's-1', tasks: [makeTask({ id: 't-2', status: 'inProgress' })], completedAt: null },
    ];
    expect(countActiveTasks(stories)).toBe(2);
  });
});

describe('hoursPerTick', () => {
  it('returns 0 when no tasks are active', () => {
    expect(hoursPerTick(0)).toBe(0);
  });

  it('returns 1/0.9 for 1 active task (focus boost)', () => {
    expect(hoursPerTick(1)).toBeCloseTo(1 / 0.9, 5);
  });

  it('returns 1/1.10 for 2 active tasks (10% penalty)', () => {
    expect(hoursPerTick(2)).toBeCloseTo(1 / 1.10, 5);
  });

  it('returns 1/1.15 for 3 active tasks (15% penalty)', () => {
    expect(hoursPerTick(3)).toBeCloseTo(1 / 1.15, 5);
  });
});

describe('advanceTick', () => {
  it('adds hoursPerTick(1) progress to a single in-progress task', () => {
    const stories = makeStory([makeTask({ status: 'inProgress' })]);
    const result = advanceTick(stories, 1);
    expect(result[0].tasks[0].progressHours).toBeCloseTo(1 / 0.9, 5);
  });

  it('does not advance todo or blocked tasks', () => {
    const stories = makeStory([
      makeTask({ id: 't-0', status: 'todo' }),
      makeTask({ id: 't-1', status: 'blocked' }),
    ]);
    const result = advanceTick(stories, 1);
    expect(result[0].tasks[0].progressHours).toBe(0);
    expect(result[0].tasks[1].progressHours).toBe(0);
  });

  it('marks task as done when progress reaches estimatedHours', () => {
    const stories = makeStory([makeTask({ status: 'inProgress', progressHours: 9.5, estimatedHours: 10 })]);
    const result = advanceTick(stories, 5);
    expect(result[0].tasks[0].status).toBe('done');
    expect(result[0].tasks[0].completedAt).toBe(5);
  });

  it('caps progressHours at estimatedHours when done', () => {
    const stories = makeStory([makeTask({ status: 'inProgress', progressHours: 9.9, estimatedHours: 10 })]);
    const result = advanceTick(stories, 5);
    expect(result[0].tasks[0].progressHours).toBe(10);
  });

  it('marks story as complete when all tasks are done', () => {
    const stories = makeStory([
      makeTask({ id: 't-0', status: 'done', completedAt: 4 }),
      makeTask({ id: 't-1', status: 'inProgress', progressHours: 9.9, estimatedHours: 10 }),
    ]);
    const result = advanceTick(stories, 10);
    expect(result[0].completedAt).toBe(10);
  });

  it('applies WIP penalty to all tasks when 2 are in progress', () => {
    const stories = makeStory([
      makeTask({ id: 't-0', status: 'inProgress' }),
      makeTask({ id: 't-1', status: 'inProgress' }),
    ]);
    const result = advanceTick(stories, 2);
    expect(result[0].tasks[0].progressHours).toBeCloseTo(1 / 1.10, 5);
    expect(result[0].tasks[1].progressHours).toBeCloseTo(1 / 1.10, 5);
  });
});
