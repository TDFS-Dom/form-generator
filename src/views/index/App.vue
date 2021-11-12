<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    // Hủy Bắt đầu Đang tải hình ảnh động
    const preLoader = document.querySelector('#pre-loader')
    preLoader.style.display = 'none'

    // fix: Firefox kéo và thả thẻ mới một tab
    // https://github.com/JakHuang/form-generator/issues/15
    document.body.ondrop = event => {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>
