export class APIError {
    constructor(message, status) {
        this.message = message;
        this.status = status
    }

    badRequest() {
        return new APIError(this.message,400);
    }

    notFound() {
        return new APIError(this.message, 404);
    }

}