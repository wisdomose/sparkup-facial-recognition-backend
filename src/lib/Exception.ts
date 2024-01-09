export default class Exception extends Error {
  code;
  message;

  constructor({ code, message }: { code: number; message: string }) {
    super();
    this.code = code;
    this.message = message;
  }
}
