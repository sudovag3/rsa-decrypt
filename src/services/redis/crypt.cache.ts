import Logger from 'bunyan';
import {BaseCache} from '@service/redis/base.cache';
import {config} from '../../config';
import e from "express";

const log: Logger = config.createLogger('cryptoCache');

export class CryptoCache extends BaseCache {
    constructor() {
        super('cryptoCache');
    }

    public async saveEncryptedCache(key: string, data: string): Promise<void> {
        try {
            if (!this.client.isOpen) {
                log.info(`Connecting to Redis...`)
                await this.client.connect();
            }
            await this.client.SET(key, data);
            await this.client.EXPIRE(key, 60*60)
        } catch (error) {
            log.error(error);
            throw new Error(`Server error. Contact with support team.`);
        }
    }

    public async getDecryptedCache(key: string): Promise<string|null> {
        try {
            if (!this.client.isOpen) {
                log.info(`Connecting to Redis...`)
                await this.client.connect();
            }
            log.info(`Getting object...`)
            const res =  await this.client.GET(key)
            if (res){
                await this.client.DEL(key)
            }
            return res
        } catch (error) {
            log.error(error);
            throw new Error('Server error. Contact with support team.');
        }
    }
}