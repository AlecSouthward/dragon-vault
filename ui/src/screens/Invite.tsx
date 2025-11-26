import { JSX, useState } from 'react';

import RoutePaths from '../constants/RoutePaths';

import { useNavigate, useParams } from 'react-router-dom';

import Button from '../components/common/Button';
import Container from '../components/common/Container';
import InputField from '../components/common/InputField';

const Invite = (): JSX.Element => {
  const navigate = useNavigate();
  const { id: inviteId } = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUseInvite = async (
    evt: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    evt.preventDefault();

    setError(null);

    if (!username || !password) {
      setError('Username and password are required.');

      return;
    }

    setLoading(true);

    // TODO: Call API
    console.warn('Attempted to consume invite: ', inviteId);
    await navigate(RoutePaths.LOGIN);
  };

  return (
    <div className="mt-4 flex h-full max-w-128 flex-col items-center justify-center self-center select-none">
      <Container className="flex-col items-center p-8">
        <img
          className="fill-light-white pointer-events-none h-32 w-32 self-center select-none"
          src="/icon.svg"
          alt="Dragon Vault Icon"
        />

        <h4 className="mt-5 text-5xl">
          Welcome to <b>Dragon Vault</b>!
        </h4>

        <h1 className="mb-4 text-center text-2xl">
          Enter your details to create an account:
        </h1>

        <form
          onSubmit={handleUseInvite}
          className="flex flex-col items-center justify-center"
        >
          <InputField
            id="username"
            disabled={loading}
            value={username}
            placeholder="Username"
            onValueChange={setUsername}
          />
          <InputField
            id="password"
            disabled={loading}
            type="password"
            value={password}
            placeholder="Password"
            className={`transition-[margin] ${error ? 'mb-5' : 'mb-2'}`}
            onValueChange={setPassword}
          />

          <p
            className={`text-light-red text-xl font-bold transition-opacity ${error ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}
          >
            {error}
          </p>

          <Button
            type="submit"
            loading={loading}
            className={`transition-[margin] ${error ? 'mt-5' : 'mt-2'}`}
          >
            Submit
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Invite;
