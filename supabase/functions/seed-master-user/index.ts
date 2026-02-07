import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = "master@demo.com";
    const password = "Admin123!";

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    if (existingUser) {
      // Check if role already exists
      const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("*")
        .eq("user_id", existingUser.id)
        .eq("role", "platform_admin")
        .maybeSingle();

      if (!existingRole) {
        await supabaseAdmin.from("user_roles").insert({
          user_id: existingUser.id,
          role: "platform_admin",
        });
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Master user already exists",
          userId: existingUser.id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the master user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Master Admin",
      },
    });

    if (createError) {
      throw createError;
    }

    // Update profile scope to admin
    await supabaseAdmin
      .from("profiles")
      .update({ scope: "admin", full_name: "Master Admin" })
      .eq("id", newUser.user.id);

    // Assign platform_admin role
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: newUser.user.id,
      role: "platform_admin",
    });

    if (roleError) {
      throw roleError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Master user created successfully",
        userId: newUser.user.id,
        email: email
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
