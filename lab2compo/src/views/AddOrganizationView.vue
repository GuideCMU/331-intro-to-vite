<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OrganizationService from '@/services/OrganizationService'
import type { Organization } from '@/types'

const router = useRouter()

const org = ref<Organization>({
  id: 0,
  organization_name: '',
  description: '',
  email: '',
  phone: '',
  address: '',
})

const error = ref<string | null>(null)
const submitting = ref(false)

async function submit() {
  error.value = null
  submitting.value = true
  try {
    await OrganizationService.createOrganization(org.value)
    router.push({ name: 'event-list-view' })
  } catch (e: unknown) {
    // normalize error message
    if (e instanceof Error) {
      error.value = e.message
    } else {
      const resp = (e as { response?: { data?: unknown } })?.response?.data
      if (typeof resp === 'string') error.value = resp
      else if (resp !== undefined) error.value = JSON.stringify(resp)
      else error.value = String(e)
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page p-6">
    <h1 class="text-2xl mb-4">Add Organization</h1>
    <form @submit.prevent="submit" class="space-y-4 max-w-lg">
      <div>
        <label class="block">Organization Name</label>
        <input v-model="org.organization_name" required class="border p-2 w-full" />
      </div>

      <div>
        <label class="block">Description</label>
        <textarea v-model="org.description" class="border p-2 w-full"></textarea>
      </div>

      <div>
        <label class="block">Email</label>
        <input v-model="org.email" type="email" required class="border p-2 w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block">Phone</label>
          <input v-model="org.phone" class="border p-2 w-full" />
        </div>
        <div>
          <label class="block">Address</label>
          <input v-model="org.address" class="border p-2 w-full" />
        </div>
      </div>

      <div>
        <button :disabled="submitting" class="px-4 py-2 bg-green-600 text-white rounded">
          {{ submitting ? 'Saving...' : 'Save Organization' }}
        </button>
        <span v-if="error" class="text-red-600 ml-4">{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page {
  background: #f7f9fb;
}
</style>
