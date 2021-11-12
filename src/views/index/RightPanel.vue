<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="Thuộc tính thành phần." name="field" />
      <el-tab-pane label="Thuộc tính mẫu" name="form" />
    </el-tabs>
    <div class="field-box">
      <a class="document-link" target="_blank" :href="documentLink" title="Xem tài liệu thành phần.">
        <i class="el-icon-link" />
      </a>
      <el-scrollbar class="right-scrollbar">
        <!-- Thuộc tính thành phần. -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <el-form-item v-if="activeData.__config__.changeTag" label="Loại thành phần">
            <el-select
              v-model="activeData.__config__.tagIcon"
              placeholder="Vui lòng chọn loại thành phần"
              :style="{width: '100%'}"
              @change="tagChange"
            >
              <el-option-group v-for="group in tagList" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.__config__.label"
                  :label="item.__config__.label"
                  :value="item.__config__.tagIcon"
                >
                  <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />
                  <span> {{ item.__config__.label }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__!==undefined" label="Tên trường.">
            <el-input v-model="activeData.__vModel__" placeholder="Vui lòng nhập tên trường（v-model）" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.componentName!==undefined" label="Tên thành phần">
            {{ activeData.__config__.componentName }}
          </el-form-item>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="chức vụ">
            <el-input v-model="activeData.__config__.label" placeholder="Vui lòng nhập tiêu đề" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="Mẹo giữ chỗ">
            <el-input v-model="activeData.placeholder" placeholder="Vui lòng nhập dấu nhắc giữ chỗ" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData['start-placeholder']!==undefined" label="Bắt đầu vị trí.">
            <el-input v-model="activeData['start-placeholder']" placeholder="Vui lòng nhập dấu nhắc giữ chỗ" />
          </el-form-item>
          <el-form-item v-if="activeData['end-placeholder']!==undefined" label="End giữ chỗ">
            <el-input v-model="activeData['end-placeholder']" placeholder="Vui lòng nhập dấu nhắc giữ chỗ" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.span!==undefined" label="Mẫu lưới">
            <el-slider v-model="activeData.__config__.span" :max="24" :min="1" :marks="{12:''}" @change="spanChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.gutter!==undefined" label="Khoảng thời gian lưới">
            <el-input-number v-model="activeData.gutter" :min="0" placeholder="Khoảng thời gian lưới" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.layout==='rowFormItem'&&activeData.type!==undefined" label="Chế độ bố trí">
            <el-radio-group v-model="activeData.type">
              <el-radio-button label="default" />
              <el-radio-button label="flex" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.justify!==undefined&&activeData.type==='flex'" label="Sắp xếp ngang.">
            <el-select v-model="activeData.justify" placeholder="Vui lòng chọn sắp xếp theo chiều ngang" :style="{width: '100%'}">
              <el-option
                v-for="(item, index) in justifyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.align!==undefined&&activeData.type==='flex'" label="Sắp xếp dọc.">
            <el-radio-group v-model="activeData.align">
              <el-radio-button label="top" />
              <el-radio-button label="middle" />
              <el-radio-button label="bottom" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.labelWidth!==undefined" label="Nhãn chiều rộng">
            <el-input v-model.number="activeData.__config__.labelWidth" type="number" placeholder="Vui lòng nhập chiều rộng nhãn" />
          </el-form-item>
          <el-form-item v-if="activeData.style&&activeData.style.width!==undefined" label="Thành phần Chiều rộng.">
            <el-input v-model="activeData.style.width" placeholder="Vui lòng nhập chiều rộng thành phần" clearable />
          </el-form-item>
          <el-form-item v-if="activeData.__vModel__!==undefined" label="Mặc định">
            <el-input
              :value="setDefaultValue(activeData.__config__.defaultValue)"
              placeholder="Vui lòng nhập giá trị mặc định"
              @input="onDefaultValueInput"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="Ít nhất">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="Ít nhất"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="Lên đến bạn có thể chọn">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="Lên đến bạn có thể chọn"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.prepend!==undefined" label="Tiếp đầu ngữ">
            <el-input v-model="activeData.__slot__.prepend" placeholder="Vui lòng nhập tiền tố" />
          </el-form-item>
          <el-form-item v-if="activeData.__slot__&&activeData.__slot__.append!==undefined" label="后缀">
            <el-input v-model="activeData.__slot__.append" placeholder="Vui lòng nhập một hậu tố" />
          </el-form-item>
          <el-form-item v-if="activeData['prefix-icon']!==undefined" label="Biểu tượng phía trước.">
            <el-input v-model="activeData['prefix-icon']" placeholder="Vui lòng nhập tên biểu tượng phía trước">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('prefix-icon')">
                lựa chọn
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['suffix-icon'] !== undefined" label="Biểu tượng phía sau.">
            <el-input v-model="activeData['suffix-icon']" placeholder="Vui lòng nhập tên biểu tượng">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('suffix-icon')">
                lựa chọn
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="activeData['icon']!==undefined && activeData.__config__.tag === 'el-button'"
            label="Biểu tượng nút."
          >
            <el-input v-model="activeData['icon']" placeholder="Vui lòng nhập tên biểu tượng nút">
              <el-button slot="append" icon="el-icon-thumb" @click="openIconsDialog('icon')">
                lựa chọn
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Tùy chọn phân tách.">
            <el-input v-model="activeData.separator" placeholder="Vui lòng nhập dấu phân cách tùy chọn" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="Dòng khối lượng lớn">
            <el-input-number v-model="activeData.autosize.minRows" :min="1" placeholder="Dòng khối lượng lớn" />
          </el-form-item>
          <el-form-item v-if="activeData.autosize !== undefined" label="Số lượng dòng tối đa">
            <el-input-number v-model="activeData.autosize.maxRows" :min="1" placeholder="Số lượng dòng tối đa" />
          </el-form-item>
          <el-form-item v-if="isShowMin" label="Tối thiểu">
            <el-input-number v-model="activeData.min" placeholder="Tối thiểu" />
          </el-form-item>
          <el-form-item v-if="isShowMax" label="Gia trị lơn nhât">
            <el-input-number v-model="activeData.max" placeholder="Gia trị lơn nhât" />
          </el-form-item>
          <el-form-item v-if="activeData.height!==undefined" label="Chiều cao thành phần">
            <el-input-number v-model="activeData.height" placeholder="cao" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="isShowStep" label="Stepman.">
            <el-input-number v-model="activeData.step" placeholder="Bước đếm" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="sự chính xác">
            <el-input-number v-model="activeData.precision" :min="0" placeholder="sự chính xác" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="Nút vị trí.">
            <el-radio-group v-model="activeData['controls-position']">
              <el-radio-button label="">
                vỡ nợ
              </el-radio-button>
              <el-radio-button label="right">
                Bên phải
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData.maxlength !== undefined" label="Lên đến hầu hết các đầu vào">
            <el-input v-model="activeData.maxlength" placeholder="Vui lòng nhập chiều dài ký tự">
              <template slot="append">
                Tính cách
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData['active-text'] !== undefined" label="Mở nhắc nhở">
            <el-input v-model="activeData['active-text']" placeholder="Vui lòng nhập một dấu nhắc" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-text'] !== undefined" label="Đóng nhắc">
            <el-input v-model="activeData['inactive-text']" placeholder="Vui lòng nhập một dấu nhắc đã đóng" />
          </el-form-item>
          <el-form-item v-if="activeData['active-value'] !== undefined" label="Giá trị mở">
            <el-input
              :value="setDefaultValue(activeData['active-value'])"
              placeholder="Vui lòng nhập giá trị mở"
              @input="onSwitchValueInput($event, 'active-value')"
            />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-value'] !== undefined" label="Tắt">
            <el-input
              :value="setDefaultValue(activeData['inactive-value'])"
              placeholder="Vui lòng nhập giá trị đóng"
              @input="onSwitchValueInput($event, 'inactive-value')"
            />
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && 'el-date-picker' === activeData.__config__.tag"
            label="Loại thời gian"
          >
            <el-select
              v-model="activeData.type"
              placeholder="Vui lòng chọn loại thời gian"
              :style="{ width: '100%' }"
              @change="dateTypeChange"
            >
              <el-option
                v-for="(item, index) in dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.name !== undefined" label="Tên trường tệp.">
            <el-input v-model="activeData.name" placeholder="Vui lòng nhập tên trường Tải lên tệp" />
          </el-form-item>
          <el-form-item v-if="activeData.accept !== undefined" label="loại tệp">
            <el-select
              v-model="activeData.accept"
              placeholder="Vui lòng chọn loại tệp"
              :style="{ width: '100%' }"
              clearable
            >
              <el-option label="bức ảnh" value="image/*" />
              <el-option label="băng hình" value="video/*" />
              <el-option label="Âm thanh." value="audio/*" />
              <el-option label="excel" value=".xls,.xlsx" />
              <el-option label="word" value=".doc,.docx" />
              <el-option label="pdf" value=".pdf" />
              <el-option label="txt" value=".txt" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="activeData.__config__.fileSize !== undefined" label="Kích thước tập tin">
            <el-input v-model.number="activeData.__config__.fileSize" placeholder="Vui lòng nhập kích thước tệp">
              <el-select slot="append" v-model="activeData.__config__.sizeUnit" :style="{ width: '66px' }">
                <el-option label="KB" value="KB" />
                <el-option label="MB" value="MB" />
                <el-option label="GB" value="GB" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item v-if="activeData.action !== undefined" label="Tải lên địa chỉ">
            <el-input v-model="activeData.action" placeholder="Vui lòng nhập địa chỉ tải lên" clearable />
          </el-form-item>
          <el-form-item v-if="activeData['list-type'] !== undefined" label="Danh sách loại">
            <el-radio-group v-model="activeData['list-type']" size="small">
              <el-radio-button label="text">
                text
              </el-radio-button>
              <el-radio-button label="picture">
                picture
              </el-radio-button>
              <el-radio-button label="picture-card">
                picture-card
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="activeData.type !== undefined && activeData.__config__.tag === 'el-button'"
            label="Nút loại."
          >
            <el-select v-model="activeData.type" :style="{ width: '100%' }">
              <el-option label="primary" value="primary" />
              <el-option label="success" value="success" />
              <el-option label="warning" value="warning" />
              <el-option label="danger" value="danger" />
              <el-option label="info" value="info" />
              <el-option label="text" value="text" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.buttonText !== undefined"
            v-show="'picture-card' !== activeData['list-type']"
            label="Nút văn bản"
          >
            <el-input v-model="activeData.__config__.buttonText" placeholder="Vui lòng nhập văn bản nút" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.tag === 'el-button'"
            label="Nút văn bản"
          >
            <el-input v-model="activeData.__slot__.default" placeholder="Vui lòng nhập văn bản nút" />
          </el-form-item>
          <el-form-item v-if="activeData['range-separator'] !== undefined" label="Phân tách">
            <el-input v-model="activeData['range-separator']" placeholder="Vui lòng nhập một dấu phân cách" />
          </el-form-item>
          <el-form-item v-if="activeData['picker-options'] !== undefined" label="khoảng thời gian">
            <el-input
              v-model="activeData['picker-options'].selectableRange"
              placeholder="Vui lòng nhập khoảng thời gian"
            />
          </el-form-item>
          <el-form-item v-if="activeData.format !== undefined" label="Định dạng thời gian">
            <el-input
              :value="activeData.format"
              placeholder="Vui lòng nhập định dạng thời gian"
              @input="setTimeValue($event)"
            />
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.__config__.tag) > -1">
            <el-divider>Lựa chọn</el-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="item.label" placeholder="Tên tùy chọn." size="small" />
                <el-input
                  placeholder="Giá trị tùy chọn"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div style="margin-left: 20px;">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addSelectItem"
              >
                Thêm tùy chọn
              </el-button>
            </div>
            <el-divider />
          </template>

          <template v-if="['el-cascader', 'el-table'].includes(activeData.__config__.tag)">
            <el-divider>Lựa chọn</el-divider>
            <el-form-item v-if="activeData.__config__.dataType" label="Loại dữ liệu">
              <el-radio-group v-model="activeData.__config__.dataType" size="small">
                <el-radio-button label="dynamic">
                  Dữ liệu động
                </el-radio-button>
                <el-radio-button label="static">
                  Dữ liệu tĩnh
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <template v-if="activeData.__config__.dataType === 'dynamic'">
              <el-form-item label="Địa chỉ giao diện">
                <el-input
                  v-model="activeData.__config__.url"
                  :title="activeData.__config__.url"
                  placeholder="Vui lòng nhập địa chỉ giao diện"
                  clearable
                  @blur="$emit('fetch-data', activeData)"
                >
                  <el-select
                    slot="prepend"
                    v-model="activeData.__config__.method"
                    :style="{width: '85px'}"
                    @change="$emit('fetch-data', activeData)"
                  >
                    <el-option label="get" value="get" />
                    <el-option label="post" value="post" />
                    <el-option label="put" value="put" />
                    <el-option label="delete" value="delete" />
                  </el-select>
                </el-input>
              </el-form-item>
              <el-form-item label="Địa điểm dữ liệu">
                <el-input
                  v-model="activeData.__config__.dataPath"
                  placeholder="Vui lòng nhập vị trí dữ liệu"
                  @blur="$emit('fetch-data', activeData)"
                />
              </el-form-item>

              <template v-if="activeData.props && activeData.props.props">
                <el-form-item label="Tên khóa tên.">
                  <el-input v-model="activeData.props.props.label" placeholder="Vui lòng nhập tên khóa nhãn" />
                </el-form-item>
                <el-form-item label="Tên khóa giá trị.">
                  <el-input v-model="activeData.props.props.value" placeholder="Vui lòng nhập tên nút giá trị" />
                </el-form-item>
                <el-form-item label="TÊN KENG TRẺ">
                  <el-input v-model="activeData.props.props.children" placeholder="Vui lòng nhập tên con" />
                </el-form-item>
              </template>
            </template>

            <!-- Cascade Lựa chọn Cây tĩnh -->
            <el-tree
              v-if="activeData.__config__.dataType === 'static'"
              draggable
              :data="activeData.options"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
            />
            <div v-if="activeData.__config__.dataType === 'static'" style="margin-left: 20px">
              <el-button
                style="padding-bottom: 0"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="addTreeItem"
              >
                Thêm cha mẹ
              </el-button>
            </div>
            <el-divider />
          </template>

          <el-form-item v-if="activeData.__config__.optionType !== undefined" label="Tùy chọn Kiểu">
            <el-radio-group v-model="activeData.__config__.optionType">
              <el-radio-button label="default">
                vỡ nợ
              </el-radio-button>
              <el-radio-button label="button">
                Cái nút
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['active-color'] !== undefined" label="Bật màu">
            <el-color-picker v-model="activeData['active-color']" />
          </el-form-item>
          <el-form-item v-if="activeData['inactive-color'] !== undefined" label="Đóng màu">
            <el-color-picker v-model="activeData['inactive-color']" />
          </el-form-item>

          <el-form-item v-if="activeData.__config__.showLabel !== undefined
            && activeData.__config__.labelWidth !== undefined" label="Hiển thị nhãn"
          >
            <el-switch v-model="activeData.__config__.showLabel" />
          </el-form-item>
          <el-form-item v-if="activeData.branding !== undefined" label="Thương hiệu thương hiệu.">
            <el-switch v-model="activeData.branding" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData['allow-half'] !== undefined" label="Cho phép một nửa">
            <el-switch v-model="activeData['allow-half']" />
          </el-form-item>
          <el-form-item v-if="activeData['show-text'] !== undefined" label="Viết phụ">
            <el-switch v-model="activeData['show-text']" @change="rateTextChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-score'] !== undefined" label="Điểm hiển thị">
            <el-switch v-model="activeData['show-score']" @change="rateScoreChange" />
          </el-form-item>
          <el-form-item v-if="activeData['show-stops'] !== undefined" label="Hiển thị điểm dừng">
            <el-switch v-model="activeData['show-stops']" />
          </el-form-item>
          <el-form-item v-if="activeData.range !== undefined" label="Tùy chọn phạm vi">
            <el-switch v-model="activeData.range" @change="rangeChange" />
          </el-form-item>
          <el-form-item
            v-if="activeData.__config__.border !== undefined && activeData.__config__.optionType === 'default'"
            label="Cho dù với một biên giới"
          >
            <el-switch v-model="activeData.__config__.border" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-color-picker'" label="Định dạng màu sắc">
            <el-select
              v-model="activeData['color-format']"
              placeholder="Vui lòng chọn định dạng màu"
              :style="{ width: '100%' }"
              clearable
              @change="colorFormatChange"
            >
              <el-option
                v-for="(item, index) in colorFormatOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="activeData.size !== undefined &&
              (activeData.__config__.optionType === 'button' ||
                activeData.__config__.border ||
                activeData.__config__.tag === 'el-color-picker' ||
                activeData.__config__.tag === 'el-button')"
            label="组件尺寸"
          >
            <el-radio-group v-model="activeData.size">
              <el-radio-button label="medium">
                Trung bình
              </el-radio-button>
              <el-radio-button label="small">
                Nhỏ hơn.
              </el-radio-button>
              <el-radio-button label="mini">
                Mini.
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="activeData['show-word-limit'] !== undefined" label="Nhập số liệu thống kê">
            <el-switch v-model="activeData['show-word-limit']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-input-number'" label="Bước nghiêm khắc">
            <el-switch v-model="activeData['step-strictly']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Cấp tùy chọn">
            <el-switch v-model="activeData.props.props.checkStrictly" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Cho dù đó là nhiều hơn">
            <el-switch v-model="activeData.props.props.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Hiển thị đường dẫn đầy đủ">
            <el-switch v-model="activeData['show-all-levels']" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-cascader'" label="Bạn có thể lọc?">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.clearable !== undefined" label="Bạn có thể trống rỗng?">
            <el-switch v-model="activeData.clearable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.showTip !== undefined" label="Hiển thị nhắc">
            <el-switch v-model="activeData.__config__.showTip" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-upload'" label="Tệp nhiều lựa chọn">
            <el-switch v-model="activeData.multiple" />
          </el-form-item>
          <el-form-item v-if="activeData['auto-upload'] !== undefined" label="Tải lên tự động">
            <el-switch v-model="activeData['auto-upload']" />
          </el-form-item>
          <el-form-item v-if="activeData.readonly !== undefined" label="Cho dù bạn đã đọc">
            <el-switch v-model="activeData.readonly" />
          </el-form-item>
          <el-form-item v-if="activeData.disabled !== undefined" label="Nó có bị vô hiệu hóa không?">
            <el-switch v-model="activeData.disabled" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="Bạn có thể tìm kiếm?">
            <el-switch v-model="activeData.filterable" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag === 'el-select'" label="Cho dù đó là nhiều hơn">
            <el-switch v-model="activeData.multiple" @change="multipleChange" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="Nó sẽ được lấp đầy?">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>

          <template v-if="activeData.__config__.layoutTree">
            <el-divider>Bố cục cây.</el-divider>
            <el-tree
              :data="[activeData.__config__]"
              :props="layoutTreeProps"
              node-key="renderKey"
              default-expand-all
              draggable
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <svg-icon class="node-icon" :icon-class="data.__config__?data.__config__.tagIcon:data.tagIcon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </template>

          <template v-if="Array.isArray(activeData.__config__.regList)">
            <el-divider>Xác minh thường xuyên</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="biểu hiện">
                <el-input v-model="item.pattern" placeholder="Vui lòng nhập thường xuyên" />
              </el-form-item>
              <el-form-item label="Thông báo lỗi" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="Vui lòng nhập thông báo lỗi" />
              </el-form-item>
            </div>
            <div style="margin-left: 20px">
              <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
                Thêm quy tắc
              </el-button>
            </div>
          </template>
        </el-form>
        <!-- Thuộc tính mẫu -->
        <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
          <el-form-item label="Tên mẫu">
            <el-input v-model="formConf.formRef" placeholder="Vui lòng nhập tên biểu mẫu (Tham khảo)" />
          </el-form-item>
          <el-form-item label="Mẫu mô hình">
            <el-input v-model="formConf.formModel" placeholder="Vui lòng nhập mô hình dữ liệu" />
          </el-form-item>
          <el-form-item label="Mô hình hiệu chuẩn.">
            <el-input v-model="formConf.formRules" placeholder="Vui lòng nhập mô hình xác minh" />
          </el-form-item>
          <el-form-item label="Hình thức kích thước.">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                Trung bình
              </el-radio-button>
              <el-radio-button label="small">
                Nhỏ hơn.
              </el-radio-button>
              <el-radio-button label="mini">
                Mini.
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Căn chỉnh nhãn.">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                Căn cứ trái
              </el-radio-button>
              <el-radio-button label="right">
                Đúng liên kết
              </el-radio-button>
              <el-radio-button label="top">
                Căn chỉnh trên cùng
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Nhãn chiều rộng">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="Vui lòng nhập chiều rộng nhãn" />
          </el-form-item>
          <el-form-item label="Khoảng thời gian lưới">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="Khoảng thời gian lưới" />
          </el-form-item>
          <el-form-item label="Vô hiệu hóa mẫu">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="Nút biểu mẫu">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="Hiển thị biên giới linh kiện không được chọn">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="Thêm tùy chọn" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util'
import TreeNodeDialog from '@/views/index/TreeNodeDialog'
import { isNumberStr } from '@/utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents, selectComponents, layoutComponents
} from '@/components/generator/config'
import { saveFormConf } from '@/utils/db'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

// Làm cho Changerender có sẵn khi thành phần mục tiêu thay đổi
const needRerenderList = ['tinymce']

export default {
  components: {
    TreeNodeDialog,
    IconsDialog
  },
  props: ['showField', 'activeData', 'formConf'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      dateTypeOptions: [
        {
          label: 'ngày(date)',
          value: 'date'
        },
        {
          label: 'tuần(week)',
          value: 'week'
        },
        {
          label: 'tháng(month)',
          value: 'month'
        },
        {
          label: 'năm(year)',
          value: 'year'
        },
        {
          label: 'Ngày giờ(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: 'Hàng ngày(daterange)',
          value: 'daterange'
        },
        {
          label: 'Hàng tháng(monthrange)',
          value: 'monthrange'
        },
        {
          label: 'Ngày thời gian(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    documentLink() {
      return (
        this.activeData.__config__.document
        || 'https://element.eleme.cn/#/zh-CN/component/installation'
      )
    },
    dateOptions() {
      if (
        this.activeData.type !== undefined
        && this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: 'Thành phần đầu vào',
          options: inputComponents
        },
        {
          label: 'Chọn Loại thành phần.',
          options: selectComponents
        }
      ]
    },
    activeTag() {
      return this.activeData.__config__.tag
    },
    isShowMin() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    },
    isShowMax() {
      return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1
    },
    isShowStep() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    }
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val)
      },
      deep: true
    }
  },
  methods: {
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: '',
        message: ''
      })
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i on-click={() => this.append(data)}
              class="el-icon-plus"
              title="Thêm vào"
            ></i>
            <i on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="xóa bỏ"
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = [] // Tránh xóa
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // Mảng
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // Boolean.
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // Chuỗi và số
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData.__config__, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      this.activeData.__config__.defaultValue = null
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      this.activeData.__config__.renderKey = +new Date() // Cập nhật kết xuất,Kết xuất thành phần này
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        this.activeData.__config__.renderKey = +new Date()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
