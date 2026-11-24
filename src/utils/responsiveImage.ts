const UNSPLASH_WIDTH_PARAM = /([?&]w=)\d+/

export const buildResponsiveImageSrcSet = (
  source: string,
  widths: readonly number[] = [480, 720, 960, 1280],
) => {
  if (!source.includes('images.unsplash.com') || !UNSPLASH_WIDTH_PARAM.test(source)) {
    return undefined
  }

  return widths
    .map((width) => `${source.replace(UNSPLASH_WIDTH_PARAM, `$1${width}`)} ${width}w`)
    .join(', ')
}
