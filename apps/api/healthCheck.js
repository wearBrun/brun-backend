import express from 'express';
const healthCheckrouter=express.Router()
import {healthCheckService} from '../services/healthCheck.js'

healthCheckrouter.route('/health-check').get(healthCheckService)

export default healthCheckrouter