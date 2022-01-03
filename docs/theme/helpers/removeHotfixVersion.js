module.exports = {
  removeHotfixVersion: function (options) {
    return options.fn(this).split('.').slice(0, 2).join('.');
  }
};
