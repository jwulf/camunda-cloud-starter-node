import { config } from 'dotenv'
config()

const { app } = require('./rest/server')
import * as sendemail from './sendemail'
import * as decision from './decision-gateway'
import * as parallelmulti from './parallel-multi-instance'
import * as rollback from './rollback'
import { getZBClient } from './lib/credentials'

/**
 * Package.json uses nodemon when started with npm start
 * This reloads the entire application when the Camunda Cloud credentials are updated
 * in the .env file.
 */

const hydratedClient = getZBClient()

if (hydratedClient.exists) {
  const { zbc, value: { zeebeAddress } } = hydratedClient
  sendemail.startWorkers(zbc)
  sendemail.deployProcess(zbc)
  sendemail.createRestEndpoints({ zbc, zeebeAddress, app })
  decision.deployProcess(zbc)
  decision.startWorkers(zbc)
  decision.createRestEndpoints({ app, zbc, zeebeAddress })
  parallelmulti.deployProcess(zbc)
  parallelmulti.startWorkers(zbc)
  parallelmulti.createRestEndpoints({ app, zbc, zeebeAddress })
  rollback.deployProcess(zbc)
  rollback.startWorkers(zbc)
  rollback.createRestEndpoints({ app, zbc, zeebeAddress })
}

