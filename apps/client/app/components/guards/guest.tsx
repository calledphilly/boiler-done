import React, { type PropsWithChildren } from 'react';
import { Navigate, useSearchParams } from 'react-router';
import { SignedIn } from './signed-in';
import { SignedOut } from './signed-out';

type Props = {} & PropsWithChildren;
const Guest: React.FC<Props> = ({ children }) => {
	const [searchParams] = useSearchParams();

	return (
		<>
			<SignedIn>
				<Navigate to={searchParams.get('redirect') || '/'} />
			</SignedIn>
			<SignedOut>{children}</SignedOut>
		</>
	);
};

export default Guest;
