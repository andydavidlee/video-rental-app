//Try catch middleware for routes
//1. Add the following code
function asyncMiddleware(handler){
    return async (req, res, next)=> {
      try{
        await handler(req, res);
      } catch (ex){
        next(ex);
      }
    }
  }

  module.exports = asyncMiddleware;
  //2. Now import the middle ware into genres.js
  //3. Open routes>genres.js