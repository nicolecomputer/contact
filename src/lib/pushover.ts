import 'dotenv/config'
import { Message } from "@prisma/client";
import { Pushover } from 'pushover-js';


export function pushoverEnabled() {
    return !!process.env.PUSHOVER_USER && process.env.PUSHOVER_TOKEN
}

export async function sendPushoverNotification(message: Message) {
    if (pushoverEnabled()) {
        const pushover = new Pushover(process.env.PUSHOVER_USER!, process.env.PUSHOVER_TOKEN!)

        pushover
            .send(`Message from ${message.name}`, `From: ${message.name} <${message.email}>\nMessage: ${message.message}\nRefer: ${message.referer || "direct"}`)
    }
}
