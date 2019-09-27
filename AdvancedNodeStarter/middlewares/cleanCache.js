const { clearHash } = require('../services/redis');


module.exports = async (req, res, next) => {
  // Express follows the route handler pattern which ends up with the CRUD operations to happen
  // However if you await next(), this allows all the route handler function execute first before returning to this 
  // portion. This effectively makes this middleware function like an endware.
  await next();
  console.log('clearing cache for specific key.');
  clearHash(req.user.id)
};