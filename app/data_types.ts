type VideoThumbnail = {
    thumbnail_id: string;
    url: string;
    width: number;
    height: number;
    preference: number
}

type PageInfo = {
    has_next_page: boolean;
    end_cursor: string;
}

type AssetEdge = {
    cursor: string;
    origin: string;
    node: Asset
}
type ApiResponseGetAssets = {
    total_count: number;
    page_info: PageInfo;
    edges: [AssetEdge];
}

type Asset = {
    asset_id: string;
    asset_url: string;
    title: string;
    video_thumbnail: string;
    creator: string;
    video_thumbnails: [VideoThumbnail];
    publisher_asset_id: string;
    ingest_status: string;
}

