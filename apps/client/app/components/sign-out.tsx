import { useNavigate } from 'react-router';
import { signOut } from '~/utils/auth';
import { Button } from '~/components/ui/button';

const SignOut = () => {
    const navigate = useNavigate();

    const handleClick = () => signOut({
        fetchOptions: {
            onSuccess: () => {
                navigate('/sign-in');
            },
        },
    });

    return <Button onClick={handleClick}>Sign out</Button>;
};

export default SignOut;
