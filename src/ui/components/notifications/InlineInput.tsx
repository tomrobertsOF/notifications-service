import * as React from 'react';
import { Fin } from "../../../fin";
import { Notification } from '../../../Shared/Models/Notification';
import { ISenderInfo } from '../../../provider/Models/ISenderInfo';
import { INotification } from '../../models/INotification';

declare var fin: Fin;

export interface INotificationInlineInputProps {
    meta: Notification & ISenderInfo | INotification;
}

export class InlineInput extends React.Component<INotificationInlineInputProps, {}> {

    private handleInputSubmit(e: React.FormEvent<HTMLFormElement>){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();

        const formInfo = Array.from(e.currentTarget.elements).map((el: HTMLInputElement) => {
            return { name: el.name, value: el.value};
        });

        fin.notifications.notificationInputSubmitted(this.props.meta, formInfo);
    }

    public render(): React.ReactNode {
        return (
            <form onSubmit={this.handleInputSubmit.bind(this)} >
                <input 
                    name = {this.props.meta.inputs[0].name}
                    type = "text"
                />
            </form>
        );
    }
}