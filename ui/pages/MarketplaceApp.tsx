import { Box, Center, useColorMode } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { DappscoutIframeProvider, useDappscoutIframe } from 'dappscout-iframe';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/hooks/useFetch';
import * as metadata from 'lib/metadata';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';

import useMarketplaceWallet from '../marketplace/useMarketplaceWallet';

const feature = config.features.marketplace;
const configUrl = feature.isEnabled ? feature.configUrl : '';

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

type Props = {
  address: string | undefined;
  data: MarketplaceAppOverview | undefined;
  isPending: boolean;
};

const MarketplaceAppContent = ({ address, data, isPending }: Props) => {
  const { iframeRef, isReady } = useDappscoutIframe();

  const [ iframeKey, setIframeKey ] = useState(0);
  const [ isFrameLoading, setIsFrameLoading ] = useState(isPending);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIframeKey((key) => key + 1);
  }, [ address ]);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  useEffect(() => {
    if (data && !isFrameLoading) {
      const message = {
        blockscoutColorMode: colorMode,
        blockscoutRootUrl: config.app.baseUrl + route({ pathname: '/' }),
        blockscoutAddressExplorerUrl: config.app.baseUrl + route({ pathname: '/address/[hash]', query: { hash: '' } }),
        blockscoutTransactionExplorerUrl: config.app.baseUrl + route({ pathname: '/tx/[hash]', query: { hash: '' } }),
        blockscoutNetworkName: config.chain.name,
        blockscoutNetworkId: Number(config.chain.id),
        blockscoutNetworkCurrency: config.chain.currency,
        blockscoutNetworkRpc: config.chain.rpcUrl,
      };

      iframeRef?.current?.contentWindow?.postMessage(message, data.url);
    }
  }, [ isFrameLoading, data, colorMode, iframeRef ]);

  return (
    <Center
      h="100vh"
      mx={{ base: -4, lg: -6 }}
    >
      { (isFrameLoading) && (
        <ContentLoader/>
      ) }

      { (data && isReady) && (
        <Box
          key={ iframeKey }
          allow={ IFRAME_ALLOW_ATTRIBUTE }
          ref={ iframeRef }
          sandbox={ IFRAME_SANDBOX_ATTRIBUTE }
          as="iframe"
          h="100%"
          w="100%"
          display={ isFrameLoading ? 'none' : 'block' }
          src={ data.url }
          title={ data.title }
          onLoad={ handleIframeLoad }
        />
      ) }
    </Center>
  );
};

const MarketplaceApp = () => {
  const { address, sendTransaction, signMessage, signTypedData } = useMarketplaceWallet();

  const apiFetch = useApiFetch();
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const { isPending, isError, error, data } = useQuery<unknown, ResourceError<unknown>, MarketplaceAppOverview>({
    queryKey: [ 'marketplace-apps', id ],
    queryFn: async() => {
      const result = await apiFetch<Array<MarketplaceAppOverview>, unknown>(configUrl, undefined, { resource: 'marketplace-apps' });
      if (!Array.isArray(result)) {
        throw result;
      }
      const item = result.find((app: MarketplaceAppOverview) => app.id === id);
      if (!item) {
        throw { status: 404 };
      }

      return item;
    },
    enabled: feature.isEnabled,
  });

  useEffect(() => {
    if (data) {
      metadata.update(
        { pathname: '/apps/[id]', query: { id: data.id } },
        { app_name: data.title },
      );
    }
  }, [ data ]);

  if (isError) {
    throw new Error('Unable to load app', { cause: error });
  }

  return (
    <DappscoutIframeProvider
      address={ address }
      appUrl={ data?.url }
      rpcUrl={ config.chain.rpcUrl }
      sendTransaction={ sendTransaction }
      signMessage={ signMessage }
      signTypedData={ signTypedData }
    >
      <MarketplaceAppContent address={ address } data={ data } isPending={ isPending }/>
    </DappscoutIframeProvider>
  );
};

export default MarketplaceApp;
