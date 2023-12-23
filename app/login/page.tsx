'use client'

// import { Metadata } from 'next'

// export const metadata: Metadata = {
//  title: 'BYO.Tube',
// }
// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
    SafeAreaView,
    TextInput,
    StyleSheet,
    Pressable,
} from 'react-native-web';

import { useRouter } from 'next/navigation';

import { constants } from '../constants';

const styles = StyleSheet.create(
    {
        // this is the area to be used for the scrollable flatlist
        login_table: {
            margin: 100,
            overflow: 'auto',
            backgroundColor: 'white',
        },
    }
);

export default function LoginPage() {
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [authToken, setAuthToken] = useState('');

    useEffect(() => logIn(), []);
    const router = useRouter();

    const logIn = () => {
        if (memberId.length > 0) {
            console.log('Logging in with member ID ' + memberId);
            const username = memberId.substring(0, 8)
            let host_url
            console.log('Custom domain: ' + customDomain)
            if (customDomain.split('.').length > 1) {
                host_url = 'https://' + customDomain
            } else {
                host_url = `https://${memberId}.members-${constants.BYOTUBE_SERVICE_ID}.${constants.BYODA_NETWORK}`
            }
            const login_url = `${host_url}/api/v1/pod/authtoken`
            try {
                console.log('Calling authtoken api for member: ' + memberId + ' with password ' + password);
                const request = async () => {
                    const rawResponse = await fetch(
                        login_url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    username: username,
                                    password: password,
                                    service_id: constants.BYOTUBE_SERVICE_ID,
                                }
                            )
                        }
                    )
                    console.log('Response from the API call: ' + rawResponse.status)
                    if (rawResponse.status == 200) {
                        const content = await rawResponse.json();
                        localStorage.setItem('memberId', memberId);
                        localStorage.setItem('customDomain', customDomain);
                        localStorage.setItem('authToken', content['auth_token']);
                        router.back();
                    } else {
                        alert('Login failed. Please try again.')
                    }
                }
                request()
            } catch(error) {
                console.error(error);
            }
        }
    };
    return (
        <SafeAreaView styyle={{padding: 10}}>
            <table style={styles.login_table}>
                <tbody>
                <tr>
                        <td>Custom domain</td>
                        <td>
                            <TextInput style={{height: 40}}
                                placeholder='(Custom domain)'
                                onChangeText={setCustomDomain}
                                defaultValue={customDomain}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Member ID</td>
                        <td>
                            <TextInput style={{height: 40}}
                                placeholder='Member ID'
                                onChangeText={setMemberId}
                                defaultValue={memberId}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td>
                            <TextInput style={{height: 40}}
                                placeholder='Password'
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry={true}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Pressable
                                onPress={logIn}
                                title='Log in'
                                role='Log in'
                            >
                                <img src='login.png' style={styles.login}/>
                            </Pressable>
                        </td>
                    </tr>
                </tbody>
            </table>
        </SafeAreaView>
    )
}

