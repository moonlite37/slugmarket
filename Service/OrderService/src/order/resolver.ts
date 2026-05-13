import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Order, CreateOrderInput } from './schema';
import { OrderService } from './service';

@Resolver()
export class OrderResolver {
  @Query(() => [Order])
	async allOrders(): Promise<Order[]> {
		return new OrderService().allOrders();
	}

  @Query(() => [Order])
  async ordersByShopper(
    @Arg('shopperId', () => String) shopperId: string,
  ): Promise<Order[]> {
  	return new OrderService().ordersByShopper(shopperId);
  }

  @Query(() => [Order])
  async ordersBySeller(
    @Arg('sellerId', () => String) sellerId: string,
  ): Promise<Order[]> {
  	return new OrderService().ordersBySeller(sellerId);
  }

  @Mutation(() => Order)
  async createOrder(
    @Arg('input', () => CreateOrderInput) input: CreateOrderInput,
  ): Promise<Order> {
  	return new OrderService().createOrder(input);
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Arg('id', () => String) id: string,
    @Arg('status', () => String) status: string,
  ): Promise<Order> {
  	return new OrderService().updateOrderStatus(id, status);
  }
}
