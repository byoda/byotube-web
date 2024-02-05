<template>
    <Home :section-names="sections" />
</template>
  
<script>
import Home from '../Home.vue';

export default {
    name: "Gaming",
    components: {
        Home
    },
    data: () => ({
        sections: [{
            title: "Gaming",
            key: 'gaming',
            loading: true,
            videos: [],
            after: null,
            has_next_page: null
        }]

    }),
    methods: {},


};
</script>
  
