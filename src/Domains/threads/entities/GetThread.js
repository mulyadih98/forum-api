class GetThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, username, id, date, comments } = payload;

    this.title = title;
    this.body = body;
    this.id = id;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ title, body, username, id, date, comments }) {
    if (!title || !body || !username || !id || !date || !comments) {
      throw new Error('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string' ||
      typeof id !== 'string' ||
      typeof date !== 'string' ||
      typeof comments !== 'object'
    ) {
      throw new Error('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThread;
