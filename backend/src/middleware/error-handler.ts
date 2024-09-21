import BadRequestError from 'errors/bad-request-error';
import ConflictError from 'errors/conflict-error';
import InternalServerError from 'errors/internal-server-error';
import NotFoundError from 'errors/not-found-error';
import { Request, Response, NextFunction } from 'express';

 function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);
  
    if (
      err instanceof BadRequestError ||
      err instanceof ConflictError ||
      err instanceof InternalServerError ||
      err instanceof NotFoundError
    ) {
      return res.status(err.statusCode).json({ message: err.message });
    }
  
    return res.status(500).json({ message: 'Internal server error' });
    next(err);
  }
  export default errorHandler