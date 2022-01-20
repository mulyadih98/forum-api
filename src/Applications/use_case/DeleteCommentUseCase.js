class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    const { id, owner, thread } = useCasePayload;
    await this._threadRepository.getThreadById(thread);
    await this._commentRepository.verifyCommentOwner({ id, owner });
    await this._commentRepository.deleteComment(id);
  }

  async _validatePayload(payload) {
    const { id, owner, thread } = payload;
    if (!id || !owner || !thread) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PAYLOAD');
    }
  }
}

module.exports = DeleteCommentUseCase;
