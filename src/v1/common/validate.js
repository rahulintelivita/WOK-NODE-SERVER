// Common Joi validation middleware
export function validate(schema) {
     return (req, res, next) => {
          const { error } = schema.validate(req.body);
          if (error) {
               return next({
                    message: error.details[0].message,
                    statusCode: 400
               });
          }
          next();
     };
}
