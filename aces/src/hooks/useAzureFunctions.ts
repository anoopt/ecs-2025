import * as React from 'react';
import { AadHttpClient, AadHttpClientFactory } from "@microsoft/sp-http";
import { APP_ID, AZURE_FUNCTION_GET_POPULATION_BY_CITIES, AZURE_FUNCTION_GET_DUSSELDORF_LANDMARKS } from '../constants/constants';

export const useAzureFunctions = (aadHttpClientFactory: AadHttpClientFactory): any => {
    const clientRef: React.MutableRefObject<AadHttpClient | undefined> = React.useRef<AadHttpClient>();

    const getClient = React.useCallback(async () => {
        if (!aadHttpClientFactory) {
            return undefined;
        }
        const client = await aadHttpClientFactory.getClient(APP_ID);
        clientRef.current = client;
    }, [aadHttpClientFactory]);

    const callAzureFunction = React.useCallback(
        async (functionName: string, request: any, method: 'get' | 'post' = 'post'): Promise<any> => {
            try {
                if (!clientRef.current) {
                    await getClient();
                }

                const requestHeaders: any = {};
                requestHeaders['Content-Type'] = 'application/json';

                let requestParams = '';
                if (method === 'get' && request) {
                    // Add request params to URL query string
                    const params = new URLSearchParams(request).toString();
                    functionName += `?${params}`;
                } else if (method === 'post') {
                    requestParams = JSON.stringify(request);
                }

                const response = await clientRef.current![method](
                    functionName,
                    AadHttpClient.configurations.v1,
                    {
                        headers: requestHeaders,
                        body: requestParams
                    }
                );

                console.log('response', response);
                const result = await response.json();
                console.log('Azure function result - ', result);
                return result;
            } catch (error) {
                if (!DEBUG) {
                    console.error('Error:', error);
                }
                return undefined;
            }
        },
        [getClient]
    );

    const getPopulationByCities = React.useCallback(
        async () => {
            return await callAzureFunction(AZURE_FUNCTION_GET_POPULATION_BY_CITIES, { });
        },
        [callAzureFunction]
    );

    const getDusseldorfLandmarks = React.useCallback(
        async () => {
            return await callAzureFunction(AZURE_FUNCTION_GET_DUSSELDORF_LANDMARKS, { });
        },
        [callAzureFunction]
    );

    return { getPopulationByCities, getDusseldorfLandmarks };
};