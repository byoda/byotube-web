'use client'

import { useRouter } from 'next/navigation';

import Link from 'next/link'

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import ASSET_QUERY from './AssetQuery.js';

import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native-web';

type Asset = {
    asset_id: string;
    asset_url: string;
    title: string;
    thumbnail_url: string;
    creator: string;
    public_video_thumbnails: string[];
}

const styles = StyleSheet.create(
    {
        navbar: {
            innerHeight: 16,
        },
        video: {
            innerHeight: 240,
            innerWidth: 320,
            alignItems: 'center',
        },
        item: {
            flex: 1,
            margin: 10,
            alignItems: 'left',
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

function AssetGrid({ data }) {
    const router = useRouter()

    const handleGridItemClick = (asset: Asset) => {
        const SERVICE_ID = "4294929430"
        const MEMBER_ID = "94f23c4b-1721-4ffe-bfed-90f86d07611a"
        const SIGNEDBY = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
        const TOKEN = "dummy"
        let apiUrl = `https://proxy.byoda.net/${SERVICE_ID}/${MEMBER_ID}/api/v1/pod/content/token?asset_id=${asset.asset_id}&service_id=${SERVICE_ID}&signedby=${SIGNEDBY}&token=${TOKEN}`
        fetch(apiUrl
            ).then(
                (response) => response.json()
            ).then(
                (data) => {
                    console.log(`key ID: ${data.key_id} content token: ${data.content_token}`)
                    let query_string = `?asset_url=${asset.asset_url}&asset_id=${asset.asset_id}&creator=${asset.creator}&title=${asset.title}&thumbnail_url=${asset.public_video_thumbnails[0]}&key_id=${data.key_id}&content_token=${data.content_token}`
                    let url = '/AssetPage' + query_string
                    router.push(url)
                }
            ).catch(
                (error) => {
                    // Handle any errors
                    console.error(error);
                }
            );
        };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity key={item.asset.asset_id} style={styles.item}
                onPress={() => handleGridItemClick(item.asset)}
            >

                <Image
                    style={styles.image}
                    source={{ uri: item.asset.public_video_thumbnails[0].url }}
                    alt={`Thumbnail for ${item.asset.title}`}
                />
                <Text style={styles.title}>{item.asset.title}</Text>
                <Text style={styles.creator}>{item.asset.creator}</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            data={data}
            numColumns={4}
            renderItem={renderItem}
            keyExtractor={(item) => item.asset.asset_id}
        />
    );
}

function AssetList() {
    const {data} = useSuspenseQuery(
        ASSET_QUERY,
        {
            variables:{
                "filters": {"ingest_status": {"eq": "published"}}
            }
        }
    );

    let assetData = data as any;
    var assetArray = assetData.public_assets_connection.edges;

    return (
        <div>
            <AssetGrid data={assetArray} />
        </div>
    );
}

export default function Page() {
    return (
        <SafeAreaView>
            <AssetList />
        </SafeAreaView>
    );
};
