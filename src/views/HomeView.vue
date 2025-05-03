<template>
  <div class="flex flex-col h-[80vh]" id="main" @contextmenu="showCtxMenu">
    <div class="w-full" id="content">
      <div class="flex flex-wrap my-5 mx-5">
        <template v-if="items" v-for="(item, _) in items" :key="item.id">
          <div class="w-1/6 md:w-1/4 sm:w-1/2 mt-2 px-2">
            <StorageItemComp :item="item" @deleted="onDeleted"></StorageItemComp>
          </div>
        </template>
      </div>
    </div>
    <ContextMenu ref="ctxMenu" :model="menuitems" />
    <Dialog
      v-model:visible="showNewFolderForm"
      header="Create new folder"
      :style="{ width: '25rem' }"
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
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import StorageItemComp from '@/components/item/StorageItemComp.vue'
import { ContextMenu, Dialog, InputText, Button } from 'primevue'
import { ItemType, type StorageItem } from '@/types'
import { useToast } from 'primevue'
const toast = useToast()
const items = ref<StorageItem[]>()
const newFolderName = ref('')
const showNewFolderForm = ref(false)
const ctxMenu = ref()
const menuitems = ref([
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
  },
])
const createNewFolderHandler = () => {
  items.value?.push({
    id: Date.now().toString(),
    name: newFolderName.value,
    type: ItemType.Folder,
    extension: '',
    size: 0,
    parentId: '0',
    children: [],
    owner: 'user123',
  })
  showNewFolderForm.value = false
  toast.add({
    severity: 'success',
    summary: 'Created',
    detail: `Created ${newFolderName.value}`,
    life: 3000,
  })
  newFolderName.value = ''
}
const onDeleted = (id: string) => {
  items.value = items.value?.filter((i) => i.id != id)
}
const showCtxMenu = (event: MouseEvent) => {
  ctxMenu.value.show(event)
}
onMounted(() => {
  const _items: StorageItem[] = [
    {
      id: '1',
      name: 'document',
      type: ItemType.File,
      extension: 'txt',
      size: 1234,
      parentId: '0',
      children: [],
      owner: 'user123',
    },
    {
      id: '2',
      name: 'projects',
      type: ItemType.Folder,
      extension: '',
      size: 0,
      parentId: '0',
      children: [],
      owner: 'user123',
    },
    {
      id: '3',
      name: 'report',
      type: ItemType.File,
      extension: 'pdf',
      size: 4567,
      parentId: '2',
      children: [],
      owner: 'user123',
    },
    {
      id: '4',
      name: 'photos',
      type: ItemType.Folder,
      extension: '',
      size: 0,
      parentId: '0',
      children: [],
      owner: 'user123',
    },
    {
      id: '5',
      name: 'image',
      type: ItemType.File,
      extension: 'png',
      size: 7890,
      parentId: '4',
      children: [],
      owner: 'user123',
    },
    {
      id: '6',
      name: 'document',
      type: ItemType.File,
      extension: 'zip',
      size: 7890,
      parentId: '4',
      children: [],
      owner: 'user123',
    },
  ]
  items.value = _items
})
</script>
