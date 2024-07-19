export interface ResponseBody<T> {
    statusCode: number;
    message: string;
    data: T;
    errors: string[];
}
