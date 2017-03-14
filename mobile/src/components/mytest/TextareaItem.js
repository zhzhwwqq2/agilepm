/**
 * Created by samurai on 2017/3/14.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { List, TextareaItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

class TestTextareaItem extends React.Component {
    state = {
        focused: false,
    };
    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <List>
                    <TextareaItem
                        {...getFieldProps('count', {
                            initialValue: '',
                        })}
                        placeholder="好好学习，天天向上。分享下今天收获吧！"
                        rows={5}
                        count={50}
                    />
                </List>
            </div>
        );
    }
}

export const TextareaItemWrapper = createForm()(TestTextareaItem);
