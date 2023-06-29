import { mock } from 'jest-mock-extended'
import { DomainValidator } from './validators/domain-validator.validator'
import { ExtensionValidator } from './validators/extension-validator.validator'
import LinkValidator from './link-validator.validator.js'

// Mocking the LinkValidator class
const mockValidator = mock<LinkValidator>()
const URL_EXAMPLE = 'https://example.com'
const DOMAIN_EXAMPLE = 'example.com'

describe('LinkValidator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('validate method without chain', () => {
    const validator = new LinkValidator()

    const result = validator.validate(URL_EXAMPLE)

    expect(result).toBe(true)
  })

  test('validate method', () => {
    mockValidator.validate.mockReturnValue(true)

    const validator = new LinkValidator()
    validator.setNext(mockValidator)

    expect(validator.validate(URL_EXAMPLE)).toBe(true)
    expect(mockValidator.validate).toHaveBeenCalledWith(URL_EXAMPLE)
  })
})

describe('DomainValidator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('validate method without chain', () => {
    const validator = new DomainValidator(DOMAIN_EXAMPLE)

    const result = validator.validate(URL_EXAMPLE)

    expect(result).toBe(true)
  })

  test('validate method with invalid domain', () => {
    const validator = new DomainValidator(DOMAIN_EXAMPLE)
    expect(validator.validate('https://invalid.com')).toBe(false)
  })

  test('validate next function is called', () => {
    mockValidator.validate.mockReturnValue(true)

    const validator = new DomainValidator(DOMAIN_EXAMPLE)
    validator.setNext(mockValidator)

    expect(validator.validate(URL_EXAMPLE)).toBe(true)
    expect(mockValidator.validate).toHaveBeenCalledWith(URL_EXAMPLE)
  })
})

describe('ExtensionValidator', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('validate method with disallowed extension', () => {
    const validator = new ExtensionValidator()
    expect(validator.validate('https://example.com/test.pdf')).toBe(false)
  })

  test('validate method with allowed extension', () => {
    mockValidator.validate.mockReturnValue(true)

    const validator = new ExtensionValidator()
    validator.setNext(mockValidator)

    expect(validator.validate('https://example.com/test.jpg')).toBe(true)
    expect(mockValidator.validate).toHaveBeenCalledWith('https://example.com/test.jpg')
  })
})
