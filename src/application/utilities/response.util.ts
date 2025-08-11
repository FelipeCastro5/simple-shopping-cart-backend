import { ResponseDto } from './response.dto';

export class ResponseUtil {
  static success<T>(
    data: T,
    msg = 'Operación exitosa',
    status = 200,
  ): ResponseDto<T> {
    return new ResponseDto(status, msg, data);
  }

  static error(msg: string, status = 400): ResponseDto<null> {
    return new ResponseDto(status, msg, null);
  }
}