import Head from 'next/head';
import React from 'react';
import { Box, Flex } from 'tacti';

interface Props {
  title?: string;
}

export const Layout: React.FC<Props> = ({ title = 'Code Kaffe Espresso', children }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex w100 direction='row'>
        <Box
          component={Flex}
          style={{ width: '256px', background: '#32175e', color: 'white', height: '100vh', flexDirection: 'column' }}
          borderSize={0}
          height={1}
        >
          {children[0]}
        </Box>
        <Flex style={{ width: 'calc(100% - 256px)' }}>{children[1]}</Flex>
      </Flex>
    </React.Fragment>
  );
};
