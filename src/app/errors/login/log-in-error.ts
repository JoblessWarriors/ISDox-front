export class LogInError extends Error {
    constructor(message: string, cause?: string) {
        super(message);
        this.name = 'Log In Error';
        this.cause = cause;
        Object.setPrototypeOf(this, LogInError.prototype);
    }
}
