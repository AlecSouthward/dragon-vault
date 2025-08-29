import { JSX, useState } from 'react';

import { Value } from '../../types/stats';

import { valueToString } from '../../utils/Stats';

import Button from '../../components/common/Button';
import Container from '../../components/common/Container';
import ProgressBar from '../../components/common/ProgressBar';

const Characters = (): JSX.Element => {
  const [resourceBars] = useState<Value[]>([
    {
      name: 'Health',
      value: 100,
      maxValue: 100,
      type: 'fractional',
    },
    {
      name: 'Soul Health',
      value: 100,
      maxValue: 100,
      type: 'fractional',
    },
    {
      name: 'Energy',
      value: 100,
      type: 'percentage',
      identifier: ' seconds',
    },
  ]);

  return (
    <Container className="w-max flex-col p-4 select-none">
      <h1 className="mb-6 text-3xl">Starting Character Template</h1>

      <Container className="flex-col gap-y-4 p-4">
        <h1 className="text-xl">Resource Pools</h1>

        {resourceBars.map((resourceBar) => (
          <div key={resourceBar.name} className="flex flex-col">
            <p>{resourceBar.name}</p>
            <p className="font-bold">{valueToString(resourceBar)}</p>

            {(resourceBar.type === 'fractional' ||
              resourceBar.type === 'percentage') && (
              <ProgressBar
                maxValue={resourceBar.maxValue as number}
                value={resourceBar.value as number}
                className="w-full"
              />
            )}
          </div>
        ))}

        <Button className="mt-4">Add Resource Pool</Button>
      </Container>
    </Container>
  );
};

export default Characters;
