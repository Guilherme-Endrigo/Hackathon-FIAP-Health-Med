import { ResponseBody } from '../interfaces/response.body.interface';

export function buildResponse<T>(
    statusCode: number,
    data: T,
    message: string,
    errors: string[],
): ResponseBody<T> {
    return {
        statusCode,
        message,
        data,
        errors,
    };
}
