class GetComment {
  constructor(payload) {
    this._veriifyPayload(payload);
    const { id, content, username, date } = payload;
    this.id = id;
    this.content = content;
    this.username = username;
    this.date = date;
  }

  _veriifyPayload({ id, content, username, date }) {
    if (!id || !content || !username || !date) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string'
    ) {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComment;
