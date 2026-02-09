import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const {
      email, password, fullName, companyName, document, responsible,
      phone, plan, address,
    } = body;

    if (!email || !password || !companyName) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || responsible },
    });

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = authData.user.id;
    const tenantId = crypto.randomUUID();

    // 2. Insert company
    const { data: companyRecord, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        tenant_id: tenantId,
        name: companyName,
        document: document || null,
        email,
        phone: phone || null,
        plan: plan || "starter",
        status: "pending",
        owner_id: userId,
        responsible: responsible || null,
        address_state: address?.state || null,
        address_street: address?.street || null,
        address_number: address?.number || null,
        address_neighborhood: address?.neighborhood || null,
        address_city: address?.city || null,
        address_country: address?.country || "BR",
        address_cep: address?.cep || null,
      })
      .select("id")
      .single();

    if (companyError) {
      console.error("Company insert error:", companyError);
      // Cleanup: delete the auth user
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(JSON.stringify({ error: companyError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Update profile (created by trigger)
    await supabaseAdmin
      .from("profiles")
      .update({ tenant_id: tenantId, phone: phone || null, scope: "tenant" })
      .eq("id", userId);

    // 4. Assign tenant_admin role
    await supabaseAdmin.from("user_roles").insert({
      user_id: userId,
      role: "tenant_admin",
    });

    // 5. Audit log
    await supabaseAdmin.from("audit_logs").insert({
      user_id: userId,
      user_email: email,
      action: "CREATE",
      entity_type: "company",
      entity_id: companyRecord?.id ?? null,
      new_values: { name: companyName, plan, email, responsible },
      tenant_id: tenantId,
    });

    return new Response(
      JSON.stringify({ success: true, userId, companyId: companyRecord?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
