'use client'

export const dynamic = "force-dynamic";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { StrictMode } from 'react';

import * as ReactDOM from 'react-dom/client';
import {createRoot} from 'react-dom/client';

import { useQuery } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

import ASSET_QUERY from './AssetLists/AssetQuery.js';

// import { useRouter } from 'next/navigation'

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
            <TouchableOpacity key={item.asset.asset_id}
                style={styles.item}
            >
                  <Image
                    style={styles.image}
                    source={{ uri: item.asset.public_video_thumbnails[0].url }}
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
    console.log('returning asset list')
    const {data} = useSuspenseQuery(
        ASSET_QUERY,
        {
            variables:{
                "filters": {"ingest_status": {"eq": "published"}}
            }
        }
    );

    console.log(data)

    var assetArray = data.public_assets_connection.edges;
    console.log(assetArray)

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
