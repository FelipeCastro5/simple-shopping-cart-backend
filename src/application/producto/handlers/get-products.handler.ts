import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetProductsCommand } from '../commands/get-products.command';
import { PRODUCTS, Producto } from '../../../domain/producto/products.data';
import { ResponseUtil } from '../../../application/utilities/response.util'; // Ajusta ruta

@CommandHandler(GetProductsCommand)
export class GetProductsHandler implements ICommandHandler<GetProductsCommand> {
  async execute(command: GetProductsCommand): Promise<any> {
    return ResponseUtil.success(PRODUCTS, 'Lista de productos obtenida');
  }
}
