const GetComment = require('../GetComment');

describe('GetComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
    };
    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      username: {},
      date: 'tanggal test',
    };

    // Action and Assert
    expect(() => new GetComment(payload)).toThrowError(
      'GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create GetComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'test content comment',
      username: 'user-123',
      date: 'tanggal test',
    };

    // Action
    const getComment = new GetComment(payload);
    // Assert
    expect(getComment).toBeInstanceOf(GetComment);
    expect(getComment.id).toEqual(payload.id);
    expect(getComment.content).toEqual(payload.content);
    expect(getComment.username).toEqual(payload.username);
    expect(getComment.date).toEqual(payload.date);
  });
});
