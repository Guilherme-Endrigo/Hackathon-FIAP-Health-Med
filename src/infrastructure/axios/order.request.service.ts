import { Injectable, Logger } from '@nestjs/common';
import { HttpMethod } from '../enums/http.method.enum';
import { ResponseBody } from '../interfaces/response.body.interface';
import { RequestService } from './request.service';
import { OrderResponse } from '../interfaces/order/order.response.interface';
import { OrderRequest } from '../interfaces/order/order.request.interface';

@Injectable()
export class OrderRequestService {
    private readonly logger = new Logger(OrderRequestService.name);

    constructor(private readonly requestService: RequestService) { }

    private async requestHandler(
        method: HttpMethod,
        baseLog: string,
        endpoint: string,
        body?: OrderRequest,
    ): Promise<ResponseBody<any>> {
        this.logger.debug(
            `${baseLog} calling request to order service with params ${JSON.stringify(
                body,
            )}`,
        );

        const result = await this.requestService.makeRequest<
            OrderRequest,
            any
            >(process.env.ORDER_SERVICE_URL || "http://localhost:3000", method, `${endpoint}`, body);
        this.logger.debug(
            `${baseLog} order service response ${JSON.stringify(result)}`,
        );
        if (result.statusCode !== 200) {
            throw new Error(
                `${baseLog} error while order request service: ${JSON.stringify(result.message)}`,
            );
        }

        return result.data;
    }

    async ChangeOrderForPreparation(
        id: string,
        status: string
    ): Promise<ResponseBody<OrderResponse>> {
        const baseLog = '[ChangeOrderForPreparation] -';
        return this.requestHandler(
            HttpMethod.PATCH,
            baseLog,
            `pedido`,
            { id, status}
        );
    }

    async getOrdersPreparation(        
        status: string
    ): Promise<ResponseBody<any>> {
        const baseLog = '[getOrdersPreparation] -';
        return this.requestHandler(
            HttpMethod.GET,
            baseLog,
            `orders/${status}`,
        );
    }

    async setOrderFinish(
        id: string,
        status: string
    ): Promise<ResponseBody<OrderResponse>> {
        const baseLog = '[setOrderFinish] -';
        return this.requestHandler(
            HttpMethod.PATCH,
            baseLog,
            `pedido`,
            { id, status }
        );
    }
}
