import { JSX, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import InputField from '../components/common/InputField';

const Login = (): JSX.Element => {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold select-none">Dragon Vault</h1>

        <img
          className="pointer-events-none w-32 fill-zinc-300 select-none"
          src="/icon.svg"
          alt="Dragon Vault Icon"
        />
      </div>

      <InputField
        id="username-input"
        value={usernameInput}
        onChange={setUsernameInput}
        placeholder="Username"
        disabled={isLoading}
      />

      <InputField
        id="password-input"
        type="password"
        value={passwordInput}
        onChange={setPasswordInput}
        placeholder="Password"
        disabled={isLoading}
      />

      <Button
        displayText="Log In"
        onClick={() => navigate('campaigns')}
        disabled={!usernameInput || !passwordInput}
        hidden={!usernameInput || !passwordInput}
        loading={isLoading}
      />
    </div>
  );
};

export default Login;
