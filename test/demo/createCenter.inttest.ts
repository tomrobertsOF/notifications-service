// Tests for creating notifications with the center showing (i.e. no toasts)

import 'jest';

import {Application, Window} from 'hadouken-js-adapter';

import {Notification, NotificationOptions} from '../../src/client';

import {createApp} from './utils/spawnRemote';
import {isCenterShowing, getCardsByNotification} from './utils/notificationCenterUtils';
import * as notifsRemote from './utils/notificationsRemoteExecution';

const testManagerIdentity = {uuid: 'test-app', name: 'test-app'};

describe('When creating a notification with the center displayed', () => {
    let testApp: Application;
    let testWindow: Window;

    beforeAll(async () => {
        // Toggle the center on/off based on test type
        if (!(await isCenterShowing())) {
            await notifsRemote.toggleNotificationCenter(testManagerIdentity);
        }
    });

    beforeEach(async () => {
        testApp = await createApp(testManagerIdentity, {});
        testWindow = await testApp.getWindow();
    });

    afterEach(async () => {
        await notifsRemote.clearAll(testWindow.identity);
        await testApp.quit();
    });

    describe('When options does not include title and/or body', () => {
        const options: NotificationOptions = {id: 'invalid-notification'} as NotificationOptions;

        let createPromise: Promise<Notification>;
        beforeEach(async () => {
            // Intentionally circumventing type check with cast for testing purposes
            createPromise = notifsRemote.create(testWindow.identity, options);

            // We want to be sure the operation is completed, but don't care about the result
            await createPromise.catch(() => {});
        });

        afterEach(async () => {
            // Cleanup the created notification (just in case it does get made)
            await notifsRemote.clear(testWindow.identity, options.id!);
        });

        test('The promise rejects with a suitable error message', async () => {
            await expect(createPromise).rejects.toThrow(/Invalid arguments passed to createNotification/);
        });

        test('A card is not added to the notification center', async () => {
            const noteCards = await getCardsByNotification(testApp.identity.uuid, options.id!);
            expect(noteCards).toEqual([]);
        });
        test('The notification does not appear in the result of getAll', async () => {
            const appNotes = await notifsRemote.getAll(testWindow.identity);
            expect(appNotes).toEqual([]);
        });
    });

    describe('When options does not include id', () => {
        const options: NotificationOptions = {body: 'Test Notification Body', title: 'Test Notificaiton Title'};

        let createPromise: Promise<Notification>;
        beforeEach(async () => {
            // Intentionally circumventing type check with cast for testing purposes
            createPromise = notifsRemote.create(testWindow.identity, options);

            // We want to be sure the operation is completed, but don't care about the result
            await createPromise.catch(() => {});
        });

        test('An id is generated by the service and returned in the hydrated object', async () => {
            await expect(createPromise).resolves;
            const note = await createPromise;

            expect(note).toMatchObject(options);
            expect(note.id).toMatch(/[0-9]{9}/); // Random 9-digit numeric string
        });
        test.todo('The notification is created as expected');
    });

    describe('When passing a valid set of options', () => {
        const options: NotificationOptions = {
            body: 'Test Notification Body',
            title: 'Test Notificaiton Title',
            id: 'test-notification-0',
            icon: 'https://openfin.co/favicon.ico'
        };

        let createPromise: Promise<Notification>;
        beforeEach(async () => {
            // Intentionally circumventing type check with cast for testing purposes
            createPromise = notifsRemote.create(testWindow.identity, options);

            // We want to be sure the operation is completed, but don't care about the result
            await createPromise.catch(() => {});
        });

        test('The promise resolves to the fully hydrated notification object', async () => {
            await expect(createPromise).resolves;
            const note = await createPromise;

            expect(note).toMatchObject(options);
        });
        test.todo('The missing options are filled in with default values'); // Maybe don't do??
        test('Once card appears in the notification center', async () => {
            const note = await createPromise;

            const noteCards = await getCardsByNotification(testApp.identity.uuid, note.id);
            expect(noteCards).toHaveLength(1);
        });
        test.todo('The card has the same data as the returned notification object');
        test.todo('The notification is included in the result of a getAll call');
    });

    describe.each([1, 2, 3])('With %i button(s)', numButtons => {
        const options: NotificationOptions = {body: 'Test Notification Body', title: 'Test Notificaiton Title', buttons: []};
        for (let i = 0; i < numButtons; i++) {
            options.buttons!.push({title: 'Button ' + i});
        }

        test.todo('The notification is created as expected');
        test.todo('The notification card has the correct number of button elements');
        test.todo('The button elements are in the correct order');
    });
});
