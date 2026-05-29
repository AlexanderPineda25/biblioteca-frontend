function generateId() {
  if (typeof self !== 'undefined' && self.crypto && self.crypto.randomUUID) {
    return self.crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

let correlationId = generateId();

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
