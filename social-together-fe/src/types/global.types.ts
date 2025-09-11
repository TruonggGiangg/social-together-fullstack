// Global generic type for all API responses
export type ResponseData<T> = {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
};
