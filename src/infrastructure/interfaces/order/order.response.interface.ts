export interface ResponseBody<T> {
    statusCode: number;
    data: T;
}

export interface OrderResponse {
    Attributes: Attributes;
    ResponseMetadata: ResponseMetadata;
}

interface Attributes {
    status: string;
    id: number;
}

interface ResponseMetadata {
    RequestId: string;
    HTTPStatusCode: number;
    HTTPHeaders: HTTPHeaders;
    RetryAttempts: number;
}

interface HTTPHeaders {
    server: string;
    date: string;
    'content-type': string;
    'content-length': string;
    connection: string;
    'x-amzn-requestid': string;
    'x-amz-crc32': string;
}

