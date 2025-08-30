import { useState } from 'react';

export const useTokenSelection = () => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectingFor, setSelectingFor] = useState(null);

  const openTokenModal = (forToken) => {
    setSelectingFor(forToken);
    setShowTokenModal(true);
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setSelectingFor(null);
  };

  return {
    showTokenModal,
    selectingFor,
    openTokenModal,
    closeTokenModal
  };
};
