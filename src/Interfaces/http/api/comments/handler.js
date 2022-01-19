const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { content } = request.payload;
    const { threadId: thread_id } = request.params;
    const { id: owner } = request.auth.credentials;
    const addedComment = await addCommentUseCase.execute({
      content,
      thread_id,
      owner,
    });
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = CommentsHandler;
