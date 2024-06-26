import { LinkHeading as MosaicLinkHeading, LinkHeadingProps } from '@stoplight/mosaic';
import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { RouterTypeContext, useRouterType } from '../context/RouterType';
import { HostContext } from '../context/Host';

export const LinkHeading = React.memo<LinkHeadingProps & { mobile?: boolean }>(function LinkHeading(props) {
  const isUsingRouter = !!useRouterType();
  const Comp = isUsingRouter ? CustomLinkHeading : MosaicLinkHeading;

  return <Comp {...props} />;
});

const CustomLinkHeading = React.memo<LinkHeadingProps & { mobile?: boolean }>(function LinkHeading({ id: _id, ...props }) {
  const { pathname } = useLocation();
  const routerKind = React.useContext(RouterTypeContext);
  const { host, locationPath, mobile } = React.useContext(HostContext);
  const route = pathname.split('#')[0];
  const id = routerKind === 'hash' ? `${route}#${_id}` : _id;
  const copy = React.useMemo(
    () => () => {
      if (navigator?.clipboard?.writeText) {
        const url = new URL(host);
        url.pathname = `docs/api-reference${locationPath}`;
        url.hash = `#${id}`;
        navigator.clipboard.writeText(url.toString());
      }
    },
    [route, id, locationPath]
  );
  return (<div><MosaicLinkHeading className='' id={id} {...props} onClick={copy} />
    <style>
      {`
    ${mobile && ".sl-link-heading__icon{\
      opacity: 1;\
    }"}
    `}
    </style>
  </div>)
});
