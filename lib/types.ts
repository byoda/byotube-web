import { list } from "postcss";

type Asset = {
    asset_id: string;
    asset_url: string;
    title: string;
    thumbnail_url: string;
    creator: string;
    public_video_thumbnails: string[];
}