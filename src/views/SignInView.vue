<template>
  <Toast />
  <div class="mt-5 w-full flex justify-center">
    <div class="w-[50vw] lg:!w-[30vw]">
      <h1 class="text-2xl font-semibold text-center mb-4">Log In</h1>
      <p class="text-center mb-2 text-gray-700">
        Don't have account?
        <RouterLink to="/register" class="underline text-blue-500">Join us </RouterLink>
        now
      </p>
      <Form
        v-slot="$form"
        :initialValues="payload"
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
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
        <div v-if="invalidCredential" class="mt-2">
          <Message severity="error" size="small" variant="simple">Invalid Credentials</Message>
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
import { schema } from '@/resolvers/authentication'
import { reactive, ref, toRaw } from 'vue'
import type { AuthenticationPayload, AuthenticationResponse, FormSubmitEvent } from '@/types'
import { usePost } from '@/composables/usePost'
import { useJwt } from '@/composables/useJwt'
import { AuthApi } from '@/api/authApi'
import { useValidation } from '@/composables/useValidation'
import { useUserStore } from '@/stores/userStore'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const toast = useToast()
const { validationErrors, setValidationErrors, resetValidationErrors } = useValidation()
const payload = reactive({ email: 'thluon@mail.com', password: '123123' })
const { post, rData } = usePost<AuthenticationPayload, AuthenticationResponse>()
const { setTokens } = useJwt()
const user = useUserStore()
const resolver = zodResolver(schema)
const invalidCredential = ref(false)
const onFormSubmit = async ({ valid }: FormSubmitEvent) => {
  if (valid) {
    try {
      await post(AuthApi.authenticate(), toRaw(payload))
      if (rData.value) await setTokens(rData.value)
      const username = user.getUser
      toast.add({
        severity: 'success',
        detail: `Hello ${username}`,
        summary: `Hello ${username}`,
      })
      router.push({ path: '/' })
    } catch (err: any) {
      if (!!err.formValidationError) {
        setValidationErrors(err.errors)
      } else if (err.status == 'UNAUTHORIZED') {
        invalidCredential.value = true
      } else {
        toast.add({ severity: 'error', summary: 'Oops! Something went wrong!' })
      }
    }
  }
}
</script>
