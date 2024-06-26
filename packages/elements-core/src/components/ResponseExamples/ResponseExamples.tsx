import { Button, CopyButton, MenuItems, Panel, Select, Text } from '@stoplight/mosaic';
import { CodeViewer } from '@stoplight/mosaic-code-viewer';
import { IHttpOperation, IMediaTypeContent } from '@stoplight/types';
import React, { useEffect, useMemo, useState } from 'react';

import { exceedsSize, useGenerateExampleFromMediaTypeContent } from '../../utils/exampleGeneration/exampleGeneration';
import { LoadMore } from '../LoadMore';

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import { SectionTitle } from '../Docs/Sections';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

export interface ResponseExamplesProps {
  httpOperation: IHttpOperation;
  responseStatusCode?: string;
  responseMediaType?: string;
  onStatusCodeChange?: Function;
  mobile?: boolean;

}

export const ResponseExamples = ({ httpOperation, responseMediaType, responseStatusCode, onStatusCodeChange, mobile }: ResponseExamplesProps) => {
  const [chosenExampleIndex, setChosenExampleIndex] = React.useState(0);
  const [show, setShow] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const response = httpOperation.responses.find(response => response.code === responseStatusCode);
  const responseContents = response?.contents?.find(content => content.mediaType === responseMediaType);
  let userDefinedExamples: IMediaTypeContent['examples'];
  if (responseContents?.examples && responseContents?.examples.length > 0) {
    userDefinedExamples = responseContents?.examples;
  }
  const responseCodes = httpOperation.responses.map(response => response.code);
  const responseExample = useGenerateExampleFromMediaTypeContent(responseContents, chosenExampleIndex, {
    skipWriteOnly: true,
  });
  useEffect(() => {
    if (responseStatusCode === "" && onStatusCodeChange) {
      onStatusCodeChange(httpOperation?.responses[0]?.code)
    }
  }, [responseStatusCode, onStatusCodeChange, httpOperation?.responses[0]?.code])
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  useEffect(() => {
    setViewportHeight(window.innerHeight)
  }, [window.innerHeight])

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const ChakraMenu = () => {
    return (
      // <ChakraProvider>  as imagekit doc component is already wrapped with ChakraProvider
        <Menu autoSelect={false}>
          {({ isOpen, onClose: onCloseMain }) => (
            <>
              <MenuButton
                padding="5px 8px 4px 8px"
                color="white"
                fontStyle="normal"
                fontWeight="500"
                fontSize="14px"
                borderRadius={"5px"}
                borderWidth={"1px"}
                borderColor={"rgba(194, 201, 214, 0.65)"}
                lineHeight="21px"
                background="#1a202c"
                _hover={{
                  ...(!isOpen && !mobile && {
                    background: "#3c4c67",
                  }),
                }}
                {...((isOpen || mobile) && {

                })}
              >
                <div className="menu-button-class">
                  {responseStatusCode}
                  {isOpen ? (
                    <ChevronUpIcon
                      boxSize={"16px"}
                      strokeWidth={"1px"}
                      stroke="var(--Text-secondary, #4a5568)"
                    />
                  ) : (
                    <ChevronDownIcon
                      boxSize={"16px"}
                      strokeWidth={"1px"}
                      stroke="var(--Text-secondary, #4a5568)"
                    />
                  )}
                </div>
              </MenuButton>
              <MenuList style={{ maxHeight: "400px", minWidth: "150px", width: "150px", overflow: "scroll", background: "white", fontSize: "16px", lineHeight: "24px", color: "rgb(74, 85, 104)", padding: "0px" }}>
                {responseCodes.map((responseCode) => {
                  return (<MenuItem onClick={(e) => {
                    if (onStatusCodeChange) {
                      e.preventDefault();
                      onStatusCodeChange((e.currentTarget as HTMLButtonElement).textContent)
                    }
                  }}>{responseCode}</MenuItem>)
                })}
              </MenuList>
            </>
          )}
        </Menu>
      // </ChakraProvider>
    )
  }
  // const menuItems = useMemo(() => {
  //   if (responseCodes) {
  //     const items: MenuItems = responseCodes.map((code) => {
  //       return {
  //         id: code,
  //         title: code,
  //         isChecked: code === responseStatusCode,
  //         onPress: (e) => {

  //           if (onStatusCodeChange) {
  //             onStatusCodeChange(e)
  //           }
  //         }
  //       };
  //     });

  //     return items;
  //   }
  //   return [];
  // }, [responseStatusCode, responseCodes, onStatusCodeChange]);


  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => setShow(true), 50);
  };

  if (!userDefinedExamples && responseMediaType !== 'application/json') return null;

  if (!responseExample) return null;

  const examplesSelect = userDefinedExamples && userDefinedExamples.length > 1 && (
    <Select
      aria-label="Response Example"
      value={String(chosenExampleIndex)}
      options={userDefinedExamples.map((example, index) => ({ value: index, label: example.key }))}
      onChange={value => setChosenExampleIndex(parseInt(String(value), 10))}
      size="sm"
      triggerTextPrefix="Response Example: "
    />
  );

  const copyIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
    <path d="M13.3636 0H2.70455C2.61705 0 2.54545 0.0723214 2.54545 0.160714V1.28571C2.54545 1.37411 2.61705 1.44643 2.70455 1.44643H12.5682V15.2679C12.5682 15.3562 12.6398 15.4286 12.7273 15.4286H13.8409C13.9284 15.4286 14 15.3562 14 15.2679V0.642857C14 0.287277 13.7156 0 13.3636 0ZM10.8182 2.57143H0.636364C0.284375 2.57143 0 2.85871 0 3.21429V13.8757C0 14.0464 0.0676135 14.2092 0.186932 14.3297L3.63324 17.8112C3.67699 17.8554 3.7267 17.8915 3.7804 17.9217V17.9598H3.86392C3.93352 17.9859 4.0071 18 4.08267 18H10.8182C11.1702 18 11.4545 17.7127 11.4545 17.3571V3.21429C11.4545 2.85871 11.1702 2.57143 10.8182 2.57143ZM3.77841 15.9147L2.06619 14.183H3.77841V15.9147ZM10.0227 16.5536H5.05114V13.7009C5.05114 13.2569 4.69517 12.8973 4.25568 12.8973H1.43182V4.01786H10.0227V16.5536Z" fill="white" />
  </svg>)

  return (
    <Panel rounded isCollapsible={false}>
      <Panel.Titlebar py={1.5} pl={2} roundedT="lg" rightComponent={<CopyButton size="md" roundedB="lg" roundedT="lg" appearance='default' icon={copyIcon} copyValue={responseExample || ''} />}>
        {responseCodes && <ChakraMenu></ChakraMenu>}
        {examplesSelect}
      </Panel.Titlebar>
      <Panel.Content p={0}>
        {show || !exceedsSize(responseExample) ? (
          <CodeViewer
            aria-label={responseExample}
            noCopyButton
            maxHeight={`${viewportHeight - 96}px`}
            language="json"
            value={responseExample}
            showLineNumbers
          />
        ) : (
          <LoadMore loading={loading} onClick={handleLoadMore} />
        )}
      </Panel.Content>
    </Panel>
  );
};
