import { app } from '@/http/app';

app.listen(3333, () => {
	console.log(
		`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
	);
});
