import { FC, JSX, useEffect, useState } from 'react';

import Button from '../common/Button';
import InputBlur from '../common/InputBlur';
import InputField from '../common/InputField';
import InputTextArea from '../common/InputTextArea';
import LoadingIcon from '../common/LoadingIcon';

type CreateCampaignMenuProps = {
  open: boolean;
  onClose: () => void;
};

const CreateCampaignMenu: FC<CreateCampaignMenuProps> = ({
  open,
  onClose,
}): JSX.Element => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setCampaignName('');
    setCampaignDescription('');
  }, [open]);

  const handleCreateCampaign = (): void => {
    setLoading(true);
  };

  return (
    <InputBlur open={open}>
      <div className="bg-light-black border-light-white flex flex-col items-center justify-center rounded-sm border-2 p-4 select-none">
        <h1 className="mb-4 text-4xl">Create Campaign</h1>

        <InputField
          id="campaign-name"
          value={campaignName}
          onValueChange={setCampaignName}
          placeholder="Campaign Name"
          disabled={loading}
        />

        <InputTextArea
          id="campaign-description"
          value={campaignDescription}
          onValueChange={setCampaignDescription}
          placeholder="Campaign Description"
          width="xl"
          disabled={loading}
        />

        <div className="mt-4 flex">
          {loading ? (
            <LoadingIcon className="mt-2 mb-3" />
          ) : (
            <>
              <Button width="xs" type="submit" onClick={handleCreateCampaign}>
                Create
              </Button>
              <Button width="xs" onClick={onClose} loading={loading}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </InputBlur>
  );
};

export default CreateCampaignMenu;
