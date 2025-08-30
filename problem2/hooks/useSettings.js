import { useState } from 'react';

export const useSettings = () => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  return {
    showSettingsModal,
    openSettingsModal,
    closeSettingsModal
  };
};
