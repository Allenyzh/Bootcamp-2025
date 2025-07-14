<template>
  <main class="flex flex-col gap-4">
    <div
      v-for="(item, idx) in initialValues"
      :key="item.name || idx"
      class="flex w-full"
    >
      <div v-if="isVisible(item.name)" class="flex flex-col gap-1 w-full">
        <label :for="item.name">{{ item.label }}</label>
        <component
          :is="componentMap[item.component]"
          v-model="formData[item.name]"
          :name="item.name"
          :label="item.label"
          :placeholder="item.placeholder"
          :type="item.type"
          class="w-full"
          :options="item.options ? item.options : null"
          :optionLabel="item.options ? 'label' : null"
          :optionValue="item.options ? 'value' : null"
        ></component>
      </div>
    </div>
    <div class="flex gap-2 w-full">
      <Button label="Submit" class="flex-1" @click="onSubmit" />
      <Button label="Reset" severity="warn" class="flex-1" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import MultiSelect from "primevue/multiselect";
import { object } from "zod/v4";
import { option } from "@primeuix/themes/aura/autocomplete";

const props = defineProps({
  moduleValue: {
    type: Object as () => Record<string, any>,
    default: () => ({}),
  },
  formConfig: {
    type: Array,
    required: true,
  },
  visibleRules: {
    type: Array,
    default: () => [],
  },
});

type ComponentType =
  | "input"
  | "textArea"
  | "select"
  | "selectButton"
  | "multiSelect";

const componentMap: Record<ComponentType, any> = {
  input: InputText,
  textArea: Textarea,
  select: Select,
  selectButton: SelectButton,
  multiSelect: MultiSelect,
};

const emit = defineEmits(["submit"]);

const formData = reactive<Record<string, any>>({ ...props.moduleValue });

type FormItem = {
  name: string;
  label: string;
  placeholder: string;
  type: ComponentType;
  component: ComponentType;
  options?: { label: string; value: string }[];
};

const initialValues = reactive(props.formConfig as FormItem[]);

type VisibleRule = {
  when: {
    field: string;
    op: "equal" | "!equal" | "includes" | "!includes";
    is: any;
  }[];
  operator?: "and" | "or";
  target: string;
  action: "show" | "hide";
};

const visibleMap = computed(() => {
  const map: Record<string, boolean> = {};
  (props.visibleRules as VisibleRule[]).forEach((rule) => {
    const isVisible = checkConditions(formData, rule);
    // 如果 action 是 "hide" 或没写，条件成立就隐藏，否则显示
    if (!rule.action || rule.action === "hide") {
      map[rule.target] = !isVisible; // 匹配时隐藏（false），否则显示（true）
    } else if (rule.action === "show") {
      map[rule.target] = isVisible; // 匹配时显示
    }
  });
  console.log("Visible Map:", map);
  return map;
});

function checkConditions(
  formData: Record<string, any>,
  rule: VisibleRule
): boolean {
  // 解构拿出 when 和 operator，默认 operator 为 "and"
  const { when, operator = "and" } = rule;
  // 没有条件默认成立
  if (!when || !when.length) return true;
  // 对每个条件做判断，返回布尔值数组
  const results = when.map((cond) => {
    const val = formData[cond.field]; // 拿到表单对应字段值
    switch (cond.op) {
      case "equal": // 等于
        return val === cond.is;
      case "!equal": // 不等于
        return val !== cond.is;
      case "includes": // 包含
        return Array.isArray(val)
          ? val.includes(cond.is)
          : String(val).includes(cond.is);
      case "!includes": // 不包含
        return Array.isArray(val)
          ? !val.includes(cond.is)
          : !String(val).includes(cond.is);
      default: // 其他情况默认不成立
        return false;
    }
  });
  // 判断是全部都成立（and），还是只要有一个成立（or）
  return operator === "and" ? results.every(Boolean) : results.some(Boolean);
}

function onSubmit() {
  console.log(formData);
  emit("submit", formData);
}

function isVisible(field: string): boolean {
  console.log("Checking visibility for field:", field);
  // 默认显示，如果 visibleMap 没有定义就是 true
  return visibleMap.value[field] ?? true;
}
</script>
