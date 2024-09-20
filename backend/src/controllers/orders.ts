import { faker } from '@faker-js/faker';
import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

interface OrderRequest {
    payment: 'card' | 'online';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];


}const isValidEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const isValidPhone = (phone: string) => /^\+7\d{10}$/.test(phone);

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { payment, email, phone, address, total, items }: OrderRequest = req.body;
  const phoneFormatted: string = phone.replace(/[^\d+]/g, '');

  try {
    // Validate input data
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Неверный способ оплаты'));
    }
    if (!isValidEmail(email)) {
      return next(new BadRequestError('Неверная почта'));
    }
    if (!isValidPhone(phoneFormatted)) {
      return next(new BadRequestError(`Неверный номер телефона ${phoneFormatted}`));
    }
    if (!address) {
      return next(new BadRequestError('Укажите адрес'));
    }
    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Список не может быть пустым'));
    }
    if (typeof total !== 'number' || total <= 0) {
      return next(new BadRequestError('Неверная итоговая сумма'));
    }

   
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
    return res.status(200).send({
      id: orderId,
      total: productsTotal,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Ошибка значения поля'));
    }
    return next(new InternalServerError('Не удалось создать заказ'));
  }
};

export default createOrder;