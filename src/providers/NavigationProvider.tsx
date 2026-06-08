import { createContext, useContext, useState } from "react";

type NavigationContextType = {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined,
);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeSection, setActiveSection] = useState("");

  return (
    <NavigationContext.Provider
      value={{
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigationContext must be used within NavigationProvider",
    );
  }

  return context;
};
