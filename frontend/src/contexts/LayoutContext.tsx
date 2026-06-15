import React, { createContext, useContext, useState } from 'react';

interface LayoutContextType {
    headerExtra: React.ReactNode;
    setHeaderExtra: (node: React.ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextType>({
    headerExtra: null,
    setHeaderExtra: () => {},
});

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [headerExtra, setHeaderExtra] = useState<React.ReactNode>(null);
    return (
        <LayoutContext.Provider value={{ headerExtra, setHeaderExtra }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => useContext(LayoutContext);
