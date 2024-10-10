<script  lang=ts setup>
const imageField = {
    dimensions: {
        width: 2400,
        height: 1260,
    },
    alt: null,
    copyright: null,
    url: 'https://images.prismic.io/timothe-joubert/c3f62067-0885-414d-9969-a2ae236840c3_hero-serigraphie_4.jpg?auto=format,compress&rect=0,425,6000,3150&w=2400&h=1260',
    id: 'ZUPZUxIAACEACl5r',
    edit: {
        x: 0,
        y: 425,
        zoom: 1,
        background: 'transparent',
    },
}
</script>

<template>
    <div :class="$style.root">
        <div>
            <div>Img</div>
            <VPrismicImage :document="imageField" />
            <VPrismicImage
                :document="imageField"
                fit="crop"
                width="100"
                height="200"
            />
            <VPrismicImage
                :document="imageField"
                width="300"
                fit="crop"
                ar="5:2"
                crop="top,left"
            />
            <VPrismicImage :document="imageField">
                <VPictureSource
                    media="(max-width: 767px)"
                    :modifiers="{ fit: 'crop', ar: '2:4' }"
                />
                <VPictureSource :modifiers="{ fit: 'crop', ar: '7:2', crop: 'bottom,right' }" />
            </VPrismicImage>
        </div>
    </div>
</template>

<style lang=scss module>
.root {
    margin: rem(200);
}
</style>
