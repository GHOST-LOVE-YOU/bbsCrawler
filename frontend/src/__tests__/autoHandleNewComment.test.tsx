import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import prisma from "../lib/db";
import { autoHandleNewComment } from "../lib/messages/server-utils";

// Mock the prisma client
vi.mock("../lib/db", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    post: {
      findUnique: vi.fn(),
    },
    inbox: {
      upsert: vi.fn(),
    },
    message: {
      create: vi.fn(),
    },
    notificationRule: {
      findMany: vi.fn(),
    },
    userBinding: {
      findMany: vi.fn(),
    },
    comment: {
      findFirst: vi.fn(),
    },
  },
}));

describe("autoHandleNewComment", () => {
  const mockComment = {
    id: "015f55d5-afde-4935-8e85-1b2a6764ff66",
    userId: "bot-user-id",
    postId: "post-id",
    content: "Test comment content",
  };

  const mockCommentAuthor = {
    id: "bot-user-id",
    name: "Bot User",
    tag: ["bot"],
  };

  const mockPost = {
    id: "post-id",
    topic: "Test Post Topic",
    user: {
      id: "post-author-id",
      name: "Post Author",
      tag: ["bot"],
    },
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Set up mock implementations
    (prisma.user.findUnique as any).mockResolvedValue(mockCommentAuthor);
    (prisma.post.findUnique as any).mockResolvedValue(mockPost);
    (prisma.inbox.upsert as any).mockResolvedValue({ id: "inbox-id" });
    (prisma.message.create as any).mockResolvedValue({});
    (prisma.notificationRule.findMany as any).mockResolvedValue([]);
    (prisma.userBinding.findMany as any).mockResolvedValue([]);
    (prisma.comment.findFirst as any).mockResolvedValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle a new comment successfully", async () => {
    const result = await autoHandleNewComment(mockComment as any);

    expect(result).toEqual({ created: true, comment: mockComment });

    // Verify that the necessary database operations were called
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockComment.userId },
    });
    expect(prisma.post.findUnique).toHaveBeenCalledWith({
      where: { id: mockComment.postId },
      include: { user: true },
    });
    expect(prisma.inbox.upsert).toHaveBeenCalled();
    expect(prisma.message.create).toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    // Simulate an error by rejecting one of the database operations
    (prisma.user.findUnique as any).mockRejectedValue(
      new Error("Database error")
    );

    const result = await autoHandleNewComment(mockComment as any);

    expect(result).toEqual({
      created: false,
      error: "Database error",
    });
  });

  it("should not process if comment author or post author is not a bot", async () => {
    const nonBotUser = { ...mockCommentAuthor, tag: [] };
    (prisma.user.findUnique as any).mockResolvedValue(nonBotUser);

    const result = await autoHandleNewComment(mockComment as any);

    expect(result).toEqual({
      created: false,
      error: "Comment author or post author is not a bot",
    });
  });

  // Add more tests here to cover different scenarios, such as:
  // - Testing the notification sending logic
  // - Testing the quoted comment handling
  // - Testing different types of notification rules
});
