"use client";

import React from 'react'

import {
    ApolloLink,
    HttpLink,
    SuspenseCache,
} from "@apollo/client";

import {
    ApolloNextAppProvider,
    NextSSRInMemoryCache,
    SSRMultipartLink,
    NextSSRApolloClient,
} from "@apollo/experimental-nextjs-app-support/ssr";

function makeClient() {
    const httpLink = new HttpLink(
        {
            uri: 'https://azure.byoda.me/api/v1/data/service-4294929430/',
        }
    );

    return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
            typeof window === "undefined" ? ApolloLink.from(
                [
                    new SSRMultipartLink(
                        {
                            stripDefer: true,
                        }
                    ),
                    httpLink,
                ]
            ) : httpLink,
        }
    );
}

function makeSuspenseCache() {
    return new SuspenseCache();
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider
            makeClient={makeClient}
            makeSuspenseCache={makeSuspenseCache}
        >
            {children}
        </ApolloNextAppProvider>
    );
}