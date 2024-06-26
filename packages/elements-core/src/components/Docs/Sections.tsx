import { AlignSelfVals, Box, Flex, FlexDirectionVals, FontSizeVals, FontWeightVals, HeadingProps, LineHeights, Panel, PanelProps, SpaceVals, VStack } from '@stoplight/mosaic';
import * as React from 'react';

import { slugify } from '../../utils/string';
import { LinkHeading } from '../LinkHeading';

export interface ISectionTitle {
  title: string;
  id?: string;
  size?: HeadingProps['size'];
  isCompact?: boolean;
  alignSelf?: AlignSelfVals
  direction?: FlexDirectionVals
  pb?: SpaceVals
  fontWeight?: FontWeightVals
  fontSize?: FontSizeVals
  lineHeight?: LineHeights
  pr?: SpaceVals
  mobile?: boolean
}

export const SectionTitle: React.FC<ISectionTitle> = ({ title, id, size = 2, isCompact = false, fontWeight = undefined, fontSize = undefined, lineHeight = undefined, alignSelf = "center", direction = "row", pb = 0, children, pr = 6, mobile=false }) => {
  return (
    <Flex w="full" flexDirection={direction}>
      <Box py={0} pb={pb} pr={6} color={"#1A202C"} fontSize={fontSize ?? undefined} fontWeight={fontWeight ?? "normal"} lineHeight={lineHeight ?? "normal"} mobile={mobile ?? false} as={LinkHeading} size={size} aria-label={title} id={id || slugify(title)}>
        {title}
      </Box>
      <Flex alignSelf={alignSelf} py={0} pb={pb} flexGrow style={{ minWidth: 0 }} justify={isCompact ? 'end' : undefined}>
        {children}
      </Flex>
    </Flex>
  );
};

export const SectionSubtitle: React.FC<ISectionTitle> = ({ size, ...props }) => {
  return <SectionTitle {...props} size={size} />;
};

type SubSectionPanelProps = {
  title: React.ReactNode;
  hasContent?: boolean;
  rightComponent?: React.ReactNode;
};

export const SubSectionPanel: React.FC<SubSectionPanelProps & Pick<PanelProps, 'defaultIsOpen' | 'onChange'>> = ({
  title,
  children,
  hasContent,
  rightComponent,
  defaultIsOpen = true,
  onChange,
}) => {
  return (
    <Panel isCollapsible={hasContent} defaultIsOpen={defaultIsOpen} onChange={onChange} appearance='outlined' >
      <Panel.Titlebar fontWeight="medium" appearance="minimal" icon="" rightComponent={rightComponent}>
        <div role="heading">{title}</div>
      </Panel.Titlebar>

      {hasContent !== false && <Panel.Content>{children}</Panel.Content>}
    </Panel>
  );
};
