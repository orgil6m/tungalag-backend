class MyError extends Error {
  statusCode = 500;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 500;
  }
}

export default MyError;
