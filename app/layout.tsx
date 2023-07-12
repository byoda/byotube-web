import { ApolloWrapper } from "/lib/apollo-wrapper";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
}) {
    return (
        <html lang="en">
            <body>
                <table>
                    <tr>BYO Tube</tr>
                    <tr><ApolloWrapper>{children}</ApolloWrapper></tr>
                </table>
            </body>
        </html>
    );
}