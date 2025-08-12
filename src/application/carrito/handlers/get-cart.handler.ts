import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetCartCommand } from '../commands/get-cart.command';
import { CarritoRepository } from '../../../domain/carrito/carrito.repository';
import { ResponseUtil } from '../../../application/utilities/response.util'; // Ajusta ruta

@CommandHandler(GetCartCommand)
export class GetCartHandler implements ICommandHandler<GetCartCommand> {
  constructor(private readonly carritoRepository: CarritoRepository) {}

  async execute(command: GetCartCommand) {
    const cart = this.carritoRepository.getCart();
    return ResponseUtil.success(cart, 'Carrito obtenido correctamente');
  }
}
