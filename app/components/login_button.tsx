import React from 'react';

import {
    Button
} from 'react-native-web';

import Link from 'next/link'

function LoginButton() {
    return (
        <Link href="/login">
            <Button title="Login"/>
        </Link>
    )
}

export default LoginButton;