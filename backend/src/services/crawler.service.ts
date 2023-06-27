/* eslint-disable no-return-await, @typescript-eslint/return-await */

import { URL } from 'url'
import { UrlLoaderService } from './url-loader.service.js'
import { DomainValidator } from './url-validating/validators/domain-validator.validator.js'
import { ExtensionValidator } from './url-validating/validators/extension-validator.validator.js'
import LinkValidator from './url-validating/link-validator.validator.js'

interface queueItem {
  url: string
  depth: number
}

export class Crawler {
  depth: number = 0
  word: string = ''
  count: number = 0

  visited: Set<string> = new Set()

  rootUrl: string = 'https://www.kayako.com'
  hostname: string

  constructor (
    depth = 2,
    word = 'kayako',
    private readonly urlLoader: UrlLoaderService,
    rootUrl: string
  ) {
    this.depth = depth
    this.word = word
    this.count = 0
    this.rootUrl = rootUrl
    this.hostname = new URL(rootUrl).hostname
  }

  countWord (text: string): number {
    const regex = new RegExp(this.word, 'gi')
    const matches = text.toLocaleLowerCase().match(regex) ?? []
    return matches.length
  }

  createLinkValidatorChain (): LinkValidator {
    const linkValidator = new LinkValidator()
    const domainValidator = new DomainValidator(this.hostname)
    const extensionValidator = new ExtensionValidator()

    linkValidator.setNext(domainValidator)
    domainValidator.setNext(extensionValidator)

    return linkValidator
  }

  async bfs (): Promise<void> {
    let queue: queueItem[] = [{ url: this.rootUrl, depth: 0 }]

    // Starts chain of responsibility
    const linkValidator = this.createLinkValidatorChain()

    while (queue.length > 0) {
      const tasks = []
      const urlsToProcess = queue.slice(0, 3) // adjusts the concurrency level
      queue = queue.slice(urlsToProcess.length)

      for (let { url, depth } of urlsToProcess) {
        url = url.split('#')[0]

        if (depth > this.depth || this.visited.has(url)) {
          continue
        }

        if (!linkValidator.validate(url)) {
          continue
        }

        this.visited.add(url)

        tasks.push(this.processUrl(url, depth))
      }

      const newLinks = await Promise.all(tasks)

      queue.push(...newLinks.flat())
      // let { url, depth } = queue.shift() as queueItem
    }
  }

  async processUrl (url: string, depth: number): Promise<queueItem[]> {
    const { text, links } = await this.urlLoader.loadUrlTextAndLinks(url)
    const count = this.countWord(text)
    this.count += count

    const nextDepth = depth + 1
    const newLinks: queueItem[] = []
    const queuePushCallBack = (link: string): void => {
      if (this.visited.has(link)) return
      newLinks.push({ url: link, depth: nextDepth })
    }

    links.forEach(queuePushCallBack)

    return newLinks
  }
}
