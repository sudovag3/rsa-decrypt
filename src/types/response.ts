export interface EncryptResponce {
    objectId: string;
}

export interface DecryptResponce {
    data: object;
    error?: string;
}
export interface GenerateResponse {
    publicKey: string;
    privateKey: string;
}