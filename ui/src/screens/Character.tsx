import { JSX, useState } from 'react';

import { Character as CharacterType } from '../types/dto';

import { formatSignedNumber, getRollBonus } from '../utils/stats';

import Container from '../components/common/Container';
import Image from '../components/common/Image';
import ProgressBar from '../components/common/ProgressBar';
import useCampaign from '../hooks/useCampaign';

const Character = (): JSX.Element => {
  const { selectedCampaign } = useCampaign();

  const [character] = useState<CharacterType>({
    name: 'Lune',
    icon: 'https://pics.craiyon.com/2023-05-25/55749b8c5b984abd80dbd274f121df5d.webp',
    class: 'Warrior',
    race: 'Human',
    level: 1,
    exp: 25,
    alive: true,
    resourcePools: [
      { name: 'Health', value: 25, maxValue: 50 },
      { name: 'Soul Health', value: 94, maxValue: 100 },
      { name: 'Soul Essence', value: 94, descriptor: '%' },
      { name: 'Armor Durability', value: 23 },
    ],
    abilityStats: [
      { name: 'Strength', score: 20 },
      { name: 'Dexterity', score: 11 },
      { name: 'Speed', score: 4 },
      { name: 'Wisdom', score: 9 },
    ],
    combatStats: [
      { name: 'Initiative', value: 2 },
      { name: 'Attack', value: '1d10+1' },
    ],
    items: [
      { name: 'Silver Bell', bonus: 1, applier: '1d100' },
      { name: 'Gun', applier: 200, applierDescriptor: 'AP' },
    ],
    features: [
      { name: 'Second Wind', description: 'Become one with the wind' },
      { name: 'Action Boost', description: 'Perform another action in 1 turn' },
    ],
    skills: [
      { name: 'Athletics', modifier: 2 },
      { name: 'Perception', modifier: 4 },
    ],
  });

  const expLevelMulti = selectedCampaign?.characterDetails.expLevelMulti;
  const maxExp = (expLevelMulti ?? Infinity) * character.level;

  return (
    <div className="mt-6 w-2/3 self-center select-none">
      <Container className="h-28 items-center justify-between px-6 py-4">
        <div className="flex flex-1">
          <Image src={character.icon} alt="character icon" size="sm" />

          <div className="mt-1 ml-4 flex flex-col">
            <p className="text-3xl">{character.name}</p>
            <p className="text-xl opacity-[0.8]">
              Level {character.level} {character.race} {character.class}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
          <p className="text-lg opacity-[0.8]">Experience</p>
          <p className="mb-1 text-2xl font-bold">
            {character.exp} / {maxExp}
          </p>

          <ProgressBar maxValue={maxExp} value={character.exp} />
        </div>
      </Container>

      <div className="my-4 flex h-min w-full flex-1 gap-4">
        <div className="flex w-full flex-col gap-4">
          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Core Stats</h1>

            <div className="my-4 flex flex-wrap justify-center gap-x-24 gap-y-8">
              {character.abilityStats.map((abilityStat) => {
                const rollBonus = getRollBonus(abilityStat.score);
                const rollBonusSymbol = formatSignedNumber(rollBonus);

                return (
                  <div key={abilityStat.name} className="text-center">
                    <p className="text-3xl font-bold">{abilityStat.score}</p>
                    <p className="text-xl opacity-[0.5]">{abilityStat.name}</p>
                    <p className="text-xl opacity-[0.5]">{rollBonusSymbol}</p>
                  </div>
                );
              })}
            </div>
          </Container>

          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Resource Pools</h1>

            <div className="my-4 flex flex-col justify-center gap-y-5">
              {character.resourcePools.map((pool) => {
                const valueRepresentation = pool.maxValue
                  ? `${pool.value} / ${pool.maxValue}`
                  : `${pool.value} ${pool.descriptor ?? ''}`;

                return (
                  <div key={pool.name} className="text-center">
                    <div className="flex justify-between pb-1">
                      <p className="text-xl">{pool.name}</p>
                      <p className="text-xl font-bold">{valueRepresentation}</p>
                    </div>

                    {pool.maxValue && (
                      <ProgressBar
                        value={pool.value}
                        maxValue={pool.maxValue}
                        className="w-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Container>

          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Skills</h1>

            <div className="my-3 flex flex-wrap justify-start gap-4 py-2">
              {character.skills.map((skill) => {
                return (
                  <Container
                    key={skill.name}
                    className="flex w-53 justify-between px-2 py-1"
                  >
                    <p className="text-xl">{skill.name}</p>
                    <p className="text-xl font-bold">
                      {formatSignedNumber(skill.modifier)}
                    </p>
                  </Container>
                );
              })}
            </div>
          </Container>
        </div>

        <div className="flex w-full flex-1/3 flex-col gap-4">
          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Combat</h1>

            <div className="my-3 flex flex-col gap-y-4">
              {character.combatStats.map((combatStat) => {
                const combatStatValueType = typeof combatStat.value;
                let combatStatValue;

                if (combatStatValueType === 'number') {
                  combatStatValue = formatSignedNumber(
                    combatStat.value as number
                  );
                } else {
                  combatStatValue = combatStat.value;
                }

                return (
                  <div key={combatStat.name} className="flex justify-between">
                    <p className="text-xl">{combatStat.name}</p>
                    <p className="text-xl font-bold">{combatStatValue}</p>
                  </div>
                );
              })}
            </div>
          </Container>

          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Equipment</h1>

            <div className="my-3 flex flex-col gap-y-4">
              {character.items.map((item) => {
                return (
                  <Container
                    key={item.name}
                    className="justify-between px-2 py-1"
                  >
                    <span className="flex gap-x-2">
                      <p className="text-xl">{item.name}</p>

                      {item.bonus && (
                        <p className="text-xl font-bold">
                          {formatSignedNumber(item.bonus)}
                        </p>
                      )}
                    </span>

                    {item.applier && (
                      <p className="text-xl font-bold">
                        {item.applier} {item.applierDescriptor}
                      </p>
                    )}
                  </Container>
                );
              })}
            </div>
          </Container>

          <Container className="h-max flex-col px-4 py-2">
            <h1 className="text-2xl">Features</h1>

            <div className="my-3 flex flex-col gap-y-4">
              {character.features.map((feature) => {
                return (
                  <Container
                    key={feature.name}
                    className="flex-col justify-between px-3 py-2"
                  >
                    <p className="text-xl">{feature.name}</p>
                    <p className="text-1xl max-w-60 overflow-x-hidden text-ellipsis whitespace-nowrap opacity-[0.5]">
                      {feature.description}
                    </p>
                  </Container>
                );
              })}
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Character;
