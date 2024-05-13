import express from 'express';
const healthCheckrouter=express.Router()
import { verifyJWT,verifyPermission } from '../../middlewares/auth.mw.js';
import {healthCheckService,healthCheckServiceAdmin,healthCheckServicePrivate} from '../services/healthCheck.js'

healthCheckrouter.route('/health-check').get(healthCheckService)
healthCheckrouter.route('/health-check/private').get(verifyJWT,healthCheckServicePrivate)
healthCheckrouter.route('/health-check/admin').get(verifyJWT,verifyPermission,healthCheckServiceAdmin)

export default healthCheckrouter