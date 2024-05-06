import {Request, Response, NextFunction} from "express";
import {EncryptDto} from "@dto/Encrypt.dto";
import {DecryptDto} from "@dto/Decrypt.dto";
import {EncryptResponce, DecryptResponce, GenerateResponse} from "../types/response";
import {CryptoCache} from "@service/redis/crypt.cache";
import {v4 as uuidv4} from 'uuid';
import { publicEncrypt, privateDecrypt, generateKeyPairSync } from "crypto"
import HttpException from "../exceptions/HttpException";
export async function encryptHandler(
    request: Request<{}, {}, EncryptDto>,
    response: Response<EncryptResponce>,
    next: NextFunction
) {
    // Encrypt
    try {
        const buffer = Buffer.from(JSON.stringify(request.body.data), 'utf-8')
        const encrypted = publicEncrypt(request.body.publicKey, buffer);

        // Save
        const db_client = new CryptoCache()
        const object_id = uuidv4()
        await db_client.saveEncryptedCache(
            object_id,
            encrypted.toString('base64')
        ).catch(async (error) => {
            next(new HttpException(500, error.message))
        })

        // Response
        response.status(201).send({
            objectId: object_id
        })

        } catch (error) {
            if (error instanceof Error){
                next(new HttpException(400, error.message))
            }
        }
    }

export async function decryptHandler(
    request: Request<{}, {}, DecryptDto>,
    response: Response<DecryptResponce>,
    next: NextFunction
) {
    try {
        // Get
        const db_client = new CryptoCache()
        const data = await db_client.getDecryptedCache(request.body.objectId).catch(async (error) => {
            next(new HttpException(500, error.message))
        })

        if (!data){
            response.status(404).send({
                error: "Object not found",
                data: {}
            })
            return
        }

        //Decrypt
        const encrypted = privateDecrypt(request.body.privateKey, Buffer.from(data!, 'base64'));

        // Answer
        const parsedData: Record<string, any> = JSON.parse(encrypted.toString());
        response.status(200).send({
            data: parsedData
        })
    } catch (error) {
        if (error instanceof Error){
            next(new HttpException(400, error.message))
        }
    }
}

export function generateHandler(
    request: Request,
    response: Response<GenerateResponse>,
    next: NextFunction
) {
    try {
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 4096, // длина модуля в битах
            publicKeyEncoding: {
                type: 'pkcs1', // или 'spki' для SubjectPublicKeyInfo (современный формат)
                format: 'pem' // или 'der'
            },
            privateKeyEncoding: {
                type: 'pkcs1', // или 'pkcs8' для PrivateKeyInfo (современный формат)
                format: 'pem' // или 'der'
            }
        });

        response.status(200).send({
            publicKey: publicKey,
            privateKey: privateKey
        })

    } catch (error) {
        if (error instanceof Error){
            next(new HttpException(400, error.message))
        }
    }
}

