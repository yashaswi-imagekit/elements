import { Box, Flex, VStack } from '@stoplight/mosaic';
import React from 'react';

export interface TwoColumnLayoutProps {
  header: React.ReactNode;
  right: React.ReactNode;
  left: React.ReactNode;
  className?: string;
}

export interface ImagekitLayoutProps {
  header: React.ReactNode;
  right: React.ReactNode;
  left: React.ReactNode;
  bottom: React.ReactNode
  className?: string;
  Component?: any;
  pageProps?: any;
}

export interface ImagekitLMobileLayout {
  sectionOne: React.ReactNode;
  sectionTwo: React.ReactNode;
  sectionThree: React.ReactNode;
  sectionFour: React.ReactNode;
  sectionFive: React.ReactNode;
  className?: string;
  Component?: any;
  pageProps?: any;
}



export const ImagekitLayout = React.forwardRef<HTMLDivElement, ImagekitLayoutProps>(
  ({ header, right, left, className, bottom, Component }, ref) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
      <VStack ref={ref} style={{ width: "100%", maxWidth: "1448px", }} className={className} spacing={4} >
        <Flex alignSelf={'flex-start'}>
          {header}
        </Flex>

        <Flex style={{ width: "100%" }} alignSelf={"center"}>
          <Flex flex={1} style={{ maxWidth: "700px", width: "calc(50% - 24px)" }} >
            {left}
          </Flex>


          {right && (
            <Flex flex={1} >
              <Box data-testid="two-column-right" ml={12} flex={1} pos="relative" style={{ maxWidth: "700px", width: "calc(50% - 24px)" }}>
                {right}
              </Box>
            </Flex>

          )}
        </Flex>

        {bottom && bottom}
        <Component />


      </VStack>
    </div>
  ),
);

export const ImagekitLMobileLayout = React.forwardRef<HTMLDivElement, ImagekitLMobileLayout>(
  ({ sectionOne, sectionTwo, sectionThree, sectionFour, sectionFive, className, Component }, ref) => (

    <VStack ref={ref} w="full" className={className} spacing={10}>
      {sectionOne}
      {sectionTwo}
      {sectionThree}
      {sectionFour}
      {sectionFive}
      <Component />


    </VStack>
  ),
);

export const TwoColumnLayout = React.forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  ({ header, right, left, className }, ref) => (
    <VStack ref={ref} w="full" className={className} spacing={8}>
      {header}
      <Flex>
        <Box data-testid="two-column-left" w={0} flex={1}>
          {left}
        </Box>

        {right && (
          <Box data-testid="two-column-right" ml={16} pos="relative" w="2/5" style={{ maxWidth: 500 }}>
            {right}
          </Box>
        )}
      </Flex>
    </VStack>
  ),
);
