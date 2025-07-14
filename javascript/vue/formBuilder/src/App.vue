<script setup lang="ts">
import FormBuilder from "./components/FormBuilder.vue";
import Textarea from "primevue/textarea";
import { ref, reactive, computed } from "vue";
import Button from "primevue/button";
import Card from "primevue/card";
import { action } from "@primeuix/themes/aura/image";

const results = ref("");

const formDate = reactive<Record<string, any>>({});

const formConfig = reactive([
  {
    label: "Username",
    name: "username",
    placeholder: "Username",
    type: "text",
    component: "input",
    // visible: true,
    // valueChange: (val: string) => {
    //   console.log("Username changed:", val);
    // },
  },
  {
    label: "Email",
    name: "email",
    placeholder: "Email",
    type: "email",
    component: "input",
  },
  {
    label: "神秘小代码",
    name: "code",
    placeholder: "Code",
    type: "text",
    component: "input",
  },
  {
    label: "Password",
    name: "password",
    placeholder: "Password",
    type: "password",
    component: "input",
  },
  {
    label: "City",
    name: "city",
    placeholder: "Select a city",
    type: "select",
    component: "multiSelect",
    options: [
      { label: "New York", value: "newyork" },
      { label: "Los Angeles", value: "losangeles" },
      { label: "Chicago", value: "chicago" },
      { label: "Houston", value: "houston" },
      { label: "Phoenix", value: "phoenix" },
      { label: "Philadelphia", value: "philadelphia" },
      { label: "San Antonio", value: "sanantonio" },
      { label: "San Diego", value: "sandiego" },
      { label: "Dallas", value: "dallas" },
      { label: "San Jose", value: "sanjose" },
      { label: "Quebec", value: "quebec" },
      { label: "Montreal", value: "montreal" },
      { label: "Toronto", value: "toronto" },
      { label: "Vancouver", value: "vancouver" },
      { label: "Ottawa", value: "ottawa" },
      { label: "Calgary", value: "calgary" },
      { label: "Edmonton", value: "edmonton" },
    ],
  },
  {
    label: "Select",
    name: "select",
    placeholder: "Select an option",
    type: "select",
    component: "select",
    options: [
      { label: "Option 1", value: "option1" },
      { label: "Option 2", value: "option2" },
      { label: "Option 3", value: "option3" },
    ],
  },
]);

const visibleRules = reactive([
  {
    when: [
      { field: "city", op: "includes", is: "quebec" },
      { field: "select", op: "equal", is: "option1" },
    ],
    operator: "and",
    target: "email",
    action: "", // 默认不提供值为隐藏，可提供 "show"
  },
]);

const formConfigString = computed({
  get() {
    return JSON.stringify(formConfig, null, 2);
  },
  set(newValue: string) {
    try {
      const newConfig = JSON.parse(newValue);
      formConfig.length = 0;
      if (Array.isArray(newConfig)) {
        formConfig.push(...newConfig);
      }
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  },
});

const visibleRulesString = computed({
  get() {
    return JSON.stringify(visibleRules, null, 2);
  },
  set(newValue: string) {
    try {
      const newRules = JSON.parse(newValue);
      visibleRules.length = 0;
      if (Array.isArray(newRules)) {
        visibleRules.push(...newRules);
      }
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  },
});

const handleSubmit = (val: object) => {
  results.value = JSON.stringify(val, null, 2);
  console.log("Form submitted with data:", val);
};
</script>

<template>
  <main
    class="flex flex-col gap-4 min-h-screen bg-gray-100 dark:bg-gray-800 p-12"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="font-bold text-3xl">Form Builder</div>
      <small>By Allen Yang</small>
    </div>

    <div class="flex flex-col flex-1">
      <label for="formConfigString">Form Configs</label>
      <Textarea
        id="formConfigString"
        v-model="formConfigString"
        class="flex-1 h-full resize-none !font-mono"
        placeholder="Visible Rules (JSON format)"
        rows="15"
        tabindex="-1"
      ></Textarea>
    </div>

    <div class="flex gap-6">
      <div class="flex flex-col gap-2 w-1/3">
        <label for="visibleRulesString">Rules</label>

        <Textarea
          id="visibleRulesString"
          v-model="visibleRulesString"
          rows="15"
          class="flex-1 resize-none !font-mono"
          tabindex="-1"
          spellcheck="false"
        />
      </div>

      <FormBuilder
        class="w-1/3"
        :formConfig
        :visibleRules
        v-model="formDate"
        @submit="handleSubmit"
      />
      <Card class="w-1/3">
        <template #title>Form Results</template>
        <template #content>
          <pre class="m-0 max-w-2xl">{{ results }}</pre>
        </template>
      </Card>
    </div>
  </main>
</template>
