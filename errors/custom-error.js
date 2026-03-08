class CustomAPIError extends Error {
  constructor(message, stausCode) {
    super(message);
    this.statusCode = stausCode;
  }
}

const createCustomError = (msg, statusCode) => {
  return new CustomAPIError(msg, statusCode);
};

module.exports = { CustomAPIError, createCustomError };
