import { Box, Button, CopyButton, MenuItems, Panel } from '@stoplight/mosaic';
import { CodeViewer } from '@stoplight/mosaic-code-viewer';
import { Request } from 'har-format';
import React, { useCallback, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { persistAtom } from '../../utils/jotai/persistAtom';
import { convertRequestToSample } from './convertRequestToSample';
import { getConfigFor, requestSampleConfigs } from './requestSampleConfigs';
import { relative } from '@stoplight/path';

export interface RequestSamplesProps {
  /**
   * The HTTP request to generate code for.
   */
  request: Request;
  /**
   * True when embedded in TryIt
   */
  embeddedInMd?: boolean;
  mobile?: boolean;
}

const fallbackText = 'Unable to generate code example';

/**
 * Generates program code that makes the HTTP call specified by `request`.
 *
 * The programming language can be selected by the user and is remembered across instances and remounts.
 */

const copyIcon = (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" viewBox="0 0 14 18" fill="none">
  <path d="M13.3636 0H2.70455C2.61705 0 2.54545 0.0723214 2.54545 0.160714V1.28571C2.54545 1.37411 2.61705 1.44643 2.70455 1.44643H12.5682V15.2679C12.5682 15.3562 12.6398 15.4286 12.7273 15.4286H13.8409C13.9284 15.4286 14 15.3562 14 15.2679V0.642857C14 0.287277 13.7156 0 13.3636 0ZM10.8182 2.57143H0.636364C0.284375 2.57143 0 2.85871 0 3.21429V13.8757C0 14.0464 0.0676135 14.2092 0.186932 14.3297L3.63324 17.8112C3.67699 17.8554 3.7267 17.8915 3.7804 17.9217V17.9598H3.86392C3.93352 17.9859 4.0071 18 4.08267 18H10.8182C11.1702 18 11.4545 17.7127 11.4545 17.3571V3.21429C11.4545 2.85871 11.1702 2.57143 10.8182 2.57143ZM3.77841 15.9147L2.06619 14.183H3.77841V15.9147ZM10.0227 16.5536H5.05114V13.7009C5.05114 13.2569 4.69517 12.8973 4.25568 12.8973H1.43182V4.01786H10.0227V16.5536Z" fill="white" />
</svg>)
export const RequestSamples = React.memo<RequestSamplesProps>(({ request, mobile = false, embeddedInMd = false }) => {
  let localStorageLanguage: Storage;

  let localStorageData = window?.localStorage?.getItem("imagekit_stoplight_language");
  const [localStorageLang, localStorageLibrary] = localStorageData ? localStorageData.includes("_") ? localStorageData?.split("_") : [localStorageData, ""] : ["Shell", "cURL"];

  const [selectedLanguage, setSelectedLanguage] = React.useState(localStorageLang);
  const [selectedLibrary, setSelectedLibrary] = React.useState(localStorageLibrary);

  useEffect(() => {
    setSelectedLanguage(localStorageLang)
    setSelectedLibrary(localStorageLibrary)
  }, [localStorageLang, localStorageLibrary])


  const { httpSnippetLanguage, httpSnippetLibrary, mosaicCodeViewerLanguage } = getConfigFor(
    selectedLanguage,
    selectedLibrary,
  );

  const [requestSample, setRequestSample] = React.useState<string | null>(null);
  React.useEffect(() => {
    let isStale = false;
    convertRequestToSample(httpSnippetLanguage, httpSnippetLibrary, request)
      .then(example => {
        if (!isStale) {
          setRequestSample(example);
        }
      })
      .catch(() => {
        if (!isStale) {
          setRequestSample(fallbackText);
        }
      });

    return () => {
      isStale = true;
    };
  }, [request, httpSnippetLanguage, httpSnippetLibrary]);

  const handleListener = useCallback((event) => {

    localStorageLanguage = window.localStorage;
    const storageLanguage: string = localStorageLanguage?.getItem("imagekit_stoplight_language") ?? "";
    if (storageLanguage) {
      const [updatedLanguage, updatedLibrary] = storageLanguage.includes("_") ? storageLanguage?.split("_") : [storageLanguage, ""];
      setSelectedLanguage(updatedLanguage)
      setSelectedLibrary(updatedLibrary)

    }
  }, [window.localStorage, setSelectedLanguage, setSelectedLibrary])

  React.useEffect(() => {
    window.addEventListener('storage', handleListener);
    return () => {
      window.removeEventListener('storage', handleListener);
    }
  }, [])


  // const menuItems = useMemo(() => {
  //   const items: MenuItems = Object.entries(requestSampleConfigs).map(([language, config]) => {
  //     const hasLibraries = config.libraries && Object.keys(config.libraries).length > 0;
  //     return {
  //       id: language,
  //       title: language,
  //       isChecked: selectedLanguage === language,
  //       // ...(hasLibraries ?{type:'option_group'} : undefined),
  //       label: hasLibraries ? language : "",
  //       onPress:
  //         hasLibraries ?
  //           undefined
  //           : () => {
  //             setSelectedLanguage(language);
  //             setSelectedLibrary('');
  //             if (languageReverseMap[language]) {
  //               window.localStorage.setItem("imagekit_stoplight_language", languageReverseMap[language])
  //               window.dispatchEvent(new Event('storage'))
  //             }
  //           }
  //       ,
  //       children: config.libraries
  //         ? Object.keys(config.libraries).map(library => ({
  //           id: `${language}-${library}`,
  //           title: library,
  //           isChecked: selectedLanguage === language && selectedLibrary === library,
  //           onPress: () => {
  //             setSelectedLanguage(language);
  //             setSelectedLibrary(library);
  //             if (languageReverseMap[language + library]) {
  //               window.localStorage.setItem("imagekit_stoplight_language", languageReverseMap[language + library])
  //               window.dispatchEvent(new Event('storage'))
  //             }
  //           },
  //         }))
  //         : undefined,
  //     };
  //   });

  //   return items;
  // }, [selectedLanguage, selectedLibrary, setSelectedLanguage, setSelectedLibrary]);

  const ChakraMenu = () => {

    // const menuElement = document.querySelector("#menu-list-54");
    // console.log("menuElement", menuElement)
    // useEffect(() => {
    //   if (menuElement) {
    //     console.log("yash", menuElement.scrollTop);
    //     console.log("inisde use effect")
    //     menuElement.addEventListener("scroll", (event) => { console.log(event) });


    //     return () => {
    //       menuElement.addEventListener("scroll", (event) => { console.log(event) });
    //     }
    //   }
    //   return undefined;
    // }, [menuElement])
    return (
      // <ChakraProvider>
     
        <Menu  eventListeners={{ scroll: true }} autoSelect={false} >
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
                  {selectedLanguage} {selectedLibrary ? ` / ${selectedLibrary}` : ''}
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
                {Object.entries(requestSampleConfigs).map(([language, config]) => {
                  if (config.libraries && Object.keys(config.libraries).length > 0) {
                    return (

                      <Menu placement="right"
                        gutter={0}>
                        {({ isOpen }) => (
                          <>
                            <MenuButton
                              background="white"
                              fontSize="16px"
                              lineHeight="24px"
                              color="rgb(74, 85, 104)"
                              padding="6px 12px"
                              width="100%"
                              fontWeight={"400"}
                              _hover={{
                                ...(!isOpen && !mobile && {
                                  background: "#EDF2F7",
                                }),
                              }}
                              {...((isOpen || mobile) && {

                              })}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                {language}
                                <ChevronRightIcon
                                  boxSize={"16px"}
                                  alignSelf={"center"}
                                  strokeWidth={"1px"}
                                  stroke="rgb(74, 85, 104)"
                                />
                              </div>
                            </MenuButton>

                            <MenuList style={{ background: "white", minWidth: "150px", width: "150px", fontSize: "16px", lineHeight: "24px", color: "rgb(74, 85, 104)", padding: "0px" }}>
                              {
                                Object.keys(config.libraries || {}).map((library) => {
                                  return (
                                    <MenuItem style={{ padding: "6px 12px" }} onClick={() => {
                                      onCloseMain()
                                      setSelectedLanguage(language);
                                      setSelectedLibrary(library);
                                      window.localStorage.setItem("imagekit_stoplight_language", `${language}_${library}`)
                                      window.dispatchEvent(new Event('storage'))

                                    }}>{library}</MenuItem>
                                  )
                                })
                              }
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    )
                  } else {
                    return (
                      <MenuItem style={{ padding: "6px 12px" }} onClick={() => {
                        setSelectedLanguage(language);
                        setSelectedLibrary('');
                        window.localStorage.setItem("imagekit_stoplight_language", language)
                        window.dispatchEvent(new Event('storage'))

                      }}>{language}</MenuItem>
                    )
                  }
                })}
              </MenuList>
            </>
          )}
        </Menu>

      // </ChakraProvider>
    )
  }

  return (
    <Panel pt={0} rounded={true} isCollapsible={embeddedInMd}>
      <Panel.Titlebar py={1.5} pl={2} roundedT="lg" rightComponent={<CopyButton size="md" roundedT="lg" roundedB="lg" appearance='default' icon={copyIcon} copyValue={requestSample || ''} />}>

        <ChakraMenu></ChakraMenu>

      </Panel.Titlebar>
      <Panel.Content p={0}>
        {requestSample !== null && (
          <CodeViewer
            aria-label={requestSample}
            noCopyButton
            maxHeight="600px"
            language={mosaicCodeViewerLanguage}
            value={requestSample}
          />
        )}
      </Panel.Content>
    </Panel>
  );
});
