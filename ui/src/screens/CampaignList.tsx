import { JSX, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';

import { Campaign } from '../types/dto';

import RoutePaths from '../constants/RoutePaths';

import { useNavigate } from 'react-router-dom';

import Button from '../components/common/Button';
import Container from '../components/common/Container';
import CreateCampaignMenu from '../components/menu/CreateCampaignMenu';
import useCampaign from '../hooks/useCampaign';

const CampaignList = (): JSX.Element => {
  const navigate = useNavigate();
  const { setSelectedCampaign } = useCampaign();

  const [campaigns] = useState<Campaign[]>([]);
  const [createCampaignMenuOpen, setCreateCampaignMenuOpen] = useState(false);

  const handleCampaignClick = (campaign: Campaign): void => {
    setSelectedCampaign(campaign);
    navigate(RoutePaths.CAMPAIGNS); // TODO: Navigate to the Campaign (editor or viewer)
  };

  return (
    <>
      <div className="flex flex-1 flex-col items-center pt-8 pb-22 select-none">
        <h1 className="mb-6 text-6xl font-bold">Your Campaigns</h1>

        {campaigns.map((campaign) => (
          <Container
            key={campaign.id}
            className="mb-5 max-h-28 w-128 items-center justify-around p-5"
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
          </Container>
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
