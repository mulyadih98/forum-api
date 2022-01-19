class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { content, thread_id, owner } = payload;
    this.content = content;
    this.thread_id = thread_id;
    this.owner = owner;
  }

  _verifyPayload({ content, thread_id, owner }) {
    if (!content || !owner || !thread_id) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content != 'string' ||
      typeof thread_id != 'string' ||
      typeof owner != 'string'
    ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
