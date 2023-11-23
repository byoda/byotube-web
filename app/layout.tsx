import {
    StyleSheet,
    View,
} from 'react-native-web';

import Header from "./header"

const styles = StyleSheet.create(
    {
        body: {
            height: '100%',
            margin: 0,
        },
        wrapper: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        header: {
            backgroundColor: 'silver',
            text: 'green',
        },
        footer: {
            backgroundColor: 'silver',
        },
        content: {
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'white',
        }
    }
)

export default function RootLayout(
    {
        children,
    }: {
        children: React.ReactNode
    }
) {
    return (
        <html lang="en">
            <body style={styles.body}>
                <Header />
                {children}
            </body>
        </html>
    )
}