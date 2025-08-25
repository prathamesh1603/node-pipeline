const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors , json,printf,prettyPrint} = format;
const {MongoDB} = require('winston-mongodb');
const dotenv = require('dotenv');
dotenv.config();

function buildProdLogger(traceId){
    const myFormat = printf(({level, message,timestamp})=>{
         return `${timestamp} [${traceId}] ${level}:${message}`;
    });

    return createLogger({
        format: combine(
            timestamp(),
            errors({stack:true}),
            json(),
            prettyPrint()
        ),
        defaultMeta:{service:'user-service'},
        transports:[
              new transports.Console({
                 level:'info'
              }),
              new MongoDB({
                  level:'info',
                  db: process.env.MONGO_URI,
                  options:{useUnifiedTopology:true},
                  collection:'productionLogs',
                  metaKey:'metaData',
                  format: format.combine(format.timestamp(),format.json())
              })
        ]
    })
}

module.exports = buildProdLogger;