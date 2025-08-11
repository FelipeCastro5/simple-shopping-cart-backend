export class PaginatedDto {
  logs: any[];
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}
