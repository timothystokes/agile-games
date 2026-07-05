const STORIES = [
  {
    title: 'User Sign In / Sign Out',
    tasks: ['Design Auth Flow', 'Build Sign In UI', 'Build Sign Out UI', 'Connect to Auth API', 'Security Review'],
  },
  {
    title: 'Registration Form',
    tasks: ['Design Form UI', 'Build Form Fields', 'Add Validation Logic', 'Connect to User API', 'Review & Merge'],
  },
  {
    title: 'Dashboard',
    tasks: ['Design Layout', 'Build Header & Nav', 'Build Data Widgets', 'Connect to Data API', 'Review & Merge'],
  },
];

const POINT_COMBOS = [
  [8, 3, 2],
  [5, 5, 3],
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distributeHours(count, total, minPerItem = 6) {
  if (count === 0) return [];
  if (total < count * minPerItem) total = count * minPerItem; // safety clamp
  const hours = new Array(count).fill(minPerItem);
  let remaining = total - minPerItem * count;
  for (let i = 0; i < count - 1 && remaining > 0; i++) {
    const cap = Math.min(remaining, Math.ceil(remaining / (count - i)) + 4);
    const add = Math.floor(Math.random() * (cap + 1));
    hours[i] += add;
    remaining -= add;
  }
  hours[count - 1] += remaining;
  return shuffle(hours);
}

function buildTasks(storyId, storyIndex, taskHours) {
  const taskCount = taskHours.length;
  const writeTestsSlot = Math.floor(Math.random() * taskCount);
  const taskPool = shuffle([...STORIES[storyIndex].tasks]);
  let poolIdx = 0;

  return taskHours.map((hours, i) => {
    const isWriteTests = i === writeTestsSlot;
    return {
      id: `task-${storyIndex}-${i}`,
      storyId,
      name: isWriteTests ? 'Write Tests' : taskPool[poolIdx++],
      estimatedHours: hours,
      progressHours: 0,
      status: 'todo',
      isWriteTests,
      isBug: false,
      changed: false,
      startedAt: null,
      completedAt: null,
    };
  });
}

export function generateSprint() {
  const pointCombo = shuffle(pick(POINT_COMBOS));

  // Decide task counts per story (2 or 3)
  const taskCounts = [0, 1, 2].map(() => (Math.random() < 0.5 ? 2 : 3));
  const totalTasks = taskCounts.reduce((a, b) => a + b, 0);

  // Distribute 80 hours directly across all tasks (min 6h each)
  const allHours = distributeHours(totalTasks, 80, 6);

  // Assign business values: generate sorted descending so P1 gets highest
  const rawValues = [0, 1, 2]
    .map(() => (Math.floor(Math.random() * 26) + 10) * 100)
    .sort((a, b) => b - a);

  // Build stories, slicing allHours as we go
  let hourCursor = 0;
  const stories = [0, 1, 2].map((i) => {
    const id = `story-${i}`;
    const taskHours = allHours.slice(hourCursor, hourCursor + taskCounts[i]);
    hourCursor += taskCounts[i];
    return {
      id,
      priority: i + 1,
      title: STORIES[i].title,
      storyPoints: pointCombo[i],
      businessValue: rawValues[i],
      tasks: buildTasks(id, i, taskHours),
      startedAt: null,
      completedAt: null,
    };
  });

  // Disruption event windows are derived from task hour sums (not a story property)
  const story1TaskHours = stories[0].tasks.reduce((s, t) => s + t.estimatedHours, 0);
  const story2TaskHours = stories[1].tasks.reduce((s, t) => s + t.estimatedHours, 0);

  const story2NonWriteTasks = stories[1].tasks.filter((t) => !t.isWriteTests);
  const story3NonWriteTasks = stories[2].tasks.filter((t) => !t.isWriteTests);

  const disruptionEvents = [
    {
      id: 'disruption-1',
      storyId: stories[1].id,
      targetTaskId: pick(story2NonWriteTasks).id,
      firesAt: Math.floor(Math.random() * story1TaskHours),
      triggered: false,
    },
    {
      id: 'disruption-2',
      storyId: stories[2].id,
      targetTaskId: pick(story3NonWriteTasks).id,
      firesAt: Math.floor(Math.random() * (story1TaskHours + story2TaskHours)),
      triggered: false,
    },
  ];

  return { stories, disruptionEvents };
}
