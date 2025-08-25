const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const {MongoDB} = require('winston-mongodb');
const dotenv = require('dotenv');
dotenv.config();
function buildDevLogger(){
    
    
    return createLogger({
        level: 'info',
        format: combine(
            timestamp({ format: "HH:mm:ss" }),
        ),
       
        transports: [
            new transports.Console(),
            // new transports.File({ filename: 'testlogs.log' })
            //logs in mongodb
            new MongoDB({
                level:'info',
                db: process.env.MONGO_URI,
                options: {useUnifiedTopology:true},
                collection : 'testLogs',
                metaKey: 'meta',
                format : format.combine(format.timestamp(),format.json())
            })
        ],
        

    });
}




module.exports = buildDevLogger;
