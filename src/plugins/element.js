import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Row,
    Col,
    Message,
    Container,
    Aside,
    Main,
    Header,

    Submenu,
    MenuItem,
    Menu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Table,
    TableColumn,
    Pagination,
    Switch,
    MessageBox,
    Dialog
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dialog)


Vue.prototype.$message = Message;
Vue.prototype.$messageBox = MessageBox.confirm