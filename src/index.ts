import { Hono } from 'hono';
import { admin } from './lib/auth';
import { registerAuthRoutes } from './routes/auth';
import { registerDashboardRoutes } from './routes/dashboard';
import { registerBotsRoutes } from './routes/bots';
import { registerWebhookRoutes } from './routes/webhook';
import { registerHomepageRoutes } from './routes/homepage';
import { registerUsersRoutes } from './routes/users';
import { registerBroadcastRoutes } from './routes/broadcast';
import { registerCommandsRoutes } from './routes/commands';
import { registerLogsRoutes } from './routes/logs';

export type Bindings = { DB: D1Database };
export type App = Hono<{ Bindings: Bindings }>;
export const app: App = new Hono<{ Bindings: Bindings }>();

registerAuthRoutes(app);
app.use('*', async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (['/login', '/setup', '/api/health'].includes(path) || path.startsWith('/telegram/webhook/')) return next();
  if (!(await admin(c))) return c.redirect('/login');
  return next();
});
registerDashboardRoutes(app);
registerBotsRoutes(app);
registerWebhookRoutes(app);
registerHomepageRoutes(app);
registerUsersRoutes(app);
registerBroadcastRoutes(app);
registerCommandsRoutes(app);
registerLogsRoutes(app);

export default app;
