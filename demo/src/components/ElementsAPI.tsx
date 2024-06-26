import '@stoplight/elements-core/styles.css';

import { API } from '@stoplight/elements';
import { Box } from '@stoplight/mosaic';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { GlobalContext } from '../context';

export const ElementsAPI = ({Component, pageProps}:{Component:any,pageProps:any}) => {
  const { apiDescriptionUrl } = useContext(GlobalContext);

  const specUrlWithProxy =
    apiDescriptionUrl && window.location.origin === 'https://elements-demo.stoplight.io'
      ? `https://stoplight.io/cors-proxy/${apiDescriptionUrl}`
      : apiDescriptionUrl;


const {pathname} = useLocation()
const host = "https://stage.imagekit.io"
const requestNoteMarkdown = "Here, you can explore machine-generated code examples. For practical applications, refer to the [Examples](#examples) section below, which includes detailed code snippets from the ImageKit SDKs."
  return (
    // <Box flex={1} overflowY="hidden">
      <API locationPath={pathname} mobile={false} host={host}apiDescriptionUrl={specUrlWithProxy} requestNoteMarkdown={requestNoteMarkdown} router="history" Component={Component} pageProps={pageProps} />
    // </Box>
  );
};
