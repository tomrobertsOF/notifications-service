import * as React from 'react';
import { NotificationTime } from '../NotificationTime';
import { INotificationProps } from '../../../models/INotificationProps';
import { InlineInput } from '../InlineInput';
import { Fin } from "../../../../fin";
declare var fin: Fin;

/**
 * Displays a button notification within the UI
 */
export class InlineNotification extends React.Component<INotificationProps, {}> {

    private handleNotificationClose(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        fin.notifications.closeHandler(this.props.meta);
    }

    public render(): React.ReactNode {
        let buttons = null;
        if (this.props.meta.inputs) {
            buttons = this.props.meta.inputs.map((button, idx) => {
                return <InlineInput key={idx} meta={this.props.meta}/>;
            });
        }

        return (
            <li className="notification-item" onClick={() => fin.notifications.clickHandler(this.props.meta)}>
                <img className="notification-close-x" src="image/shapes/notifications-x.png" alt=""
                    onClick={(e) => this.handleNotificationClose(e)}
                />
                <NotificationTime date={new Date(this.props.meta.date)} />
                <div className="notification-body">
                    <div className="notification-source">
                        <img src={this.props.meta.icon} className="notification-small-img" />
                        <span className="notification-source-text">{this.props.meta.name}</span>
                    </div>
                    <div className="notification-body-title">{this.props.meta.title}</div>
                    <div className="notification-body-text">{this.props.meta.body}</div>
                    <div id='notification-body-buttons'>
                        {buttons}
                    </div>
                </div>
            </li>
        );
    }
}
