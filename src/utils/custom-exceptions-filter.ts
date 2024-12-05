import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CustomResponseDto } from './custom-response.dto';

@Catch()
export class CustomExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Determine the status code
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Format the error response
        const errorResponse = new CustomResponseDto(
            status,
            exception.response?.message || exception.message || 'Internal server error',
            null,
            null,
            exception.response?.error || null,
        );

        // Log the error for debugging (optional)
        console.error(`[${request.method}] ${request.url}`, exception);

        // Send the response
        response.status(status).json(errorResponse);
    }
}
