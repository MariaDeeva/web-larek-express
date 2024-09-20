import { celebrate, Joi, Segments } from 'celebrate';

export const createOrderValidator = celebrate({
    [Segments.BODY]: Joi.object().keys({
        payment: Joi.string().valid('card', 'online').required(),
        email: Joi.string().email().required(),
        phone: Joi.string().pattern(/^\+7\d{10}$/).required(),
        address: Joi.string().required(),
        total: Joi.number().positive().required(),
        items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    }),
})