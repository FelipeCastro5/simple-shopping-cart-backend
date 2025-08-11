export class ResponseDto<T = any> {
  status: number; // Código de estado HTTP
  msg: string; // Mensaje descriptivo (de éxito o error)
  data: T | null; // Datos en caso de éxito (o null)

  constructor(status: number, msg: string, data: T | null = null) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}
