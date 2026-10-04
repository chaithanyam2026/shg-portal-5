import { readWhatsappSettings } from "@/features/settings/services";
import { formatCurrency } from "@/lib/utils/currency";

import { toWhatsappParameterText, WHATSAPP_TEMPLATE } from "../../domain/whatsapp-template";
import {
  buildMeetingCloseWhatsapp,
  type MeetingCloseWhatsappPayload,
  type MeetingCloseWhatsappRecipient,
} from "./build-meeting-close-message";
import { renderMeetingCloseImage } from "./render-meeting-close-image";

const MEETING_CLOSE_IMAGE_TEMPLATE = "meeting_close_table";
const MEETING_CLOSE_TEXT_TEMPLATE = "meeting_close_update";
const MEETING_CLOSE_TEMPLATE_LANGUAGE = "en";

/** Test recipient until member phones are enabled. */
export const WHATSAPP_TEST_PHONE = "918075248075";

export function toWhatsappPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return `91${digits}`;
  }

  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  return digits;
}

/**
 * Until go-live every meeting-close image is delivered to the test number.
 * Pass the member phone through at go-live. The greeting uses that member's name.
 */
export function resolveRecipientPhone(memberPhone: string): string {
  void memberPhone;

  // Go-live: send this member's table image to their own number.
  // const phone = toWhatsappPhone(memberPhone);
  // if (phone.length >= 12) {
  //   return phone;
  // }

  return WHATSAPP_TEST_PHONE;
}

function whatsappCredentials(): { token: string; phoneNumberId: string } | null {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

  if (!token || !phoneNumberId) {
    console.error(
      "WhatsApp is enabled but WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID is missing.",
    );
    return null;
  }

  return { token, phoneNumberId };
}

function meetingCloseMessageBody(payload: MeetingCloseWhatsappPayload, memberName: string): string {
  const labels = WHATSAPP_TEMPLATE.labels;
  const income = payload.content.incomes.reduce((sum, line) => sum + line.amount, 0);
  const expense = payload.content.expenses.reduce((sum, line) => sum + line.amount, 0);
  const summary = [
    `Hi ${memberName}.`,
    `${labels.totalIncome} ${formatCurrency(income)}`,
    `${labels.totalExpense} ${formatCurrency(expense)}`,
    `${labels.cashInHand} ${formatCurrency(payload.content.cashInHand)}`,
    `${labels.bankBalance} ${formatCurrency(payload.content.bankBalance)}`,
  ].join(" ");

  return toWhatsappParameterText(summary) || `Hi ${memberName}. Meeting closed.`;
}

function templateUnavailable(responseText: string): boolean {
  return /132001|132015|132016|132068|pending|not approved|does not exist/i.test(responseText);
}

async function uploadImage(
  token: string,
  phoneNumberId: string,
  png: Buffer,
): Promise<string | null> {
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", "image/png");
  form.append("file", new Blob([new Uint8Array(png)], { type: "image/png" }), "meeting-close.png");

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("WhatsApp meeting close image upload failed.", response.status, body);
    return null;
  }

  const data = (await response.json()) as { id?: string };

  if (!data.id) {
    console.error("WhatsApp meeting close image upload did not return an id.");
    return null;
  }

  return data.id;
}

async function postWhatsapp(
  phoneNumberId: string,
  token: string,
  body: unknown,
): Promise<{ ok: boolean; unavailable: boolean }> {
  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    return { ok: true, unavailable: false };
  }

  const responseText = await response.text();
  console.error("WhatsApp meeting close message failed.", response.status, responseText);
  return { ok: false, unavailable: templateUnavailable(responseText) };
}

