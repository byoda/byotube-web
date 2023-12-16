export type VideoThumbnail = {
    thumbnail_id: string;
    url: string;
    width: number;
    height: number;
    preference: number
}

export type PageInfo = {
    has_next_page: boolean;
    end_cursor: string;
}

export type AssetEdge = {
    cursor: string;
    origin: string;
    node: Asset
}
export type ApiResponseGetAssets = {
    total_count: number;
    page_info: PageInfo;
    edges: [AssetEdge];
}

export type Asset = {
    asset_id: string;
    asset_url: string;
    title: string;
    video_thumbnail: string;
    creator: string;
    creator_thumbnail: string;
    video_thumbnails: [VideoThumbnail];
    publisher_asset_id: string;
    ingest_status: string;
}

