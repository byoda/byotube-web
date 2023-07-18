import React from 'react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import videojs from '!video.js';
import 'video.js/dist/video-js.css';

export const MyVideoJS = (props) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);
    const {options, onReady, content_token, key_id} = props;


    videojs.Vhs.xhr.beforeRequest = function (options) {
        if (options.headers == undefined){
            options.headers = {}
        }
        if (content_token) {
            videojs.log(`Adding authorization headers with key_id ${key_id} and token ${content_token}`)
            options.headers["Authorization"] = `Bearer ${content_token}`
            options.headers["X-AuthorizationKeyId"] = key_id
        }

        return options;
    };

    React.useEffect(
        () => {
            // Make sure Video.js player is only initialized once
            if (!playerRef.current) {
                // The Video.js player needs to be _inside_ the component el for
                // React 18 Strict Mode.
                const videoElement = document.createElement("video-js");

                videoElement.classList.add('vjs-big-play-centered');
                videoRef.current.appendChild(videoElement);

                const player = playerRef.current = videojs(
                    videoElement, options, () => {
                      videojs.log('player is ready');
                        onReady && onReady(player);
                    }
                );

            // You could update an existing player in the `else` block here
            // on prop change, for example:
            } else {
                const player = playerRef.current;

                player.autoplay(options.autoplay);
                player.src(options.sources);
            }
        },
        [options, videoRef, onReady]
    );

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(
        () => {
            const player = playerRef.current;

            return () => {
                if (player && !player.isDisposed()) {
                    player.dispose();
                    playerRef.current = null;
                }
            };
        },
        [playerRef]
    );

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
        </div>
    );
}

export default MyVideoJS;