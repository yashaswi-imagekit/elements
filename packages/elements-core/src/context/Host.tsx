import React from "react";

interface HostInterface {
  host: string
  locationPath: string
  mobile: boolean
}
export const HostContext = React.createContext<HostInterface>({
  host: "",
  locationPath: "",
  mobile: false
});

export const HostProvider = ({ children, host, locationPath, mobile }: { children: any, host: string, locationPath: string, mobile: boolean }) => {

  return (
    <HostContext.Provider value={{ host, locationPath, mobile }}>
      {children}
    </HostContext.Provider>
  );
};