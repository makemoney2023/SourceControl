export class JarvisExecError extends Error {
  readonly code: string;

  constructor(message: string, code = "exec_error") {
    super(message);
    this.name = "JarvisExecError";
    this.code = code;
  }
}
