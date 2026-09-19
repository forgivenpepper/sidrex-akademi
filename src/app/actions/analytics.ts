'use server';

import { createClient } from '@/lib/supabase/server';

export async function logSectionClickAction(
  sectionId: string | null,
  sectionTitle: string
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from('section_clicks').insert({
      user_id: user.id,
      section_id: sectionId === 'all' ? null : sectionId,
      section_title: sectionTitle,
    });
  } catch (err) {
    // Non-blocking background analytics logging
    console.error('Click logging error:', err);
  }
}
