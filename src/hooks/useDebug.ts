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
            console.log(`🔄 [${hookName}] API Call #${renderCount.current}`, {
                dependencies,
                previousDependencies: prevDeps.current,
                changedDeps: dependencies.map((dep, index) => ({
                    index,
                    current: dep,
                    previous: prevDeps.current[index],
                    changed: dep !== prevDeps.current[index]
                })).filter(item => item.changed)
            });
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
        console.log(`🔄 [${componentName}] Render #${renderCount.current}`);
    });

    return renderCount.current;
}
