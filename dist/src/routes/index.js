import { Router } from 'express';
import categoryRoutes from './categoryRoutes';
import terminologyRoutes from './terminologyRoutes';
import userRoutes from './userRoutes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const router = Router();
router.use(categoryRoutes);
router.use(terminologyRoutes);
router.use(userRoutes);
// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        myapi: '3.0.0',
        info: {
            title: 'Medisync API',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['../../build/src/routes/index.js'], // files containing annotations as above
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
export default router;
//# sourceMappingURL=index.js.map