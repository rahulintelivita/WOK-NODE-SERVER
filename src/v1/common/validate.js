export function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const rawMessage = error.details[0].message;
            const cleanMessage = rawMessage.replace(/"/g, ''); 
            return next({
                message: cleanMessage,
                statusCode: 400
            });
        }
        next();
    };
}