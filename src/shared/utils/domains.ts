export function assertDomainIsValid(domain: string): void {
  // Validate domain
  if (!domain) {
    throw new Error('Domain is required');
  }

  // Validate that domain is valid (example.com)
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error('Domain is invalid');
  }
}
