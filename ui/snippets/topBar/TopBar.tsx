import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ColorModeSwitch from './ColorModeSwitch';
import TopBarStats from './TopBarStats';
import NavigationDesktop from '../navigation/NavigationDesktop'

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');

  return (
    <Flex
      py={ 2 }
      px={ 6 }
      bgColor={ bgColor }
      justifyContent="space-between"
    >
      <NavigationDesktop/>
      <TopBarStats/>
      
    </Flex>
  );
};

export default React.memo(TopBar);
