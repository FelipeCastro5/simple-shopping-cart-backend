import { Historial } from './historial.entity';

export interface HistorialInterface {
  insertHistorial(fk_user: number, question: string, answer: string): Promise<Historial>;
  getLastFive(): Promise<Historial[]>;
}
