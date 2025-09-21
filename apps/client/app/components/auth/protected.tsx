import { useEffect, type PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { authClient } from '~/lib/auth-client';

const { useSession } = authClient;
type Props = PropsWithChildren & {};
const Protected: React.FC<Props> = ({ children }) => {
	const { data: session, isPending, error } = useSession();
	const navigate = useNavigate();
	const location = useLocation();
	// todo: add loader
	useEffect(() => {
		if (!isPending && (!session || error)) {
			navigate(`/signin?redirect=${encodeURIComponent(location.pathname)}`, {
				replace: true,
			});
		}
	}, [session, isPending, error]);
	//  if (isPending) return Loader;
	return children;
};

export default Protected;
