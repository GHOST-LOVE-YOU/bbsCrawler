import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { autoGetPost } from '@lib/posts/server-utils';
import { autoAddComment } from '@lib/comments/server-utils';
import handleCrawlTask from '@lib/tasks/crawlTask';

// Mock the dependencies
vi.mock('axios');
vi.mock('@lib/posts/server-utils', () => ({
  autoGetPost: vi.fn(),
}));
vi.mock('@lib/comments/server-utils', () => ({
  autoAddComment: vi.fn(),
}));

describe('handleCrawlTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success when crawl is successful', async () => {
    const mockData = {
      data: {
        data: [
          {
            byr_id: '123',
            topic: 'Sample Topic',
            time: '2024-08-05T12:00:00Z',
            author: 'JohnDoe',
            comments: [
              {
                author: 'Commenter1',
                content: 'Nice post!',
                floor: 1,
                like: 10,
                dislike: 0,
                time: '2024-08-05T12:01:00Z',
              },
            ],
          },
        ],
      },
      status: 200,
    };

    (axios.request as any).mockResolvedValue(mockData);

    (autoGetPost as any).mockResolvedValue({
      post: { id: 'post-id' },
    });

    const result = await handleCrawlTask();

    expect(result).toEqual({ success: true });
    expect(axios.request).toHaveBeenCalled();
    expect(autoGetPost).toHaveBeenCalledWith({
      byr_id: '123',
      topic: 'Sample Topic',
      createdAt: '2024-08-05T12:00:00Z',
      userName: 'JohnDoe',
    });
    expect(autoAddComment).toHaveBeenCalledWith(
      {
        userName: 'Commenter1',
        content: 'Nice post!',
        floor: 1,
        like: 10,
        dislike: 0,
        time: '2024-08-05T12:01:00Z',
      },
      'post-id'
    );
  });

  it('should return an error when crawl fails', async () => {
    (axios.request as any).mockResolvedValue({
      status: 500,
    });

    const result = await handleCrawlTask();

    expect(result).toEqual({
      success: false,
      error: 'Crawl failed',
    });
    expect(axios.request).toHaveBeenCalled();
  });
});
