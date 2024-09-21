import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

interface OrderRequest {
   
    total: number;
    items: string[];


}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { total, items }: OrderRequest = req.body;
  
    try {
      const products = await Product.find({ _id: { $in: items } });
      if (products.length !== items.length) {
        return next(new BadRequestError('Один или несколько элементов не существуют'));
      }
  
      const productsTotal = products.reduce((sum, product) => {
        if (product.price != null) {
          return sum + product.price;
        }
        return sum;
      }, 0);
  
      if (productsTotal !== total) {
        return next(new BadRequestError('Не сходиться общая сумма'));
      }
  
      const orderId = faker.string.uuid();
      return res.status(201).send({
        id: orderId,
        total: productsTotal,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('E11000')) {
        return next(new ConflictError('Ошибка значения поля'));
      }
      next(error);
    }
  };
  
  export default createOrder;