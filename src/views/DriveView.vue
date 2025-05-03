<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-[80vh]">
    <ProgressSpinner />
  </div>
  <div v-else-if="!error" class="flex flex-col h-[80vh]" id="main" @contextmenu="showCtxMenu">
    <div class="w-full" id="content">
      <div class="w-full flex justify-end">
        <span
          class="mx-5 my-5 cursor-pointer"
          v-tooltip.left="'Add file'"
          type="text"
          placeholder="left"
          @click="ctxMenu_add.show"
          ><i class="pi pi-plus" style="color: green; font-size: 2rem"></i
        ></span>
        <ContextMenu ref="ctxMenu_add" :model="ctxMenuItems_add" />

        <input type="file" ref="uploader" style="display: none" @change="handleFileChange" />
        <!-- <FileUpload ref="uploader" :auto="false" /> -->
      </div>
      <div v-if="items && items.length" class="flex flex-wrap my-5 mx-5">
        <template v-if="items" v-for="(item, _) in items" :key="item.id">
          <div class="w-1/6 md:w-1/4 sm:w-1/2 mt-2 px-2">
            <StorageItemComp
              :item="item"
              @deleted="onDeleted"
              @dblclick="tryOpenIfIsFolder(item)"
            ></StorageItemComp>
          </div>
        </template>
      </div>
      <div v-else class="flex justify-center items-center min-h-[20vh]">
        <Message>Nothing here!</Message>
      </div>
    </div>
    <ContextMenu ref="ctxMenu_main" :model="ctxMenuItems_main" />

    <Dialog
      v-model:visible="showNewFolderForm"
      header="Create new folder"
      :closeable="!insertingFolder"
      :style="{ width: '25rem', position: 'relative' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8">Folder name.</span>
      <div class="flex items-center gap-4 mb-4">
        <InputText
          v-model="newFolderName"
          id="newFolderName"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="showNewFolderForm = false"
        ></Button>
        <Button
          type="button"
          label="Create"
          @click="createNewFolderHandler"
          :disabled="!newFolderName"
        ></Button>
      </div>
      <div
        v-if="insertingFolder"
        class="absolute inset-0 bg-black opacity-20 flex items-center justify-center z-50"
      ></div>
      <div v-if="insertingFolder" class="absolute inset-0 flex items-center justify-center z-60">
        <ProgressSpinner style="width: 2rem; height: 2rem" />
      </div>
    </Dialog>
  </div>
  <div v-else class="flex justify-center items-center min-h-[80vh]">
    <Message severity="error"
      >Oops! Something went wrong!<span>{{ error }}</span></Message
    >
  </div>
  <Dialog :visible="insertingFile" modal :style="{ width: '25rem' }" :closable="false">
    <div class="flex flex-col justify-center">
      <div class="text-center text-surface-500 dark:text-surface-400 block mb-8">
        Uploading {{ insertFileResponse?.name }}
      </div>
      <div class="inset-0 flex items-center justify-center z-60">
        <ProgressSpinner style="width: 2rem; height: 2rem" />
      </div>
    </div>
  </Dialog>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import StorageItemComp from '@/components/item/StorageItemComp.vue'
import { ContextMenu, Dialog, InputText, Button, ProgressSpinner, Message } from 'primevue'
import { ItemType, type StorageItem } from '@/types'
import { useToast } from 'primevue'
import { useGet } from '@/composables/useGet'
import { StorageApi } from '@/api/storageApi'
import { usePost } from '@/composables/usePost'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const showUploadFileDialog = ref(false)
const uploader = ref()
const toast = useToast()
const items = ref<StorageItem[]>()
const newFolderName = ref('')
const showNewFolderForm = ref(false)
const ctxMenu_main = ref()
const ctxMenu_add = ref()
const currentFolder = ref<string | undefined>()
const { get, error, rData, isLoading } = useGet<StorageItem>()

const { post: insertFolder, rData: insertFolderResponse, isLoading: insertingFolder } = usePost()
const {
  post: insertFile,
  rData: insertFileResponse,
  isLoading: insertingFile,
} = usePost<FormData, StorageItem>()
const ctxMenuItems_main = ref([
  {
    label: 'New Folder',
    icon: 'pi pi-plus',
    command: () => {
      newFolderName.value = ''
      showNewFolderForm.value = true
    },
  },
  {
    label: 'Upload',
    icon: 'pi pi-upload',
    command: () => {
      uploader.value.click()
    },
  },
])

const ctxMenuItems_add = ref([
  {
    label: 'New Folder',
    command: () => {
      newFolderName.value = ''
      showNewFolderForm.value = true
    },
  },
  {
    label: 'New File',
    command: () => {
      uploader.value.click()
    },
  },
])
const createNewFolderHandler = async () => {
  try {
    await insertFolder(
      StorageApi.newFolder(),
      { name: newFolderName.value, type: 'Folder', parentId: currentFolder?.value },
      { useJwt: true },
    )
    toast.add({
      severity: 'success',
      summary: 'Created',
      detail: `Created ${newFolderName.value}`,
      life: 3000,
    })
    if (insertFolderResponse.value) items.value?.push(insertFolderResponse.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Oops!',
      // detail: `Created ${newFolderName.value}`,
      life: 3000,
    })
    console.log(error)
  } finally {
    showNewFolderForm.value = false
    newFolderName.value = ''
  }
}
const tryOpenIfIsFolder = (item: StorageItem) => {
  if (item.type == ItemType.Folder) router.push({ name: 'folder', params: { id: item.id } })
}
const onDeleted = (id: string) => {
  items.value = items.value?.filter((i) => i.id != id)
}
const showCtxMenu = (event: MouseEvent) => {
  ctxMenu_main.value.show(event)
}
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target?.files) return
  const files = target.files
  showUploadFileDialog.value = true
  try {
    const formData = new FormData()
    console.log(files[0])
    formData.append('file', files[0])
    formData.append('parent', currentFolder.value ?? '')
    await insertFile(StorageApi.newFile(), formData, { useJwt: true, isFormData: true })
    toast.add({
      severity: 'success',
      summary: 'Insert success',
      detail: `Inserted ${insertFileResponse.value?.name}`,
      life: 3000,
    })
    if (items.value && insertFileResponse.value) items.value.push(insertFileResponse.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Oops! Something went wrong',
      life: 3000,
    })
    console.error(error)
  } finally {
    showUploadFileDialog.value = false
  }
}
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (!event.dataTransfer) return
  const files = event.dataTransfer.files
  showUploadFileDialog.value = true
  try {
    const formData = new FormData()
    console.log(files[0])
    formData.append('file', files[0])
    formData.append('parent', currentFolder.value ?? '')
    await insertFile(StorageApi.newFile(), formData, { useJwt: true, isFormData: true })
    toast.add({
      severity: 'success',
      summary: 'Insert success',
      detail: `Inserted ${insertFileResponse.value?.name}`,
      life: 3000,
    })
    if (items.value && insertFileResponse.value) items.value.push(insertFileResponse.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Oops! Something went wrong',
      life: 3000,
    })
    console.error(error)
  } finally {
    showUploadFileDialog.value = false
  }
}
onMounted(async () => {
  currentFolder.value = (useRoute().params.id as string) ?? undefined
  try {
    await get(StorageApi.item(currentFolder.value), true)
    currentFolder.value = rData.value?.id
    items.value = rData.value?.children
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Oops! Something went wrong!' })
    console.error(error)
  }
  window.addEventListener('drop', handleDrop)
  window.addEventListener('dragover', handleDragOver)
})
onBeforeUnmount(() => {
  window.removeEventListener('drop', handleDrop)
  window.removeEventListener('dragover', handleDragOver)
})
</script>
