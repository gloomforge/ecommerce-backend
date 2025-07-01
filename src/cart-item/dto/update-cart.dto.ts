import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsInt({ message: 'quantity должен быть целым числом' })
  @Min(1, { message: 'quantity должен быть не менее 1' })
  quantity?: number;
}
