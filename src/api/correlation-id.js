let correlationId = self.crypto.randomUUID();

export function getCorrelationId() {
  return correlationId;
}

export function setCorrelationId(id) {
  correlationId = id;
}

export function correlationIdInterceptor(config) {
  config.headers = config.headers || {};
  config.headers['X-Correlation-Id'] = correlationId;
  return config;
}
