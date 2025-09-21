import type { PropsWithChildren } from 'react';
import { authClient } from '~/lib/auth-client';

const { useSession } = authClient;

type Props = PropsWithChildren & {};
const SignedOut: React.FC<Props> = ({ children }) => {
	const { data: session } = useSession();
	return session ? null : children;
};

export default SignedOut;
