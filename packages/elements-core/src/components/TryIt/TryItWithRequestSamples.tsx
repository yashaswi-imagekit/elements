import { Box, InvertTheme, VStack } from '@stoplight/mosaic';
import { Request as HarRequest } from 'har-format';
import * as React from 'react';

import { RequestSamples } from '../RequestSamples';
import { ResponseExamples, ResponseExamplesProps } from '../ResponseExamples/ResponseExamples';
import { TryIt, TryItProps } from './TryIt';
import { SectionTitle } from '../Docs/Sections';
import { RequestNote } from '../Docs/HttpOperation';

export type TryItWithRequestSamplesProps = Omit<TryItProps, 'onRequestChange'> &
  ResponseExamplesProps & { hideTryIt?: boolean   
    requestNoteMarkdown?: string
  };

export const TryItWithRequestSamples: React.FC<TryItWithRequestSamplesProps> = ({ hideTryIt,requestNoteMarkdown, ...props }) => {
  const [requestData, setRequestData] = React.useState<HarRequest | undefined>();
  return (
    <VStack spacing={20}>
      {!hideTryIt && (
        <InvertTheme>
          <Box >
            <TryIt {...props} onRequestChange={setRequestData} />
          </Box>
        </InvertTheme>
      )}

      {requestData &&
        <Box>
          <SectionTitle title='Request sample' size={3} pb={2}></SectionTitle>
          <RequestNote requestNoteMarkdown={requestNoteMarkdown ?? ""}/>
          <InvertTheme>
            <Box id='request-sample-unique-id'>
              <RequestSamples request={requestData} />
            </Box>
          </InvertTheme>
        </Box>
      }
    </VStack>
  );
};
