const AddComment = require('../../Domains/comment/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, thread_id, owner } = new AddComment(useCasePayload);
    await this._threadRepository.getThreadById(thread_id);
    const comment = await this._commentRepository.addComment({
      content,
      thread_id,
      owner,
    });
    return comment;
  }
}

module.exports = AddCommentUseCase;
