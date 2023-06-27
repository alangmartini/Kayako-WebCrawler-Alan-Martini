import * as path from 'path'
import { URL } from 'url'
import LinkValidator from '../link-validator.validator.js'

export class ExtensionValidator extends LinkValidator {
  private readonly disallowedExtensions: string[]

  constructor (disallowedExtensions: string[] = ['.pdf']) {
    super()
    this.disallowedExtensions = disallowedExtensions
  }

  validate (url: string): boolean {
    const pathname = new URL(url).pathname
    const extension = path.extname(pathname)

    if (this.disallowedExtensions.includes(extension)) {
      return false
    }

    if (this.next != null) {
      return this.next.validate(url)
    }

    return true
  }
}
