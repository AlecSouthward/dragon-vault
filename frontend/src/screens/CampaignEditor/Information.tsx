import { JSX, useState } from 'react';

import Container from '../../components/common/Container';
import InputField from '../../components/common/InputField';
import InputTextArea from '../../components/common/InputTextArea';
import useCampaign from '../../hooks/useCampaign';

const Information = (): JSX.Element => {
  const { selectedCampaign } = useCampaign();

  const [loadingInfo] = useState(false);
  const [campaignName, setCampaignName] = useState(
    selectedCampaign?.name ?? ''
  );
  const [campaignDescription, setCampaignDescription] = useState(
    selectedCampaign?.description ?? ''
  );

  return (
    <Container className="w-min flex-col p-4 select-none">
      <h1 className="text-3xl font-bold">Campaign Information</h1>

      <div className="mt-6 flex flex-1/2 flex-col">
        <label htmlFor="campaign-name" className="text-xl">
          Campaign Name
        </label>

        <InputField
          id="campaign-name"
          disabled={loadingInfo}
          value={campaignName}
          onValueChange={setCampaignName}
          width="xl"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="campaign-description" className="text-xl">
          Campaign Description
        </label>

        <InputTextArea
          id="campaign-description"
          disabled={loadingInfo}
          value={campaignDescription}
          onValueChange={setCampaignDescription}
          height="xl"
          width="8xl"
        />
      </div>
    </Container>
  );
};

export default Information;
