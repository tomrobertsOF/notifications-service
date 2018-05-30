import * as React from 'react';
import { Fin } from "../../fin";
import { Notification } from './notifications/templates/Notification';
import { ButtonNotification } from './notifications/templates/ButtonNotification';
import { INotificationProps } from '../models/INotificationProps';
import { NotificationTypes } from '../../Shared/Models/NotificationTypes';
import { InlineNotification } from './notifications/templates/InlineNotification';

declare var fin: Fin;

/**
 * Determines what type of notification to display in the UI
 */
export class NotificationType extends React.Component<INotificationProps, {}> {
    public render(): React.ReactNode {
       
        switch(this.props.meta.type){
            case NotificationTypes.BUTTON: {
                return <ButtonNotification meta={this.props.meta} />;
            }
            case NotificationTypes.INLINE: {
                return <InlineNotification meta={this.props.meta} />;
            }
            default: {
                return <Notification meta={this.props.meta} />;
            }
        }
    }
}
