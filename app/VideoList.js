import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {gql, useQuery} from '@apollo/client';
import AssetGrid from './AssetGrid';

const ASSET_QUERY = gql`
    query ($filters: assetInputFilter,
            $first: Int, $after: String, $depth: Int, $relations: [String!],
            $remote_member_id: UUID, $timestamp: DateTime,
            $origin_member_id: UUID, $origin_signature: String, $signature_format_version: Int) {
        public_assets_connection(filters: $filters, first: $first, after: $after,
                depth: $depth, relations: $relations, remote_member_id: $remote_member_id, timestamp: $timestamp,
                origin_member_id: $origin_member_id, origin_signature: $origin_signature,
                signature_format_version: $signature_format_version) {
            total_count
            edges {
                cursor
                origin
                asset {
                    created_timestamp
                    asset_id
                    asset_type
                    asset_url
                    asset_merkle_root_hash
                    public_video_thumbnails {
                        thumbnail_id
                        url
                        width
                        height
                        preference
                        video_id
                    }
                    monetizations
                    locale
                    creator
                    published_timestamp
                    content_warnings
                    public_claims {
                        claim_id
                        claims
                        issuer
                        issuer_type
                        object_type
                        keyfield
                        keyfield_id
                        object_fields
                        requester_id
                        requester_type
                        signature
                        signature_timestamp
                        signature_format_version
                        signature_url
                        renewal_url
                        confirmation_url
                        cert_fingerprint
                        cert_expiration
                    }
                    copyright_years
                    publisher
                    publisher_asset_id
                    title
                    subject
                    contents
                    keywords
                    annotations
                    forum
                    channel_id
                    root_asset_id
                    root_asset_class
                    response_to_asset_id
                    ingest_status
                    encoding_profiles
                    screen_orientation_horizontal
                }
            }
            page_info {
                end_cursor
                has_next_page
            }
        }
    }
`;

function AssetList() {
    console.log('returning asset list')
    const {loading, error, data} = useQuery(
      ASSET_QUERY,
      {
          variables:{
              "filters": {"ingest_status": {"eq": "published"}}
          }
      }
    );

    console.log(data)

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.infoText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={[styles.infoText, styles.errorText]}>
                    Error: {error.message}
                </Text>
          </View>
        );
    }

    var assetArray = data.public_assets_connection.edges;
    console.log(assetArray)

    return (
        <div>
            <h1>Video List</h1>
            <AssetGrid data={assetArray} />
        </div>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#fff',
            justifyContent: 'center',
        },
        list: {
            flex: 1,
            width: '100%',
        },
        logo: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#eee',
        },
        jobInfo: {
            flex: 1,
            padding: 10,
        },
        jobCard: {
            width: '100%',
            flexDirection: 'row',
            backgroundColor: '#fff',
            shadowColor: '#ccc',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.8,
            shadowRadius: 5,
            elevation: 1,
            margin: 4,
            padding: 8,
        },
        jobTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        jobCompany: {
            fontSize: 16,
            marginBottom: 5,
        },
        infoText: {
            fontSize: 20,
            color: '#333',
            textAlign: 'center',
        },
        errorText: {
            color: '#ce2727',
        },
    }
);

export default AssetList;