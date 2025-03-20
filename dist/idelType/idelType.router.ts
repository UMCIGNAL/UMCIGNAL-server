import Router from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json('idleType Router');
});

// router.post('/addIdleType', addIdleTypeController);

export default router;