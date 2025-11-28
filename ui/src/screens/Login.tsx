import React, { JSX, useState } from 'react';

import RoutePaths from '../constants/routePaths';

import { useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import InputField from '../components/common/InputField';

const Login = (): JSX.Element => {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading] = useState(false);

  const handleLogin = (evt: React.FormEvent<HTMLFormElement>): void => {
    if (!usernameInput || !passwordInput) return;

    evt.preventDefault();

    navigate(RoutePaths.CAMPAIGNS);
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="mb-6 flex flex-col items-center">
        <h1 className="pb-4 text-5xl font-bold select-none">Dragon Vault</h1>

        <img
          className="fill-light-white pointer-events-none w-32 select-none"
          src="/icon.svg"
          alt="Dragon Vault Icon"
        />
      </div>

      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center justify-center"
      >
        <InputField
          id="username-input"
          value={usernameInput}
          onValueChange={setUsernameInput}
          placeholder="Username"
          disabled={isLoading}
        />

        <InputField
          id="password-input"
          type="password"
          value={passwordInput}
          onValueChange={setPasswordInput}
          placeholder="Password"
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={!usernameInput || !passwordInput}
          hidden={!usernameInput || !passwordInput}
          loading={isLoading}
        >
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;
