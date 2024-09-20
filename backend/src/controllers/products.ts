import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/product';
import { Error as MongooseError } from 'mongoose';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.status(200).send({ items: products, total: products.length });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { title, image, category, description, price }: IProduct = req.body;

  try {
    const product = await Product.create({ title, image, category, description, price });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Такой товар уже существует'));
    }
    return next(new InternalServerError('Не удалось создать продукт'));
  }
};