<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="status">
        <el-select filterable v-model="queryParams.devicesType" placeholder="设备类型" clearable size="small" @change="handleDeviceQuery">
          <el-option
            v-for="item in deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌类型" prop="status">
        <el-select filterable v-model="queryParams.brandsType" placeholder="品牌类型" clearable size="small" @change="handleQuery">
          <el-option
            v-for="item in queryBrandList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-has-permi="['devices:versions:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-has-permi="['devices:versions:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-has-permi="['devices:versions:delete']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="$store.state.app.loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="设备类型" align="center" :formatter="deviceFormatter" prop="devicesType" />
      <el-table-column label="品牌类型" align="center" :formatter="brandFormatter" prop="brandsType" />
      <el-table-column label="can波特率" align="center" :formatter="canBaudRateFormatter" prop="canBaudRate"/>
      <el-table-column label="lin波特率" align="center" :formatter="linBaudRateFormatter" prop="linBaudRate" />
      <el-table-column label="排序值" align="center" prop="orderNum" />
      <el-table-column label="展示PWM" align="center" prop="showPWM" :formatter="showPWMFormatter"/>
      <el-table-column label="can报文" align="center" prop="canMessage">
        <template slot-scope="scope">
          <span v-if="scope.row.canMessage && scope.row.canMessage.length > 10">
            <el-popover
                placement="top-start"
                title=""
                trigger="hover"
                popper-class="el-tooltip__popper is-dark"
            >
                <div>{{ scope.row.canMessage.substring(0,500) + (scope.row.canMessage.length>500?'...':'') }}</div>
                <span slot="reference">
                  {{ scope.row.canMessage.substring(0,10) + '...' }}
                </span>
            </el-popover>
          </span>
          <span v-else>{{ scope.row.canMessage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="lin报文" align="center" prop="linMessage">
        <template slot-scope="scope">
          <span v-if="scope.row.linMessage && scope.row.linMessage.length > 10">
            <el-popover
                placement="top-start"
                title=""
                trigger="hover"
                popper-class="el-tooltip__popper is-dark"
            >
                <div>{{ scope.row.linMessage.substring(0,500) + (scope.row.linMessage.length>500?'...':'') }}</div>
                <span slot="reference">
                  {{ scope.row.linMessage.substring(0,10) + '...' }}
                </span>
            </el-popover>
          </span>
          <span v-else>{{ scope.row.linMessage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接线说明" :show-overflow-tooltip="true" align="center" prop="connectTitle" />
      <el-table-column label="创建时间" :formatter="dateFormatter" align="center" prop="createdAt" width="180"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-has-permi="['devices:versions:update']"
          >修改</el-button>
          <el-button
            class="delete"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-has-permi="['devices:versions:delete']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open"  append-to-body :close-on-click-modal="false">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入款式名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="devicesType">
          <el-select filterable clearable v-model="form.devicesType" placeholder="设备类型" @change="handleModifyDevice">
            <el-option
              v-for="item in deviceList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌类型" prop="brandsType">
          <el-select filterable clearable v-model="form.brandsType" placeholder="品牌类型">
            <el-option
              v-for="item in modifyBrandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="can波特率" prop="canBaudRate">
          <el-select clearable filterable v-model="form.canBaudRate" placeholder="can波特率">
            <el-option
              v-for="item in canBaudRateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="lin波特率" prop="linBaudRate">
          <el-select clearable v-model="form.linBaudRate" filterable  allow-create placeholder="lin波特率">
            <el-option
              v-for="item in linBaudRateList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序值" prop="orderNum">
          <el-input v-model="form.orderNum"  placeholder="请输入排序值" />
        </el-form-item>
        <br>
        <el-form-item label="展示PWM" prop="showPWM">
          <el-switch v-model="form.showPWM" active-value="1" inactive-value="0"  active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="解析报文" >
          <el-upload
            class="upload-demo"
            ref="messageUpload"
            action="#"
            :limit="1"
            :on-change="beforeUploadMessageChange"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件解析</el-button>
            <div slot="tip" class="el-upload__tip">只能解析asc文件</div>
          </el-upload>
        </el-form-item>
        <br>
        <el-form-item label="can报文" prop="canMessage" >
            <el-input type="textarea"  v-model="form.canMessage" placeholder="can报文内容"></el-input>
        </el-form-item>
        <el-form-item label="lin报文" prop="linMessage" >
          <el-input type="textarea"  v-model="form.linMessage" placeholder="lin报文内容"></el-input>
        </el-form-item>
        <el-form-item label="接线说明" prop="connectTitle">
          <el-input type="textarea"  v-model="form.connectTitle" placeholder="请输入接线说明"></el-input>
        </el-form-item>
        <el-form-item label="接线图" prop="connectImgPath">
          <el-upload
            drag
            action="#" :http-request="function(){}"
            :limit="1"
            :on-change="handleConnectImgUploadChange"
            :show-file-list="false"
            :on-exceed="handleConnectImgUploadOver"
            >
            <img v-if="form.connectImgPath" :src="form.connectImgPath" class="avatar">
            <template v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
                <p style="color:#999">(只能上传jpg/png文件，且不超过2M)</p>
              </div>
            </template>
          </el-upload>
          <el-input style="display: none;" v-model="form.connectImgPath"  placeholder="接线图路径" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVersion, getVersionById, addVersion, updateVersion, delVersion } from '@/api/admin/device/version'
import { getDevice } from '@/api/admin/device/device'
import { getBrand } from '@/api/admin/device/brand'
import { uploadImg } from '@/api/admin/base'


export default {
  data () {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictType: '',
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],

      deviceList: [],
      brandList: [],
      queryBrandList: [],
      modifyBrandList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        devicesType: [
          { required: true, message: '设备类型不能为空', trigger: 'blur' }
        ],
        brandsType: [
          { required: true, message: '品牌类型不能为空', trigger: 'blur' }
        ],
        linBaudRate: [
          { pattern: /^([1-9]\d{0,3}|0)$|^([1-5]\d{4})$|^6([0-4]\d{3}|5([0-4]\d{2}|5([0-2]\d|3[0-5])))$/, message: '请输入小于65535的数字', trigger: 'blur' },
        ]
      },
      canBaudRateList:[{
        id: 1000,
        name: '1000'
      }, {
        id: 800,
        name: '800'
      }, {
        id: 666,
        name: '666'
      }, {
        id: 500,
        name: '500'
      }, {
        id: 400,
        name: '400'
      }, {
        id: 250,
        name: '250'
      }, {
        id: 200,
        name: '200'
      }, {
        id: 125,
        name: '125'
      }, {
        id: 100,
        name: '100'
      }],
      linBaudRateList: [{
        id: 2400,
        name: '2400'
      }, {
        id: 9600,
        name: '9600'
      }, {
        id: 10400,
        name: '10400'
      }, {
        id: 19200,
        name: '19200'
      }]
    }
  },
  mounted () {
    this.getList()
    this.getAllDevice()
    this.getAllBrand()
  },
  methods: {
    handleConnectImgUploadOver (files, fileList) {
      this.handleConnectImgUploadChange({ raw: files[0] })
    },
    handleConnectImgUploadChange (file, fileList) {
      if (!this.beforeConnectImgUpload(file.raw)) return
      const formData = new FormData()
      formData.append('file', file.raw)
      uploadImg(formData).then(res => {
        if (res.code === 0) {
          this.form = Object.assign({}, this.form, { connectImgPath: this.baseImgUrl + res.data.path })
        } else {
          return new Promise(res.message)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err.message);
      })
    },
    beforeUploadMessageChange (file) {
      file = file.raw
      this.$refs.messageUpload.clearFiles()
      const size = file.size / 1024 / 1024
      if (size > 20) {
        this.$message.error('文件太大，不能超过20M!')
        return
      } else if (!['.asc'].some(a => {
        if (file.name.includes(a)) {
          return true
        }
      })) {
        this.$message.error('只支持asc格式的文件!')
        return
      }
      var reader = new FileReader()
      reader.readAsText(file)
      reader.addEventListener('load', () => {
        const lineArr = reader.result.replace(/\r\n/g, '\n').split('\n').filter(a => {
          return /^\d+\./.test(a)
        })
        const message = lineArr.map(line => {
          const arr = line.split(' ')
          let id = arr[2]
          let data = '0' // 计算第一位默认长度
          if (id.endsWith('x')) {
            data = '8'
            id = id.replace(/x$/, '')
          }
          const lenStr = arr[5]
          data += lenStr + id.padStart(8, '0') // data += 第二位数据长度 + id
          for (let i = 6; i < +lenStr + 6; i++) {
            data += arr[i]
          }
          return data.padEnd(26, 0)
        }).join('\n')
        this.$message.success('解析成功，已为您自动填充can报文内容!')
        this.form = Object.assign({}, this.form, { canMessage: message })
      })
    },
    beforeConnectImgUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const sizeLimit = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG或者PNG 格式!')
      }
      if (!sizeLimit) {
        this.$message.error('上传图片大小不能超过 2M!')
      }
      return (isJPG || isPNG) && sizeLimit
    },
    deviceFormatter (row, column) {
      let str = ''
      this.deviceList.forEach(item => {
        if (item.id === row.devicesType) {
          str = item.name
        }
      })
      return str
    },
    brandFormatter (row, column) {
      let str = ''
      this.brandList.forEach(item => {
        if (item.id === row.brandsType) {
          str = item.name
        }
      })
      return str
    },
    canBaudRateFormatter (row, column) {
      let str = ''
      this.canBaudRateList.forEach(item => {
        if (item.id === row.canBaudRate) {
          str = item.name
        }
      })
      return str
    },
    linBaudRateFormatter (row, column) {
      let str = row.linBaudRate
      this.linBaudRateList.forEach(item => {
        if (item.id === row.linBaudRate) {
          str = item.name
        }
      })
      return str
    },
    showPWMFormatter (row, column) {
      return row.showPWM === '1' ? '是' : '否'
    },
    getList () {
      getVersion(this.queryParams).then(res => {
        this.dataList = res.data.rows
        this.total = res.data.count
      })
    },
    getAllDevice () {
      getDevice().then(res => {
        this.deviceList = res.data.rows
      })
    },
    getAllBrand () {
      getBrand().then(res => {
        this.brandList = res.data.rows
      })
    },
    filterBrand (deviceId) {
      return this.brandList.filter(b => {
        return b.type === deviceId
      })
    },
    // 取消按钮
    cancel () {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        name: undefined,
        type: undefined,
        orderNum: 0
      }
      this.resetForm('form')
    },
    handleModifyDevice () {
      this.form = Object.assign({}, this.form, { brandsType: '' })
      this.modifyBrandList = this.filterBrand(this.form.devicesType)
    },
    handleDeviceQuery () {
      this.queryParams.brandsType = undefined
      this.queryBrandList = this.filterBrand(this.queryParams.devicesType)
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset()
      this.open = true
      this.title = '添加款式'
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset()
      const id = row.id || this.ids
      getVersionById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改款式'
        this.modifyBrandList = this.filterBrand(this.form.devicesType)
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.userId = this.$store.state.user.userInfo.user.id
          if (this.form.id !== undefined) {
            updateVersion(this.form).then(res => {
              this.$httpResponse(res.message)
              this.open = false
              this.getList()
            })
          } else {
            addVersion(this.form).then(res => {
              this.$httpResponse(res.message)
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delVersion(ids)
      }).then(() => {
        this.getList()
        this.$httpResponse('删除成功')
      }).catch(function () {})
    }
  }
}
</script>
<style scoped>
.el-textarea{
  width:250px;
}

</style>