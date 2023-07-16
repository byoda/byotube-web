'use client'

import React from 'react';


import { useSearchParams } from 'next/navigation'

import videojs from 'video.js';
import 'video.js/dist/video-js.css';

import MyVideoJS from './VideoPlayer.js';

type Asset = {
    asset_id: string;
    asset_url: string;
    title: string;
    thumbnail_url: string;
    creator: string;
    public_video_thumbnails: string[];
}

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
    let key_id = searchParams.get('key_id')
    let content_token = searchParams.get('content_token')

    if (key_id) {
        asset.asset_url += `?key_id=${key_id}`
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


    return (
        <>
            <div>Start of app here</div>
            <MyVideoJS options={videoJsOptions} onReady={handlePlayerReady} content_token={content_token} />
            <div>Rest of app here</div>
        </>
    );
}

export default AssetPage;