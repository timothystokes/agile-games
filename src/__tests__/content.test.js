import { fetchGameContent, parseGameFrontmatter } from '../utils/content';

const SAMPLE_MD = `---
id: game-1
title: "Game 1: Alignment"
principle: "Alignment"
accentColour: "pink"
description: "Shared understanding transforms a team."
---

Optional body content.
`;

describe('parseGameFrontmatter', () => {
  it('extracts id from frontmatter', () => {
    expect(parseGameFrontmatter(SAMPLE_MD).id).toBe('game-1');
  });

  it('extracts title from frontmatter', () => {
    expect(parseGameFrontmatter(SAMPLE_MD).title).toBe('Game 1: Alignment');
  });

  it('extracts principle from frontmatter', () => {
    expect(parseGameFrontmatter(SAMPLE_MD).principle).toBe('Alignment');
  });

  it('extracts accentColour from frontmatter', () => {
    expect(parseGameFrontmatter(SAMPLE_MD).accentColour).toBe('pink');
  });

  it('extracts description from frontmatter', () => {
    expect(parseGameFrontmatter(SAMPLE_MD).description).toBe(
      'Shared understanding transforms a team.'
    );
  });

  it('returns null for malformed markdown with no frontmatter', () => {
    expect(parseGameFrontmatter('No frontmatter here')).toBeNull();
  });
});

describe('fetchGameContent', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches the correct URL for a given game id', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => SAMPLE_MD,
    });

    await fetchGameContent('game-1');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('content/game-1.md')
    );
  });

  it('returns parsed frontmatter object on success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      text: async () => SAMPLE_MD,
    });

    const result = await fetchGameContent('game-1');

    expect(result).toMatchObject({
      id: 'game-1',
      title: 'Game 1: Alignment',
      principle: 'Alignment',
      accentColour: 'pink',
    });
  });

  it('returns null when fetch fails', async () => {
    global.fetch.mockResolvedValue({ ok: false });

    const result = await fetchGameContent('game-1');

    expect(result).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const result = await fetchGameContent('game-1');

    expect(result).toBeNull();
  });
});
