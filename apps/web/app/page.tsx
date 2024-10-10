import { auth } from '@/auth/auth';

export default async function Page() : Promise<JSX.Element> {
  const { user } = await auth();

  return (
    <div>
      <p className="text-lg text-red-900">{JSON.stringify(user, null, 2)}</p>
    </div>
  );
}
