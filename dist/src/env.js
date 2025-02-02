import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';
// const stringBoolean = z.coerce
//   .string()
//   .transform((val) => {
//     return val === 'true';
//   })
//   .default('false');
const EnvSchema = z.object({
    NODE_ENV: z.string().default('development'),
    APP_PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
});
expand(config());
try {
    EnvSchema.parse(process.env);
}
catch (error) {
    if (error instanceof ZodError) {
        let message = 'Missing required values in .env:\n';
        error.issues.forEach((issue) => {
            message += issue.path[0] + '\n';
        });
        const e = new Error(message);
        e.stack = '';
        throw e;
    }
    else {
        console.error(error);
    }
}
export default EnvSchema.parse(process.env);
//# sourceMappingURL=env.js.map