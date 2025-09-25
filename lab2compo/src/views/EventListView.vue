<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import CategoryInfo from '@/components/Categoryinfo.vue'
import { type Event } from '../types'
import { ref, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'

// Props
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
})

const events = ref<Event[] | null>([])
const totalEvents = ref(0)

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)

const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / pageSize.value)
  return page.value < totalPages
})

const pageSizeOption = [2, 3, 4, 6]

// Fetch data reactively
watchEffect(() => {
  EventService.getEvents(pageSize.value, page.value)
    .then((response) => {
      events.value = response.data
      totalEvents.value = parseInt(response.headers['x-total-count']) || 0
    })
    .catch((error) => {
      console.error('There was an error!', error)
    })
})
</script>

<template>
  <div class="flex justify-center gap-4 my-6">
    <router-link
      v-for="size in pageSizeOption"
      :key="size"
      :to="{ name: 'event-list-view', query: { page: 1, pageSize: size } }"
    >
      <button
        class="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
        :class="{ 'bg-green-100 text-green-700 font-semibold': pageSize === size }"
      >
        {{ size }} per page
      </button>
    </router-link>
  </div>

  <h1 class="text-3xl">Events For Good</h1>
  <div class="flex flex-col items-center">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <div class="flex w-[290px] justify-between text-blue-700 font-medium">
      <router-link
        class="text-left hover:underline"
        :to="{ name: 'event-list-view', query: { page: page - 1, pageSize: pageSize } }"
        rel="prev"
        v-if="page != 1"
      >
        &#60; Prev Page
      </router-link>
      <router-link
        class="text-right hover:underline"
        :to="{ name: 'event-list-view', query: { page: page + 1, pageSize: pageSize } }"
        rel="next"
        v-if="hasNextPage"
      >
        Next Page &#62;
      </router-link>
    </div>
  </div>

  <div class="flex flex-col items-end mt-10 gap-4">
    <CategoryInfo v-for="event in events" :key="event.id" :event="event" />
  </div>
</template>
