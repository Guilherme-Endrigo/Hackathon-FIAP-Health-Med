import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { HttpMethod } from '../enums/http.method.enum';
import { ResponseBody } from '../interfaces/response.body.interface';
import { buildResponse } from './build.response';
@Injectable()
export class RequestService {
    constructor(private readonly client: HttpService) { }

    async makeRequest<T, R>(
        microserviceUrl: string,
        method: HttpMethod,
        endpoint: string,
        data?: T,
        language?: string,
    ): Promise<ResponseBody<R>> {
        try {
            const result = await firstValueFrom(
                this.client.request({
                    method,
                    url: `${microserviceUrl}/${endpoint}`,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        language: language || 'pt',
                    },
                }),
            );
            return buildResponse<R>(
                result.status,
                result.data.data ? result.data.data : result.data,
                result.data.message,
                result.data.errors,
            );
        } catch (error) {
            return buildResponse<R>(
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
                error?.data || {},
                error?.message || 'Internal server error',
                error?.errors || [],
            );
        }
    }
}
