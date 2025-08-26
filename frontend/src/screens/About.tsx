import { JSX } from 'react';
import { FaDice } from 'react-icons/fa';
import { PiGithubLogoLight } from 'react-icons/pi';

import ExternalLinks from '../constants/ExternalLinks';

const About = (): JSX.Element => (
  <div className="mt-4 flex h-full max-w-138 flex-col items-center justify-center self-center select-none">
    <FaDice className="absolute h-64 w-64 self-center opacity-[0.1]" />

    <img
      className="fill-light-white pointer-events-none mb-4 w-24 select-none"
      src="/icon.svg"
      alt="Dragon Vault Icon"
    />

    <h1 className="text-4xl font-bold">About Dragon Vault</h1>

    <p className="mt-2 text-center text-xl">
      <b>Dragon Vault</b> is an open-source self-hosted website; created
      specifically for managing/playing Dungeons & Dragons campaigns remotely
      (through voice calls).
    </p>

    <p className="mt-2 text-center text-xl">
      Because of this, it is designed to be as flexible possible so that even
      the most abnormal and complex campaigns could be hosted on it.
    </p>

    <hr className="mt-6 mb-5 w-32" />

    <p className="mt-2 mb-8 text-center text-xl">
      For those that would like to contribute or view the project, here is the
      <br />
      GitHub Repository link:
    </p>

    <a
      className="border-light-white flex items-center gap-x-4 rounded-sm border-2 px-4 py-2 text-2xl"
      href={ExternalLinks.GITHUB_LINK}
      target="_blank"
    >
      Dragon Vault GitHub
      <PiGithubLogoLight />
    </a>
  </div>
);

export default About;
