const GetThread = require('../GetThread');

describe('a GetThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'content test',
      comments: [],
    };
    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 132,
      body: true,
      comments: 'test',
      title: 'asdasd',
      date: 'asddas',
      username: 123,
    };

    // Action and Assert
    expect(() => new GetThread(payload)).toThrowError(
      'GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create getThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'test-thread-123',
      title: 'test title',
      body: 'test body',
      date: new Date().toISOString(),
      username: 'test-user',
      comments: [],
    };
    // Action
    const getThread = new GetThread(payload);
    // Assert
    expect(getThread.id).toEqual(payload.id);
    expect(getThread.title).toEqual(payload.title);
    expect(getThread.body).toEqual(payload.body);
    expect(getThread.date).toEqual(payload.date);
    expect(getThread.username).toEqual(payload.username);
    expect(getThread.comments).toEqual(payload.comments);
  });
});
