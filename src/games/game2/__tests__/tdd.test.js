import { checkTddCondition, createBugTask } from '../logic/tdd';

function makeTask(overrides = {}) {
  return {
    id: 't-0', storyId: 'story-0', name: 'Build UI',
    estimatedHours: 10, progressHours: 0,
    status: 'todo', isWriteTests: false, isBug: false,
    changed: false, startedAt: null, completedAt: null,
    ...overrides,
  };
}

describe('checkTddCondition', () => {
  it('returns false when Write Tests task is not yet done', () => {
    const story = {
      id: 'story-0',
      tasks: [
        makeTask({ id: 't-0', isWriteTests: true, status: 'todo', completedAt: null }),
        makeTask({ id: 't-1', status: 'done', completedAt: 5 }),
      ],
    };
    expect(checkTddCondition(story)).toBe(false);
  });

  it('returns false when Write Tests was done before any other task', () => {
    const story = {
      id: 'story-0',
      tasks: [
        makeTask({ id: 't-0', isWriteTests: true, status: 'done', completedAt: 5 }),
        makeTask({ id: 't-1', status: 'done', completedAt: 15 }),
      ],
    };
    expect(checkTddCondition(story)).toBe(false);
  });

  it('returns false when Write Tests is done and no other tasks are done yet', () => {
    const story = {
      id: 'story-0',
      tasks: [
        makeTask({ id: 't-0', isWriteTests: true, status: 'done', completedAt: 10 }),
        makeTask({ id: 't-1', status: 'inProgress', completedAt: null }),
      ],
    };
    expect(checkTddCondition(story)).toBe(false);
  });

  it('returns true when any other task completed before Write Tests', () => {
    const story = {
      id: 'story-0',
      tasks: [
        makeTask({ id: 't-0', isWriteTests: true, status: 'done', completedAt: 20 }),
        makeTask({ id: 't-1', status: 'done', completedAt: 10 }),
      ],
    };
    expect(checkTddCondition(story)).toBe(true);
  });
});

describe('createBugTask', () => {
  it('returns null when remaining hours is less than 6', () => {
    expect(createBugTask('story-0', 5)).toBeNull();
  });

  it('returns a task with isBug true', () => {
    const bug = createBugTask('story-0', 30);
    expect(bug.isBug).toBe(true);
  });

  it('returns a task with estimatedHours between 6 and 12', () => {
    for (let i = 0; i < 20; i++) {
      const bug = createBugTask('story-0', 30);
      expect(bug.estimatedHours).toBeGreaterThanOrEqual(6);
      expect(bug.estimatedHours).toBeLessThanOrEqual(12);
    }
  });

  it('returns a task with status todo and zero progress', () => {
    const bug = createBugTask('story-0', 30);
    expect(bug.status).toBe('todo');
    expect(bug.progressHours).toBe(0);
  });

  it('caps estimatedHours at remainingHours', () => {
    const bug = createBugTask('story-0', 7);
    expect(bug.estimatedHours).toBeLessThanOrEqual(7);
  });
});
