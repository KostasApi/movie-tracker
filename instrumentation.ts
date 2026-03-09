export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[instrumentation] Node.js runtime initialized');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('[instrumentation] Edge runtime initialized');
  }
}

export async function onRequestError(
  error: { digest: string },
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string },
) {
  console.error('[instrumentation] Request error:', {
    digest: error.digest,
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
}
