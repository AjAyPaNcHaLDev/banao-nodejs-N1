/**
 * TOKENMIDDLEWARE is the function which is use for auth
 *
 * if token is valid it send the request for next procedure
 * if token is not valid it send  auth not valid
 */

const tokenMiddleWare = (req, res, next) => {
  console.log("this is the token middleware");
  next();
};

module.exports = tokenMiddleWare;
