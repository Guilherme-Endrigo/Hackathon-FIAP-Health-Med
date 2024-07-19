import { Inject, Injectable } from '@nestjs/common';
import { OrderRequestService } from 'src/infrastructure/axios/order.request.service';

@Injectable()
export class OrderService {
    constructor(@Inject('OrderRequestService') private readonly orderRequestService: OrderRequestService) { }

    async getOrdersPreparation() {
        const status = "preparation";
        const orders = await this.orderRequestService.getOrdersPreparation(status);
        return orders;
    }

    async setOrderFinish(message) {
        const id = message.id;
        const status = message.status;
        
        const orders = await this.orderRequestService.setOrderFinish(id, status);

        return orders;
    }
}

