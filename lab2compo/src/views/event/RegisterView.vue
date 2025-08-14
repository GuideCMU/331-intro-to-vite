a
<script setup lang="ts">
import { defineProps } from 'vue'
import { type Event } from '@/types'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const props = defineProps<{
  event: Event
}>()

const router = useRouter()
const store = useMessageStore()

const register = () => {
  if (!props.event) return

  store.updateMessage(`You are successfully registered for ${props.event.title}`)

  setTimeout(() => {
    store.resetMessage()
  }, 3000)

  router.push({
    name: 'event-detail-view',
    params: { id: props.event.id },
  })
}
</script>

<template>
  <div>
    <p>Register event here</p>
    <button @click="register" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Register
    </button>
  </div>
</template>
