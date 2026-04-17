def build_post_url(post_id: str | None) -> str | None:
    """post_id から投稿URLを組み立てる。"""
    if not post_id:
        return None
    return f"https://x.com/go_missing/status/{post_id}"


def build_image_url(image_id: str | None) -> str | None:
    """image_id から画像URLを組み立てる。"""
    if not image_id:
        return None
    return f"https://pbs.twimg.com/media/{image_id}?format=jpg"


def build_original_url(dex_no: str | None) -> str | None:
    """dex_no から公式ページURLを組み立てる。"""
    if not dex_no:
        return None
    return f"https://zukan.pokemon.co.jp/detail/{dex_no}"