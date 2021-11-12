<template>
  <div>
    <Tinymce v-model="defaultValue" :height="300" placeholder="Nhập văn bản ở đây" />
  </div>
</template>

<script>
import Tinymce from '../index.vue'

export default {
  components: {
    Tinymce
  },
  props: {

  },
  data() {
    return {
      defaultValue: '<p>Tài liệu cấu hình Xem: HTTP://tinymce.ax-z.cn</p>'
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>
