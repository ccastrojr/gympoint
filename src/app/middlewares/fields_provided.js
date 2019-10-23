export default (req, res, next) => {
   if (
      Object.entries(req.body).length === 0 &&
      req.body.constructor === Object
   ) {
      return res.status(400).json({ error: 'Fields not provided' });
   }

   return next();
};
