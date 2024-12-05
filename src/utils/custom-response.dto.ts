export class CustomResponseDto<T> {
    statusCode: number;
    message: string;
    data: T | null;
    meta: PaginationMeta | null; // Add meta for pagination-related information
    error: string[] | null;

    constructor(
        statusCode: number,
        message: string,
        data: T | null,
        meta: PaginationMeta | null,
        error: string[] | null,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.meta = meta;
        this.error = error;
    }
}

export class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;

    constructor(page: number, limit: number, total: number) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}
