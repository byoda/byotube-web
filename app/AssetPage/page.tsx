'use client'

import React from 'react';

import { StyleSheet } from 'react-native-web';


import { useSearchParams } from 'next/navigation'

import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import Asset from '/lib/types.ts';

import MyVideoJS from './VideoPlayer.js';

function AssetPage(data: any) {
    console.log('AssetPage')

    const searchParams = useSearchParams();
    let asset = {
        asset_url: searchParams.get('asset_url'),
        asset_id: searchParams.get('asset_id'),
        title: searchParams.get('title'),
        thumbnail_url: searchParams.get('thumbnail_url'),
        creator: searchParams.get('creator'),
    }
    console.log('URL: ' + asset.asset_url)

    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: false,
        controls: true,
        poster: asset.thumbnail_url,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: asset.asset_url,
                type: 'application/dash+xml'
            }
        ]
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on(
            'waiting', () => {
                videojs.log('player is waiting');
            }
        );

        player.on(
            'dispose', () => {
                videojs.log('player will dispose');
            }
        );
    };

    const SERVICE_ID = "4294929430"
    const MEMBER_ID = "94f23c4b-1721-4ffe-bfed-90f86d07611a"
    const SIGNEDBY = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
    const TOKEN = "dummy"
    let apiUrl = `https://proxy.byoda.net/${SERVICE_ID}/${MEMBER_ID}/api/v1/pod/content/token?asset_id=${asset.asset_id}&service_id=${SERVICE_ID}&signedby=${SIGNEDBY}&token=${TOKEN}`

    let token = ''
    let keyId = ''
    fetch(apiUrl
    ).then(
        (response) => response.json()
    ).then(
        (data) => {
            token = data.content_token
            keyId = data.key_id
            const videoUrl = `${asset.asset_url}?key_id=${keyId}`
            // const headers = { Authorization: `${token}` };
            console.log(`URL: ${videoUrl}, token: ${token}`)
        }
    ).catch(
        (error) => {
                // Handle any errors
                console.error(error);
        }
    );
    return (
        <>
            <div>Start of app here</div>
            <MyVideoJS options={videoJsOptions} onReady={handlePlayerReady} token={token} />
            <div>Rest of app here</div>
        </>
    );
}

const styles = StyleSheet.create(
    {
        video: {
            innerHeight: 240,
            innerWidth: 320,
            alignItems: 'center',
        },
        image: {
            width: 340,
            height: 170,
            borderRadius: 8,
        },
        title: {
            marginTop: 8,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
        },
        creator: {
            marginTop: 8,
            fontSize: 16,
            fontWeight: 'normal',
            textAlign: 'left',
        },
    }
);
export default AssetPage;