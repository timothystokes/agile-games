import { calculateResults, selectTip } from '../logic/results';

function makeStory(overrides = {}) {
  return {
    id: 'story-0',
    priority: 1,
    businessValue: 3000,
    completedAt: null,
    tasks: [
      { id: 't-0', status: 'done', completedAt: 20, isBug: false, changed: false },
    ],
    ...overrides,
  };
}

const completedStory = makeStory({ completedAt: 40 });
const incompleteStory = makeStory({ id: 'story-1', businessValue: 1500, completedAt: null });

describe('calculateResults', () => {
  it('counts only fully-completed stories in valueDelivered', () => {
    const stories = [completedStory, incompleteStory];
    const { valueDelivered } = calculateResults(stories, 80);
    expect(valueDelivered).toBe(3000);
  });

  it('sums all stories for potentialValue regardless of completion', () => {
    const stories = [completedStory, incompleteStory];
    const { potentialValue } = calculateResults(stories, 80);
    expect(potentialValue).toBe(4500);
  });

  it('computes throughput as valueDelivered divided by 10 days', () => {
    const stories = [completedStory];
    const { throughput } = calculateResults(stories, 80);
    expect(throughput).toBe(300);
  });

  it('computes cycleTime as average completedAt of completed stories', () => {
    const s2 = makeStory({ id: 'story-2', completedAt: 60, businessValue: 2000 });
    const { cycleTime } = calculateResults([completedStory, s2], 80);
    expect(cycleTime).toBe(50); // (40 + 60) / 2
  });

  it('returns null cycleTime when no stories completed', () => {
    const { cycleTime } = calculateResults([incompleteStory], 80);
    expect(cycleTime).toBeNull();
  });

  it('counts completed and total stories', () => {
    const { storiesCompleted, storiesTotal } = calculateResults([completedStory, incompleteStory], 80);
    expect(storiesCompleted).toBe(1);
    expect(storiesTotal).toBe(2);
  });

  it('detects bug tasks', () => {
    const storyWithBug = makeStory({
      tasks: [{ id: 't-bug', status: 'todo', completedAt: null, isBug: true, changed: false }],
    });
    const { hasBugs } = calculateResults([storyWithBug], 80);
    expect(hasBugs).toBe(true);
  });

  it('detects disrupted tasks', () => {
    const storyWithDisruption = makeStory({
      tasks: [{ id: 't-d', status: 'done', completedAt: 30, isBug: false, changed: true }],
    });
    const { hasDisruptions } = calculateResults([storyWithDisruption], 80);
    expect(hasDisruptions).toBe(true);
  });
});

describe('selectTip', () => {
  const base = { storiesCompleted: 2, storiesTotal: 3, hasBugs: false, hasDisruptions: false };

  it('returns success tip when all stories completed', () => {
    const tip = selectTip({ ...base, storiesCompleted: 3, storiesTotal: 3 });
    expect(tip).toMatch(/finish/i);
  });

  it('returns TDD tip when bugs were spawned', () => {
    const tip = selectTip({ ...base, hasBugs: true });
    expect(tip).toMatch(/test/i);
  });

  it('returns disruption tip when tasks were changed by events', () => {
    const tip = selectTip({ ...base, hasDisruptions: true });
    expect(tip).toMatch(/priorit/i);
  });

  it('returns WIP tip as default', () => {
    const tip = selectTip({ ...base, storiesCompleted: 0 });
    expect(tip).toMatch(/wip|finish|start/i);
  });
});
