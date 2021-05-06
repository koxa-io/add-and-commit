import * as core from '@actions/core'
import fs from 'fs'

export type Input =
  | 'add'
  | 'author_name'
  | 'author_email'
  | 'branch'
  | 'cwd'
  | 'message'
  | 'pull_strategy'
  | 'push'
  | 'remove'
  | 'signoff'
  | 'tag'

export const outputs = {
  committed: 'false',
  pushed: 'false',
  tagged: 'false'
}
export type Output = keyof typeof outputs

export function getInput(name: Input) {
  return core.getInput(name)
}

export function log(err: any | Error, data?: any) {
  if (data) console.log(data)
  if (err) core.error(err)
}

/**
 * Matches the different pathspecs and arguments by removing spaces that are not inside quotes
 * @example
 * ```js
 * matchGitArgs('  first     second    "third"    \'fourth\'') => [ 'first', 'second', '"third"', "'fourth'" ]
 * matchGitArgs('      ') => [ ]
 * ```
 * @returns An array, if there's no match it'll be empty
 */
export function matchGitArgs(string: string) {
  return string.match(/(?:[^\s"]+|"[^"]*")+/g) || []
}

export function parseBool(value: any) {
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed == 'boolean') return parsed
  } catch {}
}

export function readJSON(filePath: string) {
  let fileContent: string
  try {
    fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  } catch {
    throw `Couldn't read file. File path: ${filePath}`
  }

  try {
    return JSON.parse(fileContent)
  } catch {
    throw `Couldn't parse file to JSON. File path: ${filePath}`
  }
}

export function setOutput(name: Output, value: 'true' | 'false') {
  core.debug(`Setting output: ${name}=${value}`)
  outputs[name] = value
  return core.setOutput(name, value)
}
for (const key in outputs) setOutput(key as Output, outputs[key])
