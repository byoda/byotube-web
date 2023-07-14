import { ApolloWrapper } from "/lib/apollo-wrapper";

import { StyleSheet } from 'react-native-web';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <html lang="en">
            <body>
                <ApolloWrapper>{children}</ApolloWrapper>
            </body>
        </html>
    );
}