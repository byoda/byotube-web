import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigate } from 'react-router-dom';


function AssetGrid({ data }) {
    let navigate = useNavigate();

    const handleGridItemClick = (assetUrl, assetId) => {
        const SERVICE_ID = "4294929430"
        const MEMBER_ID = "94f23c4b-1721-4ffe-bfed-90f86d07611a"
        const ASSET_ID = assetId
        const SIGNEDBY = "a77f0c8a-faf9-479c-90e4-0680a37e29b9"
        const TOKEN = "dummy"
        const apiUrl = `https://proxy.byoda.net/${SERVICE_ID}/${MEMBER_ID}/api/v1/pod/content/token?asset_id=${ASSET_ID}&service_id=${SERVICE_ID}&signedby=${SIGNEDBY}&token=${TOKEN}`;


        fetch(apiUrl)
            .then(
                (response) => response.json()
            ).then(
                (data) => {
                    const token = data.content_token
                    const keyId = data.key_id
                    const videoSource = `${assetUrl}?key_id=${keyId}`
                    // const headers = { Authorization: `${token}` };
                    console.log(`URL: ${videoSource}, token: ${token}`)
                    navigate(`/assetPage/${encodeURIComponent(videoSource)}/${token}`);
                }
            ).catch(
                (
                    error) => {
                    // Handle any errors
                    console.error(error);
                }
            );
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <TouchableOpacity
                key={item.asset.asset_id}
                style={styles.item}
                onPress={
                    () => handleGridItemClick(
                        item.asset.asset_url, item.asset.asset_id,
                    )
                }
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
            numColumns={4} // Set the number of columns in the grid
            renderItem={renderItem}
            keyExtractor={(item) => item.asset.asset_id}
        />
    );
}

const styles = StyleSheet.create({
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
});

export default AssetGrid;