<template>
       <div class="d-flex align-items-center mt-4 pb-5">
            <div>
                <img class="rounded-circle"
                    :src="user?.avatar_url"
                    height="40" width="40" alt="" srcset="">
            </div>
            <div class="w-100 pl-4 mt-n2">
                <div>
                    <BaseTextfield v-model="inputModelValue" variant="underlined" density="compact" hide-details
                        class="pt-0 comment-placeholder" placeholder="Add comment" persistent-placeholder
                        @focus="showActions = true" />
                </div>
                <div class="mt-3 text-end" v-if="showActions">
                    <BaseBtn color="black" variant="text" class="rounded-pill text-none px-3 mr-2"
                        @click="showActions = false">
                        Cancel
                    </BaseBtn>
                    <BaseBtn :color="inputModelValue ? 'blue-lighten-1' : 'transparent'"
                        class="rounded-pill text-black text-none px-3 elevation-0" :loading="commentLoader" :disabled="!inputModelValue"
                        @click="emit('add-comment')">
                        {{ buttonText }}
                    </BaseBtn>
                </div>
            </div>
        </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { BaseTextfield, BaseBtn } from "@/components/base";

const props = defineProps({
    modelValue:{
        type: String,
        default: null
    },
    commentLoader:{
        type: Boolean,
        default: null
    },
    buttonText:{
        type: String,
        default: 'Comment'
    },
})

const emit = defineEmits(['update:modelValue', 'add-comment'])

const showActions = ref(false);

const user = JSON.parse(localStorage.getItem('user'))

const inputModelValue = computed({
    get(){
        return props.modelValue
    }, 
    set(val){
        emit('update:modelValue', val)
    }
})
</script>