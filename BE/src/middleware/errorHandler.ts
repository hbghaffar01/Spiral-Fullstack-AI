import { Request, Response } from "express";
import { ErrorResponse } from "../types";

export function errorHandler(err: Error, _req: Request, res: Response<ErrorResponse>): void {
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ error: message });
}

export function notFoundHandler(req: Request, res: Response<ErrorResponse>): void {
  res.status(404).json({ error: "Endpoint not found" });
}
