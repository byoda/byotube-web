import React from 'react';
import MyVideoJS from './VideoPlayer';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import {useParams} from "react-router-dom";

function AssetPage() {
    console.log('AssetPage')
    const { assetUrl } = useParams();
    console.log('URL: ' + assetUrl)
    // console.log('Token: ' + assetToken)

    const playerRef = React.useRef(null);

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: assetUrl,
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

    return (
        <>
            <div>Start of app here</div>
            <MyVideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            <div>Rest of app here</div>
        </>
    );
}

export default AssetPage;