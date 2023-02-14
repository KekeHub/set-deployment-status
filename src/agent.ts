import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import {inspect} from 'util'

interface Status {
  id: number
  node_id: string
  state: state
  url: string
}

export type state =
  | 'inactive'
  | 'error'
  | 'failure'
  | 'in_progress'
  | 'queued'
  | 'pending'
  | 'success'

export interface Options {
  baseUrl?: string
  deploymentId: number
  environment?: string
  environmentUrl?: string
  owner: string
  repo: string
  state: state
  token: string
}

export class Agent {
  #github

  constructor(private opts: Options) {
    this.#github = getOctokit(opts.token, {
      baseUrl: opts.baseUrl
    })
  }

  async run(): Promise<Status> {
    const {repo, owner, deploymentId, environmentUrl, state: s} = this.opts

    core.debug('creating status')
    const {data} = await this.#github.rest.repos.createDeploymentStatus({
      owner,
      repo,
      deployment_id: deploymentId,
      environment_url: environmentUrl,
      state: s
    })

    core.debug(`Created deployment status ${inspect(data)}`)
    return data as Status
  }
}
