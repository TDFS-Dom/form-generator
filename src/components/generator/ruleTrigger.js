/**
 * Được sử dụng để tạo một kiểm tra biểu mẫu, chỉ định phương thức kích hoạt của quy tắc thông thường.
 * Các thành phần chưa được khai báo mà không kích hoạt sẽ không tạo ra quy tắc!Những
 */
export default {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change',
  tinymce: 'blur'
}
