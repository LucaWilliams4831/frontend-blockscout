import { Table, Tbody, Th, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ZkEvmL2TxnBatchesItem } from 'types/api/zkEvmL2TxnBatches';

import { default as Thead } from 'ui/shared/TheadSticky';

import ZkEvmTxnBatchesTableItem from './ZkEvmTxnBatchesTableItem';

type Props = {
  items: Array<ZkEvmL2TxnBatchesItem>;
  top: number;
  isLoading?: boolean;
}

const TxnBatchesTable = ({ items, top, isLoading }: Props) => {
  return (
    <Table variant="simple" size="sm" minW="850px">
      <Thead top={ top }>
        <Tr>
          <Th width="170px">Batch #</Th>
          <Th width="150px">Status</Th>
          <Th width="150px">Age</Th>
          <Th width="170px">Txn count</Th>
          <Th width="50%">Verify Tx Has</Th>
          <Th width="50%">Sequence hash</Th>
        </Tr>
      </Thead>
      <Tbody>
        { items.map((item, index) => (
          <ZkEvmTxnBatchesTableItem
            key={ item.number + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Tbody>
    </Table>
  );
};

export default TxnBatchesTable;
