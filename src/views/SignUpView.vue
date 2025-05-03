<template>
  <Toast />
  <div class="mt-5 w-full flex justify-center">
    <div class="w-[50vw] lg:!w-[30vw]">
      <h1 class="text-2xl font-semibold text-center mb-4">Register</h1>
      <p class="text-center mb-2 text-gray-700">Register to join us now</p>
      <Form
        v-slot="$form"
        :initialValues="payload"
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="mt-2">
          <InputText
            v-model="payload.name"
            type="text"
            placeholder="Name"
            name="name"
            fluid
            @input="resetValidationErrors('name')"
          />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{
            $form.name.error?.message
          }}</Message>
          <Message
            v-else-if="validationErrors.name"
            severity="error"
            size="small"
            variant="simple"
            >{{ validationErrors.name }}</Message
          >
        </div>
        <div class="mt-2">
          <InputText
            v-model="payload.email"
            name="email"
            type="email"
            placeholder="Email"
            fluid
            @input="resetValidationErrors('email')"
          />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
            $form.email.error?.message
          }}</Message>
          <Message
            v-else-if="validationErrors.email"
            severity="error"
            size="small"
            variant="simple"
            >{{ validationErrors.email }}</Message
          >
        </div>
        <div class="mt-2">
          <InputText
            v-model="payload.password"
            name="password"
            type="password"
            placeholder="Password"
            fluid
            autocomplete="on"
            @input="resetValidationErrors('password')"
          />
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
            $form.password.error?.message
          }}</Message>
          <Message
            v-else-if="validationErrors.password"
            severity="error"
            size="small"
            variant="simple"
            >{{ validationErrors.password }}</Message
          >
        </div>
        <div class="mt-2">
          <InputText
            v-model="payload.passwordConfirm"
            name="passwordConfirm"
            type="password"
            autocomplete="on"
            placeholder="Confirm your password"
            fluid
            @input="resetValidationErrors('passwordConfirm')"
          />
          <Message
            v-if="$form.passwordConfirm?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.passwordConfirm.error?.message }}</Message
          >
          <Message
            v-else-if="validationErrors.passwordConfirm"
            severity="error"
            size="small"
            variant="simple"
            >{{ validationErrors.passwordConfirm }}</Message
          >
        </div>
        <Button type="submit" severity="secondary" label="Submit" />
      </Form>
    </div>
  </div>
</template>
<script setup lang="ts">
import Toast from 'primevue/toast'
import { Form } from '@primevue/forms'
import { InputText } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { Message } from 'primevue'
import { Button } from 'primevue'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { schema } from '@/resolvers/registration'
import { reactive, toRaw } from 'vue'
import type { AuthenticationResponse, FormSubmitEvent, RegistrationPayload } from '@/types'
import { usePost } from '@/composables/usePost'
import { useJwt } from '@/composables/useJwt'
import { AuthApi } from '@/api/authApi'
import { useValidation } from '@/composables/useValidation'
const toast = useToast()
const { validationErrors, setValidationErrors, resetValidationErrors } = useValidation()
const payload = reactive({
  name: 'thluon',
  email: 'thluon@mail.com',
  password: '123123',
  passwordConfirm: '123123',
} as RegistrationPayload)

const { post, rData } = usePost<RegistrationPayload, AuthenticationResponse>()
const { setTokens } = useJwt()
const resolver = zodResolver(schema)

const onFormSubmit = async ({ valid }: FormSubmitEvent) => {
  if (valid) {
    try {
      await post(AuthApi.register(), toRaw(payload))
      if (rData.value) await setTokens(rData.value)
      const username = payload.name
      toast.add({
        severity: 'success',
        detail: `Hello ${username}`,
        summary: 'Register successully!',
      })
    } catch (err: any) {
      if (!!err.formValidationError) {
        setValidationErrors(err.errors)
      } else {
        toast.add({ severity: 'error', summary: 'Oops! Something went wrong!' })
      }
    }
  }
}
</script>
