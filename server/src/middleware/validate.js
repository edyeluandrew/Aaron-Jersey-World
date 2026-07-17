export const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
    const parsed = schema.parse(data);

    if (source === 'query') {
      req.parsedQuery = parsed;
    } else if (source === 'params') {
      req.parsedParams = parsed;
    } else {
      req.body = parsed;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export function getQuery(req) {
  return req.parsedQuery ?? req.query;
}

export function getParams(req) {
  return req.parsedParams ?? req.params;
}
