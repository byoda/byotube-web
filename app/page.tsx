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
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
    ActivityIndicator,
} from 'react-native-web';

import Link from 'next/link'

import { useRouter } from 'next/navigation';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
// export const dynamic = 'force-dynamic';
export const revalidate = 300;

// import styles from './site.module.css';

import {
    AssetEdge,
    ApiResponseGetAssets,
    Asset,
    VideoThumbnail,
} from './data_types';

import { constants } from './constants';

const styles = StyleSheet.create(
    {
        // this is the area to be used for the scrollable flatlist
        scrollbox: {
            overflow: 'auto',
            backgroundColor: 'white',
        },
        // The item to be displayed in each cell of the flatlist
        asset: {
            width: 340,
            margin: 10,
            alignItems: 'left',
        },
        // The image of
        poster: {
            width: 340,
            height: 170,
            borderRadius: 8,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 8,
        },
        title: {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            marginTop: 8,
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'left',
        },
        youtube_icon: {
            width: 32,
            height: 32,
            justifyContent: 'right',
        },
        creator: {
            marginTop: 8,
            fontSize: 16,
            fontWeight: 'normal',
            textAlign: 'left',
        },
        flatlist: {
            marginTop: 60,
        },
    }
);

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [asset_edges, setAssetEdges] = useState([]);
    const [offset, setOffset] = useState(0);
    const [cursor, setCursor] = useState('');

    const [isListEnd, setIsListEnd] = useState(false);

    useEffect(() => getData(), []);
    const router = useRouter()

    const initialState = {
        auth_token: typeof window !== "undefined" ? window.localStorage.getItem('authToken') : null,
        member_id: typeof window !== "undefined" ?  window.localStorage.getItem('memberId') : null,
        custom_domain: typeof window !== "undefined" ? window.localStorage.getItem('customDomain') : null,
        isAuthenticated: null,
        user: null
    };

    const getData = () => {
        if (initialState.auth_token == null) {
            console.log('Getting data from the Service API')
            get_service_data();
        } else {
            console.log('Getting data from the Data API of the pod')
            get_member_data()
        }
    }

    const get_member_data = () => {
        if (!loading && !isListEnd) {
            setLoading(true);
            console.log('loading data from member with cursor: ' + cursor);

            let host_url;
            if (initialState.custom_domain) {
                host_url = 'https://' + initialState.custom_domain
            } else {
                host_url = `https://proxy.${constants.BYODA_NETWORK}/${constants.BYOTUBE_SERVICE_ID}/${initialState.member_id}`;
            }
            const data_url = `${host_url}/api/v1/data/${constants.BYOTUBE_SERVICE_ID}/feed_assets/query`;

            const request = async () => {
                const response = await fetch(
                    data_url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${initialState.auth_token}`,
                        },
                        body: JSON.stringify(
                            {
                                first: 25,
                                after: cursor,
                                depth: 0,
                                fields: ['asset_id', 'asset_url', 'creator', 'creator_thumbnail', 'title', 'video_thumbnails', 'ingest_status', 'publisher_asset_id']
                            }
                        )
                    }
                )
                console.log(`Response from the API call: ${response.status}`);
                if (response.status == 200) {
                    const asset_page: ApiResponseGetAssets = await response.json();
                    setCursor(asset_page.page_info.end_cursor);
                    if (asset_page.page_info.has_next_page == false) {
                        setIsListEnd(true);
                    }
                    if (asset_page.total_count > 0) {
                        select_thumbnails(asset_page.edges);
                        setAssetEdges([...asset_edges, ...asset_page.edges]);
                        if (asset_edges.length > 100) {
                            setIsListEnd(true);
                        }
                    } else {
                        alert('Member Data API call failed. Please try again.')
                    }
                }
            };

            try {
                request();
            } catch(error) {
                console.error(error);
            }
        }
    }

    const get_service_data = () => {
        if (!loading && !isListEnd) {
            setLoading(true);
            console.log('loading data from Service API with offset: ' + offset);
            // Service to get the data from the server to render
            const url = `https://${constants.BYOTUBE_API}/api/v1/service/data?first=25&after=${offset}`
            console.log('URL: ' + url)
            fetch(url)
                // Sending the currect offset with get request
                .then((response) => response.json())
                .then(
                    (asset_page: ApiResponseGetAssets) => {
                        console.log('Fetched page with ' + asset_page.total_count + ' edges');
                        if (asset_page.total_count > 0) {
                            setOffset(offset + asset_page.total_count);
                            select_thumbnails(asset_page.edges);
                            setAssetEdges([...asset_edges, ...asset_page.edges]);
                            setLoading(false);
                            if (asset_edges.length > 100) {
                                setIsListEnd(true);
                            }
                        } else {
                            setIsListEnd(true);
                            setLoading(false);
                        }
                    }
                )
                .catch((error) => {
                    console.error(error);
                }
            );
        }
    };

    function select_thumbnails(edges: AssetEdge[]) {
        for (let i = 0; i < edges.length; i++) {
            let asset: Asset = edges[i].node;
            asset.video_thumbnail = '';
            var index: number;
            for (index = asset.video_thumbnails.length - 1; index >= 0; index--) {
                let thumbnail: VideoThumbnail = asset.video_thumbnails[index]
                if (thumbnail.height > 720) {
                    // console.log('Found >720p thumbnail: ' + thumbnail.url + ' for asset: ' + asset.asset_id)
                    asset.video_thumbnail = thumbnail.url;
                } else if (thumbnail.height == 720) {
                    asset.video_thumbnail = thumbnail.url;
                    // console.log('Found 720p thumbnail: ' + thumbnail.url)
                    break;
                }
            }
            if (! asset.video_thumbnail) {
                let video_thumbnails = asset.video_thumbnails;
                let thumbnail: VideoThumbnail = null;
                if (video_thumbnails.length) {
                    thumbnail = video_thumbnails.shift();
                    if (video_thumbnails.length) {
                        thumbnail = video_thumbnails.shift();
                        // console.log('Using last-resort 2nd thumbnail with height: ' + thumbnail.height + ' for asset: ' + asset.asset_id);
                    } else {
                        // console.log('Using last-resort 1st thumbnail with height: ' + thumbnail.height + ' for asset: ' + asset.asset_id);
                    }
                    asset.video_thumbnail = thumbnail.url;
                } else {
                    asset.video_thumbnail = 'byotube-orange.png'
                }
            }
        }
    }

    const RenderItem = ({item}) => {
        // console.log('Rendering item: ' + item.node.asset_id + ' - title: ' + item.node.title);
        return (
            // Flat List Item
            <SafeAreaView style={styles.asset}>
                <Pressable key={item.node.asset_id}
                    onPress={() => getItem(item)}
                >
                    <Image
                        style={styles.poster}
                        source={{ uri: item.node.video_thumbnail }}
                        alt={`Thumbnail for ${item.node.title}`}
                    />
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: item.node.creator_thumbnail }}
                                        alt={`Avatar for ${item.node.creator}`}
                                        />
                                </td>
                                <td>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode={'tail'}
                                        style={styles.title}>
                                            {item.node.title}
                                    </Text>
                                </td>
                                <td>
                                    <Link href={'https://youtube.com/' + item.node.publisher_asset_id}>
                                        <Image
                                            style={styles.youtube_icon}
                                            source={item.node.ingest_status === 'external' ? 'YouTube_icon.png' : ''}
                                            alt={'This video is hosted at YouTube'}
                                        />
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Text style={styles.creator}>{item.node.creator}</Text>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Pressable>
            </SafeAreaView>
        );
    };

    const getItem = (edge: AssetEdge) => {
        // Function for click on an item
        const SIGNEDBY = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        const SIGNED_TOKEN = "dummy"

        let asset: Asset = edge.node
        if (asset.ingest_status != 'external') {
            let apiUrl: string = `https://proxy.${constants.BYODA_NETWORK}/${constants.BYOTUBE_SERVICE_ID}/${edge.origin}/api/v1/pod/content/token?asset_id=${asset.asset_id}&service_id=${constants.BYOTUBE_SERVICE_ID}&signedby=${SIGNEDBY}&token=${SIGNED_TOKEN}&ingest_status=${asset.ingest_status}`
            fetch(apiUrl)
                .then((response) => response.json())
                .then(
                    (data) => {
                        let query_string = `?asset_url=${asset.asset_url}&asset_id=${asset.asset_id}&creator=${asset.creator}&title=${asset.title}&thumbnail_url=${asset.video_thumbnail}&key_id=${data.key_id}&content_token=${data.content_token}&creator_thumbnail=${data.creator_thumbnail}`
                        let url = '/AssetPage' + query_string
                        // return <Link href={url} />
                        console.log('Calling: ' + url);
                        router.push(url)
                    }
                )
                .catch(
                    (error) => {
                        console.error(error);
                    }
                );
        } else {
            let query_string = `?asset_url=${asset.asset_url}&asset_id=${asset.asset_id}&creator=${asset.creator}&title=${asset.title}&thumbnail_url=${asset.video_thumbnail}&ingest_status=${asset.ingest_status}`
            let url = '/AssetPage' + query_string
            // return <Link href={url} />
            console.log('External asset, calling: ' + url);
            router.push(url)
        }
    }

    return (
        <SafeAreaView style={styles.scrollbox} >
            <FlatList style={styles.flatlist}
                numColumns={5}
                data={asset_edges}
                keyExtractor={(edge) => edge.node.asset_id}
                renderItem={({ item }) => <RenderItem item={item}/>}
                // initialNumToRender={30}
                onEndReached={getData}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    )
};