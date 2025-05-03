<template>
  <Toast />
  <div class="mt-5 w-full flex justify-center">
    <div class="w-[50vw] lg:!w-[30vw]">
      <h1 class="text-2xl font-semibold text-center mb-4">Register</h1>
      <p class="text-center mb-2 text-gray-700">Register to join us now</p>
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <InputText
          v-model="initialValues.email"
          type="text"
          placeholder="Name"
          name="email"
          fluid
        />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message
        }}</Message>
        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import Toast from 'primevue/toast'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { FormField } from '@primevue/forms'
import { InputText } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { Message } from 'primevue'
import { Button } from 'primevue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { schema } from '@/resolvers/registration'
import { reactive, ref } from 'vue'
const toast = useToast()
const initialValues = reactive({
  email: 'email@exammple.com',
})

const resolver = zodResolver(schema)

const onFormSubmit = async (formSubmitEvent: FormSubmitEvent) => {
  if (formSubmitEvent.valid) {
    console.log(initialValues)
  }
}
</script>
