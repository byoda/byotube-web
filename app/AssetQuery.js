import {gql} from '@apollo/client';

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

export default ASSET_QUERY