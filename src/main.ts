import * as core from '@actions/core'
import {Agent, Options, state} from './agent'

async function run(): Promise<void> {
  try {
    const [owner, repo] = core
      .getInput('repository', {required: true})
      .split('/')

    const opts: Options = {
      baseUrl: core.getInput('base-url'),
      owner,
      repo,
      environment: core.getInput('environment'),
      environmentUrl: core.getInput('environment-url'),
      deploymentId: parseInt(core.getInput('deployment-id')),
      state: core.getInput('state', {required: true}) as state,
      token: core.getInput('token', {required: true})
    }

    const agent = new Agent(opts)
    const status = await agent.run()

    core.setOutput('deployment-status-id', status.id)
    core.setOutput('node-id', status.node_id)
    core.setOutput('state', status.state)
    core.setOutput('url', status.url)
  } catch (err: any) {
    core.setFailed(err.message)
    core.debug(err.stack)
  }
}

run()
