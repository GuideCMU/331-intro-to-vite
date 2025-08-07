<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import CategoryInfo from '@/components/Categoryinfo.vue'
import { type Event } from '@/type'
import { ref, onMounted, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'

const events = ref<Event[] | null>([])
const totalEvents = ref(0)

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  }
})

const pageSizeOption = [2, 3, 4, 6]

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)

const hasNexPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / pageSize.value)
  return page.value < totalPages
})

onMounted(() => {
  watchEffect(() => {
    EventService.getEvents(pageSize.value, page.value)
      .then((response) => {
        events.value = response.data
        totalEvents.value = parseInt(response.headers['x-total-count'])
      })
      .catch((error) => {
        console.error('There was an error!', error)
      })
  })
})
</script>

<template>
  <div class="flex justify-center gap-4 my-6">
    <router-link
      v-for="size in pageSizeOption"
      :key="size"
      :to="{ name: 'home', query: { page: 1, pageSize: size } }"
    >
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        :class="{ 'bg-blue-700': pageSize === size }"
      >
        {{ size }} per page
      </button>
    </router-link>
  </div>

  <h1 class="text-3xl font-bold text-center mb-8">Event For Good</h1>

  <div class="flex flex-col items-center space-y-6">
    <EventCard v-for="event in events" :key="event.id" :event="event" />

    <div class="flex justify-between w-full max-w-md mt-8">
      <router-link
        id="page-prev"
        v-if="page > 1"
        :to="{ name: 'home', query: { page: page - 1, pageSize: pageSize } }"
        class="text-blue-600 hover:underline"
      >
        &#60; Prev Page
      </router-link>

      <div class="flex-grow"></div>

      <router-link
        id="page-next"
        v-if="hasNexPage"
        :to="{ name: 'home', query: { page: page + 1, pageSize: pageSize } }"
        class="text-blue-600 hover:underline text-right"
      >
        Next Page &#62;
      </router-link>
    </div>
  </div>

  <div class="mt-12 flex flex-col items-end space-y-4">
    <CategoryInfo v-for="event in events" :key="event.id" :event="event" />
  </div>
</template>
