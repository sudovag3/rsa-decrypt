import { z } from 'zod';

export const encryptSchema = z.object({
    publicKey: z.string(),
    data: z.record(z.string().or(z.number()), z.any())
});