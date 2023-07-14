'use client'

import Link from 'next/link'

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import ASSET_QUERY from '/lib/AssetQuery.ts';

import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native-web';


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
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity key={item.asset.asset_id} style={styles.item}>
                <Link
                    href= {{
                        pathname: '/AssetPage',
                        query: {
                            asset_url: item.asset.asset_url,
                            asset_id: item.asset.asset_id,
                            creator: item.asset.creator,
                            title: item.asset.title,
                            thumbnail_url: item.asset.public_video_thumbnails[0].url,
                        },
                    }}
                >
                    <Image
                        style={styles.image}
                        source={{ uri: item.asset.public_video_thumbnails[0].url }}
                    />
                </Link>
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
    console.log('returning asset list')
    const {data} = useSuspenseQuery(
        ASSET_QUERY,
        {
            variables:{
                "filters": {"ingest_status": {"eq": "published"}}
            }
        }
    );

    var assetArray = data.public_assets_connection.edges;

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
