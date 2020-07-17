const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'My App' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      //Send errors here
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      //Send anything above warning here
      new winston.transports.File({ filename: 'logs/warnings.log', level: 'warn' }),
      //Everything here
      new winston.transports.File({ filename: 'logs/combined.log' }),
      //Save error to database and pass in database details
      new winston.transports.MongoDB({db: 'mongodb://localhost:37017/vidly'})
    ]
  });

    //Log express errors
    function error(err, req, res, next){
        logger.error(err.message, err);
        console.log(err.message, err);
        res.status(500).send('Something failed.');
        process.exit(1); //11. We could also exit the application to reset everything
        // Note in production we would need to use tools called "Process Managers" these tools will automatically restart our app if it is exited.
    }
    // //Log uncaught sync exception
    process.on('uncaughtException', (ex) =>{
        console.log('An uncaught exception occurred ');
        logger.error(ex.message, ex);
        process.exit(1); //12. We could also exit the application to reset everything 
        //Note in production we would need to use tools called "Process Managers" these tools will automatically restart our app if it is exited.
    });
    // //throw new Error('Something failed during startup.');

    //1. The code above will only catch sync errors
    //2. That means if we are using async e.g. await. then the code above will not catch these error
    //3. So we want to catch any unhandled async code errors and also any Unhandled rejections
    //5. Generally we always put any async code (await) inside a try catch.
    //6. If we do this for all awaits then all these errors should be caught 
    //7. But just in case we have any unhandled rejections it good practice to write some code to catch these
    //8. Add the following code
    process.on('unhandledRejection', (ex) =>{
      console.log('An uncaught rejection occurred ');
      logger.error(ex.message, ex);
    });
    //9. Lets now create unhandled rejection to test this.
    //const p = Promise.reject(new Error('The promise was rejected!'));
    //p.then(()=> console.log('Done'));
    //10. Test the application and check the rejection is logged
    //13. Done!

//Error Middleware
module.exports = error;