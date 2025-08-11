export class UpdateActivityCommand {
  constructor(
    public readonly id: number,
    public readonly fk_user: number | null,
    public readonly fk_proj: number,
    public readonly activity: string,
  ) {}
}
