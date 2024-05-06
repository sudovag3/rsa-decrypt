import dotenv from 'dotenv';
import bunyan from 'bunyan';
import * as process from 'process';

dotenv.config({});

class Config {
    public PORT: string | undefined;
    public REDIS_HOST: string | undefined;
    public SWAGGER_OPTS: object

    constructor() {
        this.PORT = process.env.PORT || '5000';
        this.REDIS_HOST = process.env.REDIS_HOST;
        this.SWAGGER_OPTS = {
            definition: {
                openapi: "3.1.0",
                info: {
                    title: "De/Encrypt Utils for SimplePay",
                    version: "0.1.0",
                    description:
                        "This is a simple API application for RSA crypt operations",
                    license: {
                        name: "MIT",
                        url: "https://spdx.org/licenses/MIT.html",
                    },
                    contact: {
                        name: "Andrey Sudov"
                    },
                },
                servers: [
                    {
                        url: "http://localhost:3000",
                    },
                ],
            },
            apis: ["./src/routes/cryptos.ts", './src/swagger.yml'],
        };
    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({name, level: 'debug', serializers: bunyan.stdSerializers});
    }

    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }
}

export const config: Config = new Config();