import type { WalletType } from 'types/client/wallets';

export enum EventTypes {
  PAGE_VIEW = 'Page view',
  SEARCH_QUERY = 'Search query',
  ADD_TO_WALLET = 'Add to wallet',
  ACCOUNT_ACCESS = 'Account access',
  PRIVATE_TAG = 'Private tag',
  VERIFY_ADDRESS = 'Verify address',
  VERIFY_TOKEN = 'Verify token',
  WALLET_CONNECT = 'Wallet connect',
  CONTRACT_INTERACTION = 'Contract interaction',
  CONTRACT_VERIFICATION = 'Contract verification',
  QR_CODE = 'QR code',
  PAGE_WIDGET = 'Page widget',
  TX_INTERPRETATION_INTERACTION = 'Transaction interpratetion interaction'
}

/* eslint-disable @typescript-eslint/indent */
export type EventPayload<Type extends EventTypes> =
Type extends EventTypes.PAGE_VIEW ?
{
  'Page type': string;
  'Tab': string;
  'Page'?: string;
  'Color mode': 'light' | 'dark';
} :
Type extends EventTypes.SEARCH_QUERY ? {
  'Search query': string;
  'Source page type': string;
  'Result URL': string;
} :
Type extends EventTypes.ADD_TO_WALLET ? (
  {
    'Wallet': WalletType;
    'Target': 'network';
  } | {
    'Wallet': WalletType;
    'Target': 'token';
    'Token': string;
  }
) :
Type extends EventTypes.ACCOUNT_ACCESS ? {
  'Action': 'Auth0 init' | 'Verification email resent' | 'Logged out';
} :
Type extends EventTypes.PRIVATE_TAG ? {
  'Action': 'Form opened' | 'Submit';
  'Page type': string;
  'Tag type': 'Address' | 'Tx';
} :
Type extends EventTypes.VERIFY_ADDRESS ? (
  {
    'Action': 'Form opened' | 'Address entered';
    'Page type': string;
  } | {
    'Action': 'Sign ownership';
    'Page type': string;
    'Sign method': 'wallet' | 'manual';
  }
) :
Type extends EventTypes.VERIFY_TOKEN ? {
  'Action': 'Form opened' | 'Submit';
} :
Type extends EventTypes.WALLET_CONNECT ? {
  'Source': 'Header' | 'Smart contracts';
  'Status': 'Started' | 'Connected';
} :
Type extends EventTypes.CONTRACT_INTERACTION ? {
  'Method type': 'Read' | 'Write';
  'Method name': string;
} :
Type extends EventTypes.CONTRACT_VERIFICATION ? {
  'Method': string;
  'Status': 'Method selected' | 'Finished';
} :
Type extends EventTypes.QR_CODE ? {
  'Page type': string;
} :
Type extends EventTypes.PAGE_WIDGET ? {
  'Type': 'Tokens dropdown' | 'Tokens show all (icon)' | 'Add to watchlist' | 'Address actions (more button)';
} :
Type extends EventTypes.TX_INTERPRETATION_INTERACTION ? {
  'Type': 'Address click' | 'Token click';
} :
undefined;
/* eslint-enable @typescript-eslint/indent */
