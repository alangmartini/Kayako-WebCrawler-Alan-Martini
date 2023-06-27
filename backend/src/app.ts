import { UrlLoaderService } from './services/url-loader.service.js'
import { Crawler } from './services/crawler.service.js'
import { Command } from 'commander'

interface AppParameters {
  url: string
  depth: number
  word: string
  tabs: number
}

export const DEFAULT_URL = 'https://www.kayako.com/'
export const DEFAULT_WORD = 'kayako'
export const DEFAULT_DEPTH = 2
export const DEFAULT_TABS = 3

export class App {
  /* istanbul ignore next */
  constructor (
    private readonly urlLoader: UrlLoaderService,
    private readonly command = new Command()
  ) {
  }

  parseCli (argv: readonly string[] = process.argv): AppParameters {
    this.command
      .requiredOption('-u, --url <url>', 'URL to load', DEFAULT_URL)
      .requiredOption('-w, --word <word>', 'Word to search', DEFAULT_WORD)
      .requiredOption('-d, --depth <depth>', 'Scan depth', `${DEFAULT_DEPTH}`)
      .requiredOption('-t --tabs <tabs>', 'Parallel tabs', `${DEFAULT_TABS}`)

    this.command.parse(argv)

    const options = this.command.opts()

    return { url: options.url, depth: options.depth, word: options.word, tabs: options.tabs }
  }

  async run (): Promise<void> {
    const appParameters = this.parseCli()

    await this.process(appParameters)
  }

  async process (appParameters: AppParameters): Promise<void> {
    const { url, word, depth, tabs } = appParameters

    const crawler = new Crawler(
      this.urlLoader,
      url,
      depth,
      word,
      tabs
    )

    await crawler.bfs()

    const count = crawler.count

    console.log(`Found ${count} instances of 'kayako' in the body of the page`)
  }
}
