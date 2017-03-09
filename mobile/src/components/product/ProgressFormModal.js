/**
 * Created by sunlong on 16/8/7.
 */
import React from "react";
import Fetch from '../../common/FetchIt';
import { Icon, Button, Modal, Form, Input,　DatePicker } from 'antd';
import API_URL from "../../common/url";
import moment from 'moment';
const FormItem = Form.Item;

class ProgressForm extends React.Component{
    render () {
        const { getFieldProps } = this.props.form;
        return (
            <Form horizontal>
                <Input {...getFieldProps('sprintBacklogId')} type="hidden"/>
                <Input {...getFieldProps('sprintId')} type="hidden"/>
                <FormItem
                    label="更新时间"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <DatePicker showTime format="yyyy-MM-dd HH:mm:ss" {...getFieldProps('updatedDate', {
                        rules: [{required: true, message:'必填', type: 'date'}]
                    })}/>
                </FormItem>
                <FormItem
                    label="进度"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}>
                    <Input {...getFieldProps('progress', {
                        rules: [{required: true, message:'必填'}, {min:0, max: 100, message:'请输入小于100的整数', type:'integer', transform: value=>Number(value)}]
                    })} type="input"/>
                </FormItem>
            </Form>
        );
    }
}

const ProgressFormModal = React.createClass({
    getInitialState: function () {
        return {visible: false};
    },
    submit: function(){
        this.refs.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log(this.refs.form.getFieldsValue());
            Fetch.postJSON(`${API_URL.progress.add}`, {body:JSON.stringify(this.refs.form.getFieldsValue())}).then(()=>{
                this.props.reload(this.refs.form.getFieldValue('progress'));
                this.hide();
            });
        });
    },
    show: function(){
        this.setState({visible: true});
    },
    hide: function() {
        this.setState({ visible: false });
    },
    render: function() {
        let progress = {};
        if(this.props.progress){
            progress = this.props.progress;
        }
        ProgressForm = Form.create({
            mapPropsToFields() {
                return {
                    sprintBacklogId: {value: progress.sprintBacklogId},
                    progress: {value: progress.progress},
                    updatedDate: {value: moment().subtract(1, 'days').toDate()},
                    sprintId: {value: progress.sprintId},
                };
            }
        })(ProgressForm);
        return (
            <Modal title="更新进度" visible={this.state.visible} onOk={this.submit} onCancel={this.hide}>
                <ProgressForm ref="form"/>
            </Modal>
        );
    }
});

export default ProgressFormModal;