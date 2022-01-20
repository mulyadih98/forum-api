const CommentRepository = require('../../../Domains/comment/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain commentId', async () => {
    // Arrange
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(
      deleteCommentUseCase.execute({ owner: 'test-usecse-owner' })
    ).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD'
    );
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      id: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });
    // Action
    await deleteCommentUseCase.execute(useCasePayload);
    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCasePayload.thread
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith({
      id: useCasePayload.id,
      owner: useCasePayload.owner,
    });
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(
      useCasePayload.id
    );
  });
});
