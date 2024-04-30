import { app } from '@/http/app';
import { env } from '@saas/env';

app.listen(env.SERVER_PORT, () => {
	console.log(
		`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
	);
});
