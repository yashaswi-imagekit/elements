import { Box, Flex, Heading, HStack, InvertTheme, NodeAnnotation, useThemeIsDark, VStack } from '@stoplight/mosaic';
import { withErrorBoundary } from '@stoplight/react-error-boundary';
import { IHttpOperation } from '@stoplight/types';
import cn from 'classnames';
import { useAtomValue } from 'jotai/utils';
import * as React from 'react';

import { Box as ChakraBox } from '@chakra-ui/react'
import { HttpMethodColors } from '../../../constants';
import { MockingContext } from '../../../containers/MockingProvider';
import { useResolvedObject } from '../../../context/InlineRefResolver';
import { useOptionsCtx } from '../../../context/Options';
import { useIsCompact } from '../../../hooks/useIsCompact';
import { MarkdownViewer } from '../../MarkdownViewer';
import { chosenServerAtom, TryItWithRequestSamples } from '../../TryIt';
import { DocsComponentProps } from '..';
import { ImagekitLayout, ImagekitLMobileLayout, TwoColumnLayout } from '../TwoColumnLayout';
import { DeprecatedBadge, InternalBadge } from './Badges';
import { Request } from './Request';
import { Responses } from './Responses';
import { TryIt, TryItProps } from '../../TryIt';
import { RequestSamples } from '../../RequestSamples';
import { ResponseExamples } from '../../ResponseExamples/ResponseExamples';
import { SectionTitle } from '../Sections';
import { HarRequest } from 'httpsnippet-lite';
import { Request as RequestProp } from 'har-format';

export type HttpOperationProps = DocsComponentProps<IHttpOperation>;

