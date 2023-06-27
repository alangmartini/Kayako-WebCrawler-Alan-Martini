class LinkValidator {
  next?: LinkValidator

  setNext (validator: LinkValidator): LinkValidator {
    this.next = validator
    return validator
  }

  validate (url: string): boolean {
    if (this.next != null) {
      return this.next.validate(url)
    }

    return true
  }
}

export default LinkValidator
