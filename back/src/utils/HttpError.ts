// Error con código HTTP: los services lo lanzan y el handler central lo traduce a respuesta.
export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'HttpError';
    }
}

export const badRequest = (msg: string) => new HttpError(400, msg);
export const forbidden = (msg: string) => new HttpError(403, msg);
export const notFound = (msg: string) => new HttpError(404, msg);
export const conflict = (msg: string) => new HttpError(409, msg);