export const RequestNote = ({requestNoteMarkdown}:{requestNoteMarkdown:string}) => {
  return (
    <div style={{
      width: "100%", margin: "0px 0px 16px 0px", borderRadius: "8px", padding: "12px 16px 12px 16px",
      borderLeftWidth: "4px", borderColor: "#007694", backgroundColor: "#E6F9FE", display: "flex",
      gap: "12px"
    }}>
      <div style={{ padding: "2px" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.47768 0 0 4.47768 0 10C0 15.5223 4.47768 20 10 20C15.5223 20 20 15.5223 20 10C20 4.47768 15.5223 0 10 0ZM10.7143 14.8214C10.7143 14.9196 10.6339 15 10.5357 15H9.46429C9.36607 15 9.28571 14.9196 9.28571 14.8214V8.75C9.28571 8.65179 9.36607 8.57143 9.46429 8.57143H10.5357C10.6339 8.57143 10.7143 8.65179 10.7143 8.75V14.8214ZM10 7.14286C9.71963 7.13713 9.45267 7.02174 9.25641 6.82143C9.06014 6.62112 8.95022 6.35186 8.95022 6.07143C8.95022 5.791 9.06014 5.52174 9.25641 5.32143C9.45267 5.12112 9.71963 5.00572 10 5C10.2804 5.00572 10.5473 5.12112 10.7436 5.32143C10.9399 5.52174 11.0498 5.791 11.0498 6.07143C11.0498 6.35186 10.9399 6.62112 10.7436 6.82143C10.5473 7.02174 10.2804 7.13713 10 7.14286Z" fill="#007694" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: "700", lineHeight: "24px", color: "#007694", fontSize: "16px" }}>
          {"Note"}
        </div>
        <MarkdownViewer style={{fontSize: "16px"}} className="sl-font-normal sl-leading-normal" markdown={requestNoteMarkdown} />
      </div>
    </div>
  );
};

const HttpOperationComponent = React.memo<HttpOperationProps>(
  ({ className, data: unresolvedData, layoutOptions, tryItCredentialsPolicy, tryItCorsProxy, Component, pageProps, mobile,requestNoteMarkdown }) => {

    const { nodeHasChanged } = useOptionsCtx();
    const data = useResolvedObject(unresolvedData) as IHttpOperation;
    const { ref: layoutRef, isCompact } = useIsCompact(layoutOptions);

    const mocking = React.useContext(MockingContext);
    const isDeprecated = !!data.deprecated;
    const isInternal = !!data.internal;

    const [responseMediaType, setResponseMediaType] = React.useState('');
    const [responseStatusCode, setResponseStatusCode] = React.useState('');
    const [requestBodyIndex, setTextRequestBodyIndex] = React.useState(0);
    const [mobileResponseStatusCode, setMobileResponseStatusCode] = React.useState('');

    const prettyName = (data.summary || data.iid || '').trim();
    const hasBadges = isDeprecated || isInternal;

    const header = (
      <OperationHeader
        id={data.id}
        method={data.method}
        path={data.path}
        noHeading={layoutOptions?.noHeading}
        hasBadges={hasBadges}
        name={prettyName}
        isDeprecated={isDeprecated}
        isInternal={isInternal}
        mobile={mobile}
      />
    );
    // const responseTryItContent = document.getElementById("unique_response_response_body");
    // const mainContent = document.getElementById("main_content_unique_id")
    const tryItPanel = !layoutOptions?.hideTryItPanel && (
      <TryItWithRequestSamples
        httpOperation={data}
        responseMediaType={responseMediaType}
        responseStatusCode={responseStatusCode}
        requestBodyIndex={requestBodyIndex}
        hideTryIt={layoutOptions?.hideTryIt}
        tryItCredentialsPolicy={tryItCredentialsPolicy}
        mockUrl={mocking.hideMocking ? undefined : mocking.mockUrl}
        corsProxy={tryItCorsProxy}
        requestNoteMarkdown={requestNoteMarkdown}
      />
    );

    const descriptionChanged = nodeHasChanged?.({ nodeId: data.id, attr: 'description' });
    const description = (
      <VStack spacing={mobile ? 10 : 20} w="full">
        {data.description && (
          <Box pos="relative">
             <MarkdownViewer style={{fontSize: "16px", marginTop: "16px", ...(mobile ? {paddingTop: "16px"} : {})}} className="HttpOperation__Description sl-font-medium sl-leading-normal" markdown={data.description} />
            <NodeAnnotation change={descriptionChanged} />
          </Box>
        )}

        <Request onChange={setTextRequestBodyIndex} operation={data} />
      </VStack>
    );

    const [requestData, setRequestData] = React.useState<HarRequest | undefined>();

    const tryIt = (<InvertTheme>
      <Box >
        <TryIt
          httpOperation={data}
          requestBodyIndex={requestBodyIndex}
          tryItCredentialsPolicy={tryItCredentialsPolicy}
          mockUrl={mocking.hideMocking ? undefined : mocking.mockUrl}
          corsProxy={tryItCorsProxy}
          onRequestChange={setRequestData} />
      </Box>
    </InvertTheme>)

    const requestSample = requestData && (<Box>
      <SectionTitle title='Request sample' size={3} pb={2}></SectionTitle>
      <RequestNote requestNoteMarkdown={requestNoteMarkdown ?? ""}/>
      <InvertTheme>
        <Box id='request-sample-unique-id'>
          <div style={{zIndex:"999"}}>
          <RequestSamples mobile={mobile} request={requestData as RequestProp} />
          </div>
        </Box>
      </InvertTheme>
    </Box>)

    const bottom = data.responses && (
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "64px" }}>

        <Flex w={0} flex={1} style={{ maxWidth: "700px" }} >

          <Responses
            responses={data.responses}
            onMediaTypeChange={setResponseMediaType}
            onStatusCodeChange={setResponseStatusCode}
            responseStatusCode={responseStatusCode}
            isCompact={isCompact} />
        </Flex>
        <Flex w={0} flex={1}  >

          <Box id="unique_response_response_body" ml={12} style={{ maxWidth: "700px", width: "100%", alignSelf: "flex-start", position: "sticky", top: "8px", }} >
            <SectionTitle title='Response example' size={3} pb={2}></SectionTitle>
            <InvertTheme>
              <Box>
                <ResponseExamples httpOperation={data}
                  responseMediaType={responseMediaType}
                  responseStatusCode={responseStatusCode}
                  onStatusCodeChange={setResponseStatusCode}
                />
              </Box>
            </InvertTheme>
          </Box>

        </Flex>
      </div>
    )

    const sectionOne = (<Box>
      {header}
      {description}
    </Box>)
  
    const responses = (
      <div style={{zIndex:"999"}}>
      <Responses
        responses={data.responses}
        onMediaTypeChange={setResponseMediaType}
        onStatusCodeChange={setResponseStatusCode}
        responseStatusCode={responseStatusCode}
        isCompact={isCompact} />
        </div>
    )


    const responsesExample = (
      <div style={{zIndex:"999"}}>
      <Box id="unique_response_response_body">
        <SectionTitle title='Response example' size={3} pb={2}></SectionTitle>
        <InvertTheme>
          <Box>
            <ResponseExamples httpOperation={data}
              responseMediaType={"application/json"}
              responseStatusCode={mobileResponseStatusCode}
              onStatusCodeChange={setMobileResponseStatusCode}
            />
          </Box>
        </InvertTheme>
      </Box>
      </div>)


    if (mobile) {
      return (
        <ImagekitLMobileLayout
          ref={layoutRef}
          className={cn('HttpOperation', className)}
          sectionOne={sectionOne}
          sectionTwo={tryIt}
          sectionThree={requestSample}
          sectionFour={responses}
          sectionFive={responsesExample}
          Component={Component}
        />
      )
    }

    return (
      <ImagekitLayout
        ref={layoutRef}
        className={cn('HttpOperation', className)}
        header={header}
        left={description}
        right={!isCompact && tryItPanel}
        bottom={bottom}
        Component={Component}
      />
    );
  },
);
HttpOperationComponent.displayName = 'HttpOperation.Component';

