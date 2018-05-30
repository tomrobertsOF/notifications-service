import { OptionButton } from "../../Shared/Models/OptionButton";
import { NotificationTypes } from '../../Shared/Models/NotificationTypes';
import { OptionInput } from "../../Shared/Models/OptionInput";

export interface INotification {
    date: number;
    icon: string;
    title: string;
    body: string;
    name: string;
    id: string;
    uuid: string;
    buttons?: OptionButton[];
    inputs?: OptionInput[];
    type?: NotificationTypes;
    buttonIndex?: number;
}