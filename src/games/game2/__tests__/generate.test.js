import { generateSprint } from '../logic/generate';

const FIBONACCI = new Set([1, 2, 3, 5, 8]);

describe('generateSprint', () => {
  let sprint;
  beforeEach(() => { sprint = generateSprint(); });

  it('returns exactly 3 stories', () => {
    expect(sprint.stories).toHaveLength(3);
  });

  it('assigns priorities 1, 2, 3 to stories', () => {
    const priorities = sprint.stories.map((s) => s.priority).sort();
    expect(priorities).toEqual([1, 2, 3]);
  });

  it('story points are all Fibonacci and sum to 13', () => {
    const points = sprint.stories.map((s) => s.storyPoints);
    expect(points.every((p) => FIBONACCI.has(p))).toBe(true);
    expect(points.reduce((a, b) => a + b, 0)).toBe(13);
  });

  it('total task hours sum to 80', () => {
    const total = sprint.stories
      .flatMap((s) => s.tasks)
      .reduce((sum, t) => sum + t.estimatedHours, 0);
    expect(total).toBe(80);
  });

  it('every task has at least 6 estimated hours', () => {
    const allTasks = sprint.stories.flatMap((s) => s.tasks);
    expect(allTasks.every((t) => t.estimatedHours >= 6)).toBe(true);
  });

  it('each story has exactly one Write Tests task', () => {
    for (const story of sprint.stories) {
      const writeTasks = story.tasks.filter((t) => t.isWriteTests);
      expect(writeTasks).toHaveLength(1);
    }
  });

  it('assigns business values in $1000–$3500 range with P1 highest', () => {
    const byPriority = sprint.stories.slice().sort((a, b) => a.priority - b.priority);
    for (const s of byPriority) {
      expect(s.businessValue).toBeGreaterThanOrEqual(1000);
      expect(s.businessValue).toBeLessThanOrEqual(3500);
    }
    expect(byPriority[0].businessValue).toBeGreaterThanOrEqual(byPriority[1].businessValue);
    expect(byPriority[1].businessValue).toBeGreaterThanOrEqual(byPriority[2].businessValue);
  });

  it('generates 2 disruption events targeting story-2 and story-3 tasks', () => {
    expect(sprint.disruptionEvents).toHaveLength(2);
    const storyIds = sprint.disruptionEvents.map((e) => e.storyId);
    const p2 = sprint.stories.find((s) => s.priority === 2).id;
    const p3 = sprint.stories.find((s) => s.priority === 3).id;
    expect(storyIds).toContain(p2);
    expect(storyIds).toContain(p3);
  });

  it('all tasks start with status todo and zero progress', () => {
    const allTasks = sprint.stories.flatMap((s) => s.tasks);
    expect(allTasks.every((t) => t.status === 'todo' && t.progressHours === 0)).toBe(true);
  });
});
