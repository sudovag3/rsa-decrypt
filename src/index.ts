import express from 'express';
import bunyanMiddleware from 'bunyan-middleware'
import cryptoRoutes from "./routes/cryptos";
import {config} from "./config";
import bodyParser from "body-parser";
import errorMiddleware from "./middleware/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc"
import cors from "cors"

const app = express();
const logger = config.createLogger("rsa-api-util")

app.use(cors())
app.use(bunyanMiddleware(
    { headerName: 'X-Request-Id'
        , propertyName: 'reqId'
        , logName: 'req_id'
        , obscureHeaders: []
        , logger: logger
        , additionalRequestFinishData: function(req, res) {
            return { example: true }
        }
    }
))
app.use(bodyParser.json())
app.use('', cryptoRoutes)
const specs = swaggerJsdoc(config.SWAGGER_OPTS);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);
app.use(errorMiddleware)

app.listen(config.PORT, () => {})