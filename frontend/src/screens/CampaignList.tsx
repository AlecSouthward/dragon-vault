import { JSX, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { Campaign } from '../types/dto';

import useCampaign from '../hooks/useCampaign';

import Button from '../components/common/Button';
import CreateCampaignMenu from '../components/menu/CreateCampaignMenu';

const CampaignList = (): JSX.Element => {
  const navigate = useNavigate();
  const { setSelectedCampaign } = useCampaign();

  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '2',
      name: 'Shadow Slave',
    },
    {
      id: '3',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '4',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '5',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '6',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '7',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
    {
      id: '8',
      name: 'Shadow Slave',
      description:
        'A dangerous world, where those known as Awakened rule over the common folk. There is also the Dream Realm, which only Awakened are able to access. The Dream Realm is filled with an uncountable number of horrific nightmarish creatures.',
    },
  ]);
  const [createCampaignMenuOpen, setCreateCampaignMenuOpen] = useState(false);

  const handleCampaignClick = (campaign: Campaign): void => {
    setSelectedCampaign(campaign);
    navigate('/campaign');
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center pt-8 pb-22 select-none">
        <h1 className="mb-6 text-6xl font-bold">Your Campaigns</h1>

        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-light-black border-light-white mb-5 flex max-h-28 w-128 items-center justify-around rounded-sm border-2 p-5"
          >
            <div className="flex flex-1 flex-col justify-between">
              <p className="text-3xl">{campaign.name}</p>
              <p className="text-1xl max-h-11 max-w-90 overflow-y-clip leading-3 text-ellipsis opacity-[0.5]">
                {campaign.description}
              </p>
            </div>

            <button
              onClick={() => handleCampaignClick(campaign)}
              className="border-light-white cursor-pointer rounded-sm border-2 p-1.5"
            >
              <FaArrowRight className="h-5 w-5" />
            </button>
          </div>
        ))}

        {campaigns.length === 0 && <h1 className="text-4xl">None found.</h1>}

        <Button
          onClick={() => setCreateCampaignMenuOpen(true)}
          className="shadow-light-black fixed bottom-8 shadow-lg"
        >
          Create Campaign
        </Button>
      </div>

      <CreateCampaignMenu
        onClose={() => setCreateCampaignMenuOpen(false)}
        open={createCampaignMenuOpen}
      />
    </>
  );
};

export default CampaignList;
