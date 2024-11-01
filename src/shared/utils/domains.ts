// Validate that domain is valid (example.com)
const DOMAIN_REGEX = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;

export function assertDomainIsValid(domain: string): void {
  // Validate domain
  if (!domain) {
    throw new Error('Domain is required');
  }

  if (!DOMAIN_REGEX.test(domain)) {
    throw new Error('Domain is invalid');
  }
}
