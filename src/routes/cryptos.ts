import {Router} from "express";
import {decryptHandler, encryptHandler, generateHandler} from "../handlers/cryptos";
import {validateData} from "../middleware/validation.middleware";
import {encryptSchema} from "../schemas/encryptSchema";
import {decryptSchema} from "../schemas/decryptSchema";

const router = Router()

/**
 * @swagger
 * /encrypt:
 *  post:
 *    description: Encrypt data with public key
 *    tags: [Encrypt]
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/definitions/encrypt'
 *    responses:
 *      400:
 *        Description: 'Validation Error'
 *      500:
 *        Description: 'Server Error'
 *      201:
 *        Description: 'Data encrypted successfully'
 */
router.post('/encrypt', validateData(encryptSchema), encryptHandler);

/**
 * @swagger
 * /decrypt:
 *  post:
 *    description: Decrypt data with private key
 *    tags: [Encrypt]
 *    produces:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/definitions/decrypt'
 *    responses:
 *      400:
 *        Description: 'Validation Error'
 *      500:
 *        Description: 'Server Error'
 *      201:
 *        Description: 'Data encrypted successfully'
 */
router.post('/decrypt', validateData(decryptSchema), decryptHandler)


/**
 * @swagger
 * /generate:
 *  post:
 *    description: Generate RSA key pair
 *    tags: [Generate]
 *    responses:
 *      400:
 *        Description: 'Validation Error'
 *      500:
 *        Description: 'Server Error'
 *      200:
 *        Description: 'Key pair created successfully'
 */
router.post('/generate', generateHandler)

export default router