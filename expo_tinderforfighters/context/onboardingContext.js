import React, { createContext, useState, useEffect, useContext } from 'react';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState({});

    const updateOnboarding = (newData) => {
        const test = {...onboardingData, ...newData};
        console.log('onboarding data', test);
        setOnboardingData(prev => ({ ...prev, ...newData }));
    };

    return (
        <OnboardingContext.Provider value={{ onboardingData, updateOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    )
};

export const useOnboarding = () => useContext(OnboardingContext);