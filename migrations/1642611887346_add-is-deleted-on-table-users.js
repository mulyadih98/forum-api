/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('comments', {
    is_deleted: {
      type: 'boolean',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('comments', 'is_deleted', {
    ifExists: true,
  });
};
