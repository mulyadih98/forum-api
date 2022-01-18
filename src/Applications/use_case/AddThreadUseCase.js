const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({threadRepository}){
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const storeThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(storeThread);
  }
}

module.exports = AddThreadUseCase;