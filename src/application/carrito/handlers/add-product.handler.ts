import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddProductCommand } from '../commands/add-product.command';
import { CarritoRepository } from '../../../domain/carrito/carrito.repository';
import { ResponseUtil } from '../../../application/utilities/response.util'; // Ajusta ruta

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(private readonly carritoRepository: CarritoRepository) {}

  async execute(command: AddProductCommand) {
    const addedProduct = this.carritoRepository.addProduct(command.productId);

    if (!addedProduct) {
      // Aquí lanzamos el error controlado, con ResponseUtil.error
      return ResponseUtil.error('Producto no encontrado', 404);
    }

    // Si todo ok, devolvemos success con el producto agregado
    return ResponseUtil.success(addedProduct, 'Producto agregado al carrito');
  }
}
