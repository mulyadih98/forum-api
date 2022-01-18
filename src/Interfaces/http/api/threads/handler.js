const { response } = require('@hapi/hapi/lib/validation');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h){
    const addThreadUseCaase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const {title,body} = request.payload;
    const addedThread = await addThreadUseCaase.execute({title,body,owner});
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      }
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;