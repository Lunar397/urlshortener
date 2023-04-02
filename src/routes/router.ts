import { Router } from 'express'
import { getUrls, addUrls, deleteUrl, redirectUrl } from '../controllers/urls.js'
const router: Router = Router();

router.get('/shorturls', getUrls)
router.post('/url', addUrls)
router.post('/url/delete', deleteUrl)
router.get('/:shorturl', redirectUrl)
export default router