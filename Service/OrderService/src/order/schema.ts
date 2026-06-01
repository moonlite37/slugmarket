import { ObjectType, Field, ID, InputType, Float, Int } from 'type-graphql';

@ObjectType()
export class OrderItem {
  @Field(() => String)
  	listingId!: string;

  @Field(() => String)
  	title!: string;

  @Field(() => Float)
  	price!: number;

  @Field(() => Int)
  	quantity!: number;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  	id!: string;

  @Field(() => String)
  	shopper!: string;

  @Field(() => String)
  	seller!: string;

  @Field(() => String, { nullable: true })
  	shopperName?: string;

  @Field(() => String, { nullable: true })
  	shopperEmail?: string;

  @Field(() => [OrderItem])
  	items!: OrderItem[];

  @Field(() => Float)
  	total!: number;

  @Field(() => String)
  	status!: string;

  @Field(() => String)
  	created!: string;
}

@InputType()
export class OrderItemInput {
  @Field(() => String)
  	listingId!: string;

  @Field(() => String)
  	title!: string;

  @Field(() => Float)
  	price!: number;

  @Field(() => Int)
  	quantity!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => String)
  	shopper!: string;

  @Field(() => String)
  	seller!: string;

  @Field(() => String, { nullable: true })
  	shopperName?: string;

  @Field(() => String, { nullable: true })
  	shopperEmail?: string;

  @Field(() => [OrderItemInput])
  	items!: OrderItemInput[];

  @Field(() => Float)
  	total!: number;
}
