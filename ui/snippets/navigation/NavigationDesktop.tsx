import { Flex, Box, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import IconSvg from 'ui/shared/IconSvg';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';
import ColorModeSwitch from '../topBar/ColorModeSwitch';

import NavLink from './NavLink';
import NavLinkGroupDesktop from './NavLinkGroupDesktop';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const hasAccount = useHasAccount();

  const [isCollapsed, setCollapsedState] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [isCollapsed]);

  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
    borderColor: 'divider',
  };

  const isExpanded = isCollapsed === false;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      flexDirection="row"
      alignItems="stretch"
      // borderRight="1px solid"
      // borderColor="divider"
      px={6}
      py={2}
      width="100%"
      {...getDefaultTransitionProps({ transitionProperty: 'width, padding' })}
      sx={{
        '&:hover #expand-icon': {
          display: 'block',
        },
      }}
    >
      <Box display="flex" flexDirection="row" mt={2}>
        <NetworkLogo isCollapsed={isCollapsed} />
        {!config.chain.isTestnet && <IconSvg name="testnet" h="14px" w="49px" color="red.400" />}
      </Box>
      <Box as="nav" w="100%">
        <Box w="100%" display="flex" flexDirection="row" alignItems="space-between">
          {mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroupDesktop key={item.text} item={item} isCollapsed={isCollapsed} />;
            } else {
              return <NavLink key={item.text} item={item} isCollapsed={isCollapsed} />;
            }
          })}
        </Box>
      </Box>
      <ColorModeSwitch/>
      {hasAccount && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={6} pt={6}>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            {accountNavItems.map((item) => <NavLink key={item.text} item={item} isCollapsed={isCollapsed} />)}
          </VStack>
        </Box>
      )}
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="10%"
        pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
        pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
        h={10}
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >

        {Boolean(config.UI.sidebar.featuredNetworks) && <NetworkMenu isCollapsed={isCollapsed} />}
      </Box>
    </Flex>
  );
};

export default NavigationDesktop;
