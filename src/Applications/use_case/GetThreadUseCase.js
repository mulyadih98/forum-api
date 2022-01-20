const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    const comment = await this._commentRepository.getCommentsByThread(
      useCasePayload
    );
    thread.comments = comment;
    return thread;
  }
}

module.exports = GetThreadUseCase;
