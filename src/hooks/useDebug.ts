'use client';

import React, { useEffect, useRef } from 'react';

// Hook để debug API calls
export function useApiDebug(hookName: string, dependencies: React.DependencyList) {
    const renderCount = useRef(0);
    const prevDeps = useRef<React.DependencyList>([]);

    useEffect(() => {
        renderCount.current += 1;

        const depsChanged = dependencies.some((dep, index) =>
            dep !== prevDeps.current[index]
        );

        if (depsChanged) {
            // Debug logging removed for production
        }

        prevDeps.current = [...dependencies];
    });

    return renderCount.current;
}

// Hook để track re-renders
export function useRenderCount(componentName: string) {
    const renderCount = useRef(0);

    useEffect(() => {
        renderCount.current += 1;
        // Debug logging removed for production
    });

    return renderCount.current;
}
