'use client'

import React from 'react';

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native-web';

import Link from 'next/link'

import { useSearchParams } from 'next/navigation'

import videojs from 'video.js';
import 'videojs-youtube';


import 'video.js/dist/video-js.css';

import MyVideoJS from './VideoPlayer.js';

import { Asset } from '../data_types';

const styles = StyleSheet.create(
    {
        // this is the area to be used for the scrollable flatlist
        video_box: {
            width: '560',
            height: '315',
            backgroundColor: 'white',
        },
        video_info_box: {
            width: '560',
            height: '80',
            backgroundColor: 'white',
        },

        avatar: {
            leftMargin: 40,
            width: 32,
            height: 32,
            borderRadius: 8,
        },
    }
);

function AssetPage(data: any) {
    const searchParams = useSearchParams();
    let asset: Asset = {
        asset_url: searchParams.get('asset_url'),
        asset_id: searchParams.get('asset_id'),
        title: searchParams.get('title'),
        video_thumbnail: searchParams.get('thumbnail_url'),
        creator: searchParams.get('creator'),
        creator_thumbnail: searchParams.get('creator_thumbnail'),
        ingest_status: searchParams.get('ingest_status'),
        video_thumbnails: null,
        publisher_asset_id: null
    }
    let key_id = searchParams.get('key_id')
    let content_token = searchParams.get('content_token')

    if (key_id) {
        asset.asset_url += `?key_id=${key_id}`
    }

    const playerRef = React.useRef(null);

    let type: string = 'application/dash+xml'
    if (asset.ingest_status == 'external') {
        type = 'video/youtube'
    }

    // Videojs-youtube docs: https://github.com/videojs/videojs-youtube
    // YouTube options: https://developers.google.com/youtube/player_parameters?hl=en#Parameters
    let videoJsOptions = {
        autoplay: false,
        controls: true,
        poster: asset.video_thumbnail,
        responsive: true,
        // fluid: true,
        width: '1120',
        height: '630',
        sources: [
            {
                src: asset.asset_url,
                type: type
            }
        ]
    };

    if (asset.ingest_status == 'external') {
        videoJsOptions['techOrder'] = ['youtube'];
        // videoJsOptions['autoplay'] = true;
    }

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
        <SafeAreaView>
            <View style={styles.video_info_box}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <View>
                                <MyVideoJS style={styles.video_box} options={videoJsOptions} onReady={handlePlayerReady} content_token={content_token} key_id={key_id} />
                                </View>
                            </td>
                        </tr>
                        <tr>
                            <td align='left' width='10%'>
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: asset.creator_thumbnail }}
                                    alt={`Avatar for ${asset.creator}`}
                                />
                            </td>
                            <td align='left' width='80%'>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style={styles.title}>
                                    {asset.title}
                                </Text>
                                <Link href={'https://youtube.com/' + asset.publisher_asset_id}>
                                    <Image
                                        style={styles.youtube_icon}
                                        source={asset.ingest_status === 'external' ? 'YouTube_icon.png' : ''}
                                        alt={'This video is hosted at YouTube'}
                                    />
                                </Link>
                                <Text style={styles.creator}>{asset.creator}</Text>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </View>
        </SafeAreaView>
    );
}

export default AssetPage;
