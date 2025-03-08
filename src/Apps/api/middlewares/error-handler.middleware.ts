import { ExternalServiceError } from "../../../Contexts//Shared/domain/errors/external-service.error";
import { InvalidArgumentError } from "../../../Contexts/Shared/domain/errors/invalid-argument.error";
import { EntityNotFoundError } from "../../../Contexts/Shared/domain/errors/not-found.error";
import { DomainError } from "../../../Contexts/Shared/domain/errors/domain-error";
import { Request, Response, NextFunction } from "express";

export class HttpErrorResponse {
  constructor(
    public readonly statusCode: number,
    public readonly message: string,
    public readonly errorType: string,
    public readonly details?: Record<string, any>
  ) {}
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof DomainError) {
    const errorResponse = mapDomainErrorToHttpResponse(err);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.errorType,
      message: errorResponse.message,
      ...(errorResponse.details && { details: errorResponse.details }),
    });
    return;
  }
  console.error("Unexpected error:", err);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    details: err.message,
  });
}

function mapDomainErrorToHttpResponse(error: DomainError): HttpErrorResponse {
  if (error instanceof InvalidArgumentError) {
    return new HttpErrorResponse(400, error.message, error.errorType());
  }

  if (error instanceof EntityNotFoundError) {
    return new HttpErrorResponse(404, error.message, error.errorType());
  }

  if (error instanceof ExternalServiceError) {
    return new HttpErrorResponse(502, error.message, error.errorType(), {
      serviceName: error.serviceName,
    });
  }

  return new HttpErrorResponse(500, error.message, error.errorType());
}
