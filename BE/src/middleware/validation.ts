import { Request, Response, NextFunction } from "express";

export function validateContentType(expectedType: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.headers["content-type"];
    
    if (!contentType?.includes(expectedType)) {
      res.status(415).json({ 
        error: `Content-Type must be ${expectedType}` 
      });
      return;
    }
    
    next();
  };
}