export const HttpOperation = withErrorBoundary<HttpOperationProps>(HttpOperationComponent, {
  recoverableProps: ['data', 'Component', 'pageProps', 'mobile','requestNoteMarkdown'],
});

type MethodPathProps = { method: IHttpOperation['method']; path: string, mobile?: boolean };

function MethodPath({ method, path, mobile }: MethodPathProps) {
  const chosenServer = useAtomValue(chosenServerAtom);

  let chosenServerUrl = '';
  if (chosenServer) {
    chosenServerUrl = chosenServer.url.endsWith('/') ? chosenServer.url.slice(0, -1) : chosenServer.url;
  }

  return (
    <Box>
      <MethodPathInner method={method} path={path} chosenServerUrl={chosenServerUrl} mobile={mobile} />
    </Box>
  );
}

const copyIcon = (<svg className='svg-icon' width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g >
    <path d="M12.5455 2H4.93182C4.86932 2 4.81818 2.05223 4.81818 2.11607V2.92857C4.81818 2.99241 4.86932 3.04464 4.93182 3.04464H11.9773V13.0268C11.9773 13.0906 12.0284 13.1429 12.0909 13.1429H12.8864C12.9489 13.1429 13 13.0906 13 13.0268V2.46429C13 2.20748 12.7969 2 12.5455 2ZM10.7273 3.85714H3.45455C3.20312 3.85714 3 4.06462 3 4.32143V12.0213C3 12.1446 3.0483 12.2622 3.13352 12.3492L5.59517 14.8636C5.62642 14.8955 5.66193 14.9217 5.70028 14.9434V14.971H5.75994C5.80966 14.9898 5.86222 15 5.91619 15H10.7273C10.9787 15 11.1818 14.7925 11.1818 14.5357V4.32143C11.1818 4.06462 10.9787 3.85714 10.7273 3.85714ZM5.69886 13.494L4.47585 12.2433H5.69886V13.494ZM10.1591 13.9554H6.60795V11.8951C6.60795 11.5744 6.35369 11.3147 6.03977 11.3147H4.02273V4.90179H10.1591V13.9554Z" />
  </g>
</svg>
)
// interface ApiUrlProps {
//   mobile: boolean;
// }
// export const ApiUrl = styled.div<ApiUrlProps>`
  
// .path-box {
//   margin-right:8px;
//   color:#1A202C;
// }

// .copy-icon {
//   visibility:hidden;
//   padding-top:2px;

// }

//  {
//   fill:red;
// }
// .svg-icon{
//   fill:currentColor;
//   opacity:0.4;
// }
// .wrapper{
//   display:flex;
//   align-items:center;
//   cursor:pointer;
// }
// .wrapper:hover .copy-icon {
//   visibility: visible;
// }
//  .copy-icon:hover .svg-icon{
//   opacity:1;
// }


// `;

