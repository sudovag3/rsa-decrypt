import { z } from 'zod';

export const decryptSchema = z.object({
    privateKey: z.string(),
    objectId: z.string()
});