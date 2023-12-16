// app/header.tsx
'use client'

import {
    Text,
    Pressable,
    StyleSheet,
} from 'react-native-web';

import Link from 'next/link'

import { EB_Garamond } from 'next/font/google'

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
        login: {
            width: 32,
            height: 32,
            padding: 'auto',
            display: 'block',
            float: 'right',
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
            href='https://byo.tube/info'>the social network running on personal data servers
        </Link>
        <Link href='/login'>
            <Pressable title='Login'>
                <img src='login.png' style={styles.login}/>
            </Pressable>
        </Link>
    </div>
  );
}

