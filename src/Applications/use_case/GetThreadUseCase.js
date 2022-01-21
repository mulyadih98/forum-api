const GetThread = require('../../Domains/threads/entities/GetThread');
const GetComment = require('../../Domains/comment/entities/GetComment');
const { reject } = require('bcrypt/promises');

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
    thread.comments = await comment.map((element) => {
      if (element.is_deleted) {
        return new GetComment({
          ...element,
          content: '**komentar telah dihapus**',
        });
      }
      return new GetComment(element);
    });
    return new GetThread(thread);
  }
}

module.exports = GetThreadUseCase;
