import "server-only";

import { createServiceClient } from "@/lib/supabaseServer";
import { type AppLocale } from "@/lib/i18n/config";

type FaqRow = {
  id: string;
  display_order: number | null;
  translations: Array<{
    question: string;
    answer_html: string;
  }>;
};

export type FaqItem = {
  id: string;
  question: string;
  answerHtml: string;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function fetchFaqItems(locale: AppLocale): Promise<FaqItem[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select(
      `
      id,
      display_order,
      translations:faq_item_translations!inner(
        question,
        answer_html,
        locale
      )
    `,
    )
    .eq("status", "published")
    .eq("translations.locale", locale)
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return (data as FaqRow[])
    .map((row) => {
      const translation = row.translations?.[0];
      if (!translation) return null;
      return {
        id: row.id,
        question: translation.question,
        answerHtml: translation.answer_html,
      };
    })
    .filter((item): item is FaqItem => Boolean(item));
}

export function faqAnswerText(value: string) {
  return stripHtml(value);
}
