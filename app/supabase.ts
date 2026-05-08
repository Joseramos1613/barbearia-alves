import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ezjajufngfudgynxrbgh.supabase.co";
const supabaseKey = "sb_publishable_cY0ziMLe2xTVuNg70L7Zyw_ZOQ_0F-S";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);