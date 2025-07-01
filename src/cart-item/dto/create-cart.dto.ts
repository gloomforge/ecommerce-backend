import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateCartDto {
  @IsUUID('4', {})
  @IsNotEmpty({ message: 'ProductId обязателен к заполнению' })
  productId: string;

  @IsInt({ message: 'quantity должен быть целым числом' })
  @Min(1, { message: 'quantity должен быть не меньше 1' })
  quantity: number;
}
