import { URL } from 'url'
import LinkValidator from '../link-validator.validator.js'

export class DomainValidator extends LinkValidator {
  private readonly domain: string

  constructor (domain: string) {
    super()
    this.domain = domain
  }

  validate (url: string): boolean {
    const hostname = new URL(url).hostname

    if (!this.domain.includes(hostname)) {
      return false
    }

    if (this.next != null) {
      return this.next.validate(url)
    }

    return true
  }
}
