import { Link, Table, Tbody, Tr, Th, Show, Hide } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

import type { Transaction, TransactionsSortingField, TransactionsSortingValue } from 'types/api/transaction';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TheadSticky from 'ui/shared/TheadSticky';

import TxsTableItem from './TxsTableItem';

type Props = {
  txs: Array<Transaction>;
  sort: (field: TransactionsSortingField) => () => void;
  sorting?: TransactionsSortingValue;
  top: number;
  showBlockInfo: boolean;
  showSocketInfo: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TxsTable = ({
  txs,
  sort,
  sorting,
  top,
  showBlockInfo,
  showSocketInfo,
  socketInfoAlert,
  socketInfoNum,
  currentAddress,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  return (
    <Table variant="simple" minWidth="950px" size="xs">
      <TheadSticky top={ top }>
        <Tr>
          <Th width="54px"></Th>
          <Th width="22%">Txn hash</Th>
          <Th width="160px">Type</Th>
          <Th width="20%">Method</Th>
          { showBlockInfo && <Th width="18%">Block</Th> }
          <Th width={{ xl: '152px', base: '86px' }}>
            <Show above="xl" ssr={ false }>From</Show>
            <Hide above="xl" ssr={ false }>From / To</Hide>
          </Th>
          <Th width={{ xl: currentAddress ? '48px' : '36px', base: currentAddress ? '52px' : '28px' }}></Th>
          <Th width={{ xl: '152px', base: '86px' }}>
            <Show above="xl" ssr={ false }>To</Show>
          </Th>
          { !config.UI.views.tx.hiddenFields?.value && (
            <Th width="20%" isNumeric>
              <Link onClick={ sort('value') } display="flex" justifyContent="end">
                { sorting === 'value-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                { sorting === 'value-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                { `Value ${ config.chain.currency.symbol }` }
              </Link>
            </Th>
          ) }
          { !config.UI.views.tx.hiddenFields?.tx_fee && (
            <Th width="20%" isNumeric pr={ 5 }>
              <Link onClick={ sort('fee') } display="flex" justifyContent="end">
                { sorting === 'fee-asc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(-90deg)"/> }
                { sorting === 'fee-desc' && <IconSvg boxSize={ 5 } name="arrows/east" transform="rotate(90deg)"/> }
                { `Fee${ config.UI.views.tx.hiddenFields?.fee_currency ? '' : ` ${ config.chain.currency.symbol }` }` }
              </Link>
            </Th>
          ) }
        </Tr>
      </TheadSticky>
      <Tbody>
        { showSocketInfo && (
          <SocketNewItemsNotice.Desktop
            url={ window.location.href }
            alert={ socketInfoAlert }
            num={ socketInfoNum }
            isLoading={ isLoading }
          />
        ) }
        <AnimatePresence initial={ false }>
          { txs.map((item, index) => (
            <TxsTableItem
              key={ item.hash + (isLoading ? index : '') }
              tx={ item }
              showBlockInfo={ showBlockInfo }
              currentAddress={ currentAddress }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
            />
          )) }
        </AnimatePresence>
      </Tbody>
    </Table>
  );
};

export default React.memo(TxsTable);
