<template>
  <Card class="relative" style="width: 100%; height: 10hv">
    <template #content>
      <div class="absolute top-3 right-2 cursor-pointer" @click="showCtxItemMenu($event)">
        <i class="pi pi-ellipsis-v"></i>
        <ContextMenu ref="ctxItemMenu" :model="ctxMenuItems" />
      </div>
      <div class="d-flex flex-column align-items-center justify-content-center cursor-pointer">
        <div class="image-wrapper">
          <img :src="getIcon(item)" :alt="getAlt(item)" />
        </div>
        <div class="text-dark text-center">{{ item.name }}</div>
      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">
import { Card, ContextMenu } from 'primevue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue'
import { ItemType, type StorageItem } from '@/types'
import { onMounted, ref, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useDelete } from '@/composables/useDelete'
import { useDownload } from '@/composables/useDownload'
import { StorageApi } from '@/api/storageApi'
const { download } = useDownload()
const router = useRouter()
const props = defineProps({
  item: {
    type: Object as PropType<StorageItem>,
    required: true,
  },
})
const emit = defineEmits(['deleted'])
const toast = useToast()
const confirm = useConfirm()
const ctxItemMenu = ref()
const ctxMenuItems = ref([
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      confirmDeleteItem()
    },
  },
  {
    label: 'Download',
    icon: 'pi pi-download',
    command: async () => {
      try {
        await download(StorageApi.download(props.item.id), true)
      } catch (e) {
        console.error(e)
      }
    },
  },
])
const { _delete: deleteItem } = useDelete()
const showCtxItemMenu = (event: MouseEvent) => {
  ctxItemMenu.value.toggle(event)
}

const confirmDeleteItem = () => {
  confirm.require({
    message: `Delete ${props.item.type == ItemType.Folder ? `folder ${props.item.name}` : `${props.item.name}.${props.item.extension}`} ?`,
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    accept: async () => {
      try {
        await deleteItem(StorageApi.delete(props.item.id), true)
        toast.add({
          severity: 'warn',
          summary: 'Deleted',
          detail: `${props.item.name}${props.item.type == ItemType.File ? `.${props.item.extension}` : ''} has been deleted!`,
          life: 3000,
        })
        emit('deleted', props.item.id)
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Oops!',
          detail: 'Delete fail! Please try again!',
          life: 3000,
        })
      }
    },
  })
}

const iconMap: Record<string, { src: string; alt: string }> = {
  Folder: { src: new URL('@/assets/folder.png', import.meta.url).href, alt: 'Folder' },
  txt: { src: new URL('@/assets/text.png', import.meta.url).href, alt: 'Text File' },
  text: { src: new URL('@/assets/text.png', import.meta.url).href, alt: 'Text File' },
  pdf: { src: new URL('@/assets/pdf.png', import.meta.url).href, alt: 'PDF File' },
  mp4: { src: new URL('@/assets/video.png', import.meta.url).href, alt: 'Video File' },
  docx: { src: new URL('@/assets/pdf.png', import.meta.url).href, alt: 'Docx File' },
  xls: { src: new URL('@/assets/xls.png', import.meta.url).href, alt: 'Xls File' },
  xlsx: { src: new URL('@/assets/xls.png', import.meta.url).href, alt: 'Xls File' },
  png: { src: new URL('@/assets/image.png', import.meta.url).href, alt: 'Image File' },
  jpg: { src: new URL('@/assets/image.png', import.meta.url).href, alt: 'Image File' },
  jpeg: { src: new URL('@/assets/image.png', import.meta.url).href, alt: 'Image File' },
  zip: { src: new URL('@/assets/compressed.png', import.meta.url).href, alt: 'Zip File' },
  rar: { src: new URL('@/assets/compressed.png', import.meta.url).href, alt: 'Rar File' },
  tar: { src: new URL('@/assets/compressed.png', import.meta.url).href, alt: 'Tar File' },
}

const getIcon = (item: StorageItem) => {
  if (item.type === 'Folder') return iconMap.Folder.src
  return iconMap[item.extension?.replace('.', '')]?.src || iconMap['text'].src
}
const getAlt = (item: StorageItem) => {
  if (item.type === 'Folder') return iconMap.Folder.alt
  return iconMap[item.extension?.replace('.', '')]?.alt || ''
}
onMounted(() => {
  if (props.item.type == ItemType.Folder) {
    ctxMenuItems.value.push({
      label: 'Open',
      icon: 'pi pi-folder-open',
      command: () => {
        router.push({ name: 'folder', params: { id: props.item.id } }).then(() => router.go(0))
      },
    })
  }
})
</script>
<style scoped>
.p-card {
  background: transparent !important;
  border: 1px #f3f2f0 solid;
  height: 20vh;
}
.p-card:hover {
  background: #f0f0f0 !important;
}
.image-wrapper {
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
