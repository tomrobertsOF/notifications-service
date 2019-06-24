import 'jest';

import {Application, Identity} from 'hadouken-js-adapter';

import {NotificationOptions} from '../../src/client';

import * as notifsRemote from './utils/notificationsRemoteExecution';
import {isCenterShowing} from './utils/notificationCenterUtils';
import {delay} from './utils/delay';
import {getToastWindow, getToastCards} from './utils/toastUtils';
import * as spawnRemote from './utils/spawnRemote';

const validOptions: NotificationOptions = {
    body: 'Test Notification Body',
    title: 'Test Notification Title'
};

const testManagerIdentity = {uuid: 'test-app', name: 'test-app'};

describe('When calling createNotification', () => {
    describe('With the notification center not showing', () => {
        beforeAll(async () => {
            // Hide the center to be sure we get toasts
            if (await isCenterShowing()) {
                await notifsRemote.toggleNotificationCenter(testManagerIdentity);
            }
        });

        let testApp: Application;
        let testWindowIdentity: Identity;
        beforeEach(async () => {
            testApp = await spawnRemote.createApp(testManagerIdentity, {});
            testWindowIdentity = await testApp.getWindow().then(w => w.identity);
        });

        afterEach(async () => {
            await notifsRemote.clearAll(testWindowIdentity);
            await testApp.quit();
        });

        test('A toast is shown for the notification', async () => {
            const note = await notifsRemote.create(testWindowIdentity, validOptions);
            await delay(100);
            const toastWindow = await getToastWindow(testApp.identity, note.id);
            expect(toastWindow).not.toBe(undefined);

            await notifsRemote.clear(testWindowIdentity, note.id);
        });

        test('The toast is displaying the correct data', async () => {
            const note = await notifsRemote.create(testWindowIdentity, validOptions);
            await delay(1000);

            const toastCards = await getToastCards(testApp.identity, note.id);

            expect(Array.isArray(toastCards)).toBe(true);
            expect(toastCards).toHaveLength(1);

            const toastCard = toastCards![0];
            const titleElement = await toastCard.$('.title');
            const cardTitle = await titleElement!.getProperty('innerHTML').then(val => val.jsonValue());

            expect(cardTitle).toEqual(note.title);
        });
    });
});
