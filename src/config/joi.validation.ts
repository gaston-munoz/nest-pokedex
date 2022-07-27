import * as Joi from 'joi'

export const AppConfigValidationSchema = Joi.object({
    NODE_ENV: Joi.string().default('development'),
    MONGODB_URI: Joi.string().required(),
    PORT: Joi.number().default(3000),
})