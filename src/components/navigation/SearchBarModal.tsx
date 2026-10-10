import React from 'react';
import { GlobalSmartSearchModal } from './GlobalSmartSearchModal';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  return (
    <GlobalSmartSearchModal
      isOpen={isOpen}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  );
};