function MethodPathInner({ method, path, chosenServerUrl, mobile }: MethodPathProps & { chosenServerUrl: string, mobile?: boolean }) {
  const isDark = useThemeIsDark();
  const fullUrl = `${chosenServerUrl}${path}`;

  const pathElem = (
    <Flex overflowX="hidden" fontWeight="medium" fontSize="lg" userSelect="all" lineHeight="normal">
      <Box dir="rtl" textOverflow="truncate" overflowX="hidden">
        <Box color={"#718096"} as="span" dir="ltr" style={{ unicodeBidi: 'bidi-override' }}>
          {chosenServerUrl}
        </Box>
      </Box>
      <div >
        <div className='wrapper' onClick={() => {
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(`${chosenServerUrl}${path}`);
          }
        }}>
          <Box className="path-box" flex={1} >
            {path}
          </Box>
          <div className='copy-icon' >
            {copyIcon}
          </div>
        </div>
        <style>{`
      .path-box {
        margin-right:8px;
        color:#1A202C;
      }
      
      .copy-icon {
        ${mobile ? "visibility:visible;" : "visibility:hidden;"}
        padding-top:2px;
      
      }
      
       {
        fill:red;
      }
      .svg-icon{
        fill:currentColor;
        ${mobile ? "opacity:0.5;" : "opacity:0.4;"}
      }
      .wrapper{
        display:flex;
        align-items:center;
        cursor:pointer;
      }
      ${!mobile ? ".wrapper:hover .copy-icon {\
        visibility: visible;\
      }\
       .copy-icon:hover .svg-icon{\
        opacity:1;\
      }" : ""
          }
    
      
      `}</style>
      </div>
    </Flex>
  );

  const methodElement = (<Box
    py={0}
    px={1}
    rounded={true}
    bg={'#0E75B0'}
    color={'#F3F8FB'}
    fontSize="base"
    fontWeight="semibold"
    lineHeight='normal'
    w="min"
    textTransform="uppercase"
  >
    {method}
  </Box>)

  if (mobile) {
    return (
      <VStack
        spacing={1}
        pt={0}
        display="inline-flex"
        maxW="full"
        title={fullUrl}>

        {methodElement}
        {pathElem}
      </VStack>
    )
  }

  return (
    <HStack
      spacing={2}
      pl={0}
      pr={0}
      py={0}
      display="inline-flex"
      maxW="full"
      title={fullUrl}
    >
      {methodElement}
      {pathElem}
    </HStack>
  );
}

function OperationHeader({
  id,
  noHeading,
  hasBadges,
  name,
  isDeprecated,
  isInternal,
  method,
  path,
  mobile,
}: {
  id: string;
  noHeading?: boolean;
  hasBadges: boolean;
  name: string;
  isDeprecated?: boolean;
  isInternal?: boolean;
  method: string;
  path: string;
  mobile?: boolean;
}) {
  const { nodeHasChanged } = useOptionsCtx();

  if (noHeading && !hasBadges) {
    return null;
  }

  const lineOneChanged = nodeHasChanged?.({ nodeId: id, attr: ['iid', 'summary', 'deprecated', 'internal'] });
  const lineTwoChanged = nodeHasChanged?.({ nodeId: id, attr: ['method', 'path'] });

  if (mobile) {
    return (<VStack spacing={2} pt={4} id="unique-heading-indentifier">
      {!noHeading && name ? (
        <SectionTitle title={name} pb={0} pr={6} fontSize="2xl" mobile={mobile} fontWeight={"semibold"}></SectionTitle>
        // <Heading color={"#1A202C"} fontSize="3xl" fontWeight={"semibold"} lineHeight='tight' size={1} >
        //   {name}
        // </Heading>
      ) : null}

      {(isDeprecated || isInternal) && <HStack spacing={2}>
        {isDeprecated && <DeprecatedBadge />}
        {isInternal && <InternalBadge isHttpService />}
      </HStack>
      }

      <Box pos="relative">
        <MethodPath method={method} path={path} mobile={mobile} />
      </Box>

    </VStack>)
  }
  return (
    <VStack spacing={2} pt={10} id="unique-heading-indentifier">
      <Box pos="relative">
        <HStack spacing={5}>
          {!noHeading && name ? (
            <SectionTitle title={name} pb={0} pr={6} fontSize="2xl" fontWeight={"semibold"}></SectionTitle>
            // <Heading color={"#1A202C"} fontSize="3xl" fontWeight={"semibold"} lineHeight='tight' size={1} >
            //   {name}
            // </Heading>
          ) : null}

          <HStack spacing={2}>
            {isDeprecated && <DeprecatedBadge />}
            {isInternal && <InternalBadge isHttpService />}
          </HStack>
        </HStack>
        <NodeAnnotation change={lineOneChanged} />
      </Box>

      <Box pos="relative">
        <MethodPath method={method} path={path} />
        <NodeAnnotation change={lineTwoChanged} />
      </Box>
    </VStack>
  );
}
