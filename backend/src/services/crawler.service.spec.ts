import { Crawler } from './crawler.service.js'
import { UrlLoaderService } from './url-loader.service.js'
import LinkValidator from './url-validating/link-validator.validator.js'
// import { ExtensionValidator } from './url-validating/validators/extension-validator.validator.js'
// import { DomainValidator } from './url-validating/validators/domain-validator.validator.js'
import { mock, MockProxy } from 'jest-mock-extended'

let urlLoader: MockProxy<UrlLoaderService>
let linkValidator: MockProxy<LinkValidator> & LinkValidator
// let domainValidator: MockProxy<DomainValidator> & DomainValidator
// let extensionValidator: MockProxy<ExtensionValidator> & ExtensionValidator
let crawler: Crawler

const URL_EXAMPLE = 'http://example.com'
const URL_EXAMPLE_LINK1 = 'http://example.com/link1'
const URL_EXAMPLE_LINK2 = 'http://example.com/link2'

beforeEach(() => {
  urlLoader = mock<UrlLoaderService>()
  linkValidator = mock<LinkValidator>()
  // domainValidator = mock<DomainValidator>()
  // extensionValidator = mock<ExtensionValidator>()
  crawler = new Crawler(urlLoader, URL_EXAMPLE, 2, 'kayako', 1)
})

test('Crawler.countWord should count occurrences of word', () => {
  const text = 'Kayako is a helpdesk platform. Kayako is awesome.'
  const count = crawler.countWord(text)
  expect(count).toBe(2)
})

test('Crawler.createLinkValidatorChain creates a chain of validators', () => {
  const createdLinkValidator = crawler.createLinkValidatorChain()
  expect(createdLinkValidator).toBeInstanceOf(LinkValidator)
})

test('Crawler has correct properties', () => {
  const crawlerTest = new Crawler(urlLoader, URL_EXAMPLE)

  expect(crawlerTest.depth).toBe(2)
  expect(crawlerTest.word).toBe('kayako')
  expect(crawlerTest.tabsToUse).toBe(1)
})

test('Crawler.bfs should crawl the website and count words, mocked', async () => {
  linkValidator.validate.mockReturnValue(true)
  urlLoader.loadUrlTextAndLinks.mockResolvedValue({ text: 'kayako', links: [URL_EXAMPLE_LINK1, URL_EXAMPLE_LINK2] })

  await crawler.bfs()

  expect(urlLoader.loadUrlTextAndLinks).toHaveBeenCalledTimes(3)
  expect(crawler.count).toBe(3)
})

test('Dont crawl beyong initial link when validation failed', async () => {
  urlLoader.loadUrlTextAndLinks.mockResolvedValue({ text: 'kayako', links: ['http://uglylink.com/link1', 'http://uglylink.com/link1'] })

  await crawler.bfs()

  expect(urlLoader.loadUrlTextAndLinks).toHaveBeenCalledTimes(1)
  expect(crawler.count).toBe(1)
})

test('Crawler.bfs should crawl the website and count words', async () => {
  urlLoader.loadUrlTextAndLinks
    .mockResolvedValueOnce({ text: 'kayako', links: [URL_EXAMPLE_LINK1, URL_EXAMPLE_LINK2] })
    .mockResolvedValueOnce({ text: 'kayako', links: ['http://example.com/link3', 'http://example.com/link4'] })
    .mockResolvedValue({ text: 'kayako', links: [] })

  await crawler.bfs()

  expect(urlLoader.loadUrlTextAndLinks).toHaveBeenCalledTimes(5)
  expect(crawler.count).toBe(5)
})

test('Crawler.processUrl should process a URL and return new links', async () => {
  urlLoader.loadUrlTextAndLinks.mockResolvedValue({ text: 'kayako', links: [URL_EXAMPLE_LINK1, URL_EXAMPLE_LINK2] })

  const newLinks = await crawler.processUrl(URL_EXAMPLE, 0)

  expect(urlLoader.loadUrlTextAndLinks).toHaveBeenCalledWith(URL_EXAMPLE)
  expect(newLinks).toHaveLength(2)
})
