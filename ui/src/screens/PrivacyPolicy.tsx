import { JSX } from 'react';
import { MdOutlinePrivacyTip } from 'react-icons/md';

const PrivacyPolicy = (): JSX.Element => (
  <div className="mt-4 flex h-full max-w-lg flex-col items-center justify-center self-center select-none">
    <MdOutlinePrivacyTip className="absolute h-64 w-64 self-center opacity-[0.1]" />

    <p className="mt-2 text-center text-xl">
      <h1 className="text-4xl font-bold">Dragon Vault's Privacy Policy</h1>
      <br />
      It stores one cookie in your browser to authenticate you.
      <br />
      <br />
      It is not shared or used for ads.
      <br />
      <br />
      It is cleared when you log out or when it expires.
      <br />
      <br />
      You can block cookies in your browser, but then Dragon Vault will not be
      able to identify you.
      <br />
      <br />
      Contact: Alec Southward, <br />
      <a className="underline" href="mailto:alecsouthward@gmail.com">
        alecsouthward@gmail.com
      </a>
    </p>
  </div>
);

export default PrivacyPolicy;
