import { Controller, Get } from '@nestjs/common';
import { OrderService } from 'src/domain/use-cases/order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService,
    ) { }

    @Get('preparation')
    async orderPreparation() {
        const order = await this.orderService.getOrdersPreparation();
        return order;
    }
}