function imageTemplateBody(input: {
  to: string;
  mediaId: string;
  memberName: string;
  payload: MeetingCloseWhatsappPayload;
}) {
  return {
    messaging_product: "whatsapp",
    to: input.to,
    type: "template",
    template: {
      name: MEETING_CLOSE_IMAGE_TEMPLATE,
      language: { code: MEETING_CLOSE_TEMPLATE_LANGUAGE },
      components: [
        {
          type: "header",
          parameters: [{ type: "image", image: { id: input.mediaId } }],
        },
        {
          type: "body",
          parameters: [
            {
              type: "text",
              parameter_name: "member_name",
              text: toWhatsappParameterText(input.memberName) || "Member",
            },
            {
              type: "text",
              parameter_name: "meeting_date",
              text: toWhatsappParameterText(input.payload.meetingDate),
            },
            {
              type: "text",
              parameter_name: "closing_time",
              text: toWhatsappParameterText(input.payload.closingTime),
            },
            {
              type: "text",
              parameter_name: "message_body",
              text: meetingCloseMessageBody(input.payload, input.memberName),
            },
          ],
        },
      ],
    },
  };
}

function textTemplateBody(input: {
  to: string;
  memberName: string;
  payload: MeetingCloseWhatsappPayload;
}) {
  return {
    messaging_product: "whatsapp",
    to: input.to,
    type: "template",
    template: {
      name: MEETING_CLOSE_TEXT_TEMPLATE,
      language: { code: MEETING_CLOSE_TEMPLATE_LANGUAGE },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              parameter_name: "meeting_date",
              text: toWhatsappParameterText(input.payload.meetingDate),
            },
            {
              type: "text",
              parameter_name: "closing_time",
              text: toWhatsappParameterText(input.payload.closingTime),
            },
            {
              type: "text",
              parameter_name: "message_body",
              text: meetingCloseMessageBody(input.payload, input.memberName),
            },
          ],
        },
      ],
    },
  };
}

async function sendMemberTable(input: {
  token: string;
  phoneNumberId: string;
  to: string;
  recipient: MeetingCloseWhatsappRecipient;
  payload: MeetingCloseWhatsappPayload;
  allowImageTemplate: boolean;
}): Promise<{ sent: boolean; imageTemplateUnavailable: boolean }> {
  const png = await renderMeetingCloseImage({
    memberName: input.recipient.memberName,
    memberIndex: input.recipient.memberIndex,
    meetingDate: input.payload.meetingDate,
    closingTime: input.payload.closingTime,
    content: input.payload.content,
  });
  const mediaId = await uploadImage(input.token, input.phoneNumberId, png);
  let imageTemplateUnavailable = false;

  if (input.allowImageTemplate && mediaId) {
    const imageTemplate = await postWhatsapp(
      input.phoneNumberId,
      input.token,
      imageTemplateBody({
        to: input.to,
        mediaId,
        memberName: input.recipient.memberName,
        payload: input.payload,
      }),
    );

    if (imageTemplate.ok) {
      return { sent: true, imageTemplateUnavailable: false };
    }

    imageTemplateUnavailable = imageTemplate.unavailable;
  }

  const textTemplate = await postWhatsapp(
    input.phoneNumberId,
    input.token,
    textTemplateBody({
      to: input.to,
      memberName: input.recipient.memberName,
      payload: input.payload,
    }),
  );

  if (mediaId) {
    await postWhatsapp(input.phoneNumberId, input.token, {
      messaging_product: "whatsapp",
      to: input.to,
      type: "image",
      image: { id: mediaId },
    });
  }

  return {
    sent: textTemplate.ok,
    imageTemplateUnavailable,
  };
}

export async function notifyMeetingClosed(meetingId: string): Promise<void> {
  try {
    const settings = await readWhatsappSettings();

    if (!settings.whatsappMeetingCloseEnabled) {
      return;
    }

    const credentials = whatsappCredentials();

    if (!credentials) {
      return;
    }

    const payload = await buildMeetingCloseWhatsapp(meetingId);

    if (!payload) {
      console.error("WhatsApp meeting close message skipped. Meeting is not closed.", meetingId);
      return;
    }

    let allowImageTemplate = true;

    for (const recipient of payload.recipients) {
      const result = await sendMemberTable({
        token: credentials.token,
        phoneNumberId: credentials.phoneNumberId,
        to: resolveRecipientPhone(recipient.phone),
        recipient,
        payload,
        allowImageTemplate,
      });

      if (result.imageTemplateUnavailable) {
        allowImageTemplate = false;
      }

      if (result.sent) {
        console.info("WhatsApp meeting close message sent.", recipient.memberName);
      }
    }
  } catch (error) {
    console.error("WhatsApp meeting close message failed.", error);
  }
}
