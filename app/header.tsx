// app/header.tsx
'use client'

import {
    Text,
    View,
    Image,
    StyleSheet,
    SafeAreaView,
} from 'react-native-web';

import Link from 'next/link'

import { EB_Garamond } from 'next/font/google'
import { loadComponents } from 'next/dist/server/load-components';

import LoginButton from './components/login_button.tsx';

const eb_garamond = EB_Garamond({
    subsets: ['latin'],
  })
const styles = StyleSheet.create(
    {
        container: {
            paddingTop: 4,
            paddingLeft: 40,
            height: 60,
            width: '100%',
            position: 'fixed',
            zIndex: 99,
            backgroundColor: 'white',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            fontWeight: 800,
            fontSize: '16px',
        },
        logo: {
            width: 68,
            height: 49,
            padding: 'auto',
            display: 'block',
        },
        headerText: {
            paddingTop: 4,
            paddingLeft: 40,
            backgroundColor: 'white',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            fontWeight: 800,
            fontSize: '32px',
        },
    }
);

// Define the Header component
export default function Header() {
  return (
    <div style={styles.container}>
        <img
            style={styles.logo}
            src='byotube-orange.png'
        />
        <Text style={styles.headerText}>BYO.Tube</Text>
        <Link
            style={{ textDecoration: "none", color: "black",  paddingLeft: 60 }}
            href='https://byo.tube/info'>the social network built on top of personal data servers
        </Link>
        <LoginButton>Log in</LoginButton>
    </div>
  );
}

