exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { user_id, user_email, user_name, user_type } = JSON.parse(event.body);

    // Validações
    if (!user_id || !user_email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados inválidos' })
      };
    }

    // TODO: Integração com Make.com para envio de NDA via email
    
    const ndaEmailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #071226; color: #fff; padding: 30px; border-radius: 10px;">
    <h1 style="color: #ff7a2d; text-align: center;">Bem-vindo ao Beta LOOMPER!</h1>
    
    <p>Olá <strong>${user_name}</strong>,</p>
    
    <p>Sua inscrição foi confirmada! Você faz parte do grupo seleto de pioneiros do LOOMPER.</p>
    
    <p><strong>Seu ID:</strong> <code style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 5px;">${user_id}</code></p>
    
    <h2 style="color: #cfa34a;">Próximos Passos:</h2>
    <ol>
      <li>Leia o Termo de Confidencialidade (NDA) em anexo</li>
      <li>Responda este email confirmando o aceite</li>
      <li>Entre no grupo WhatsApp de pioneiros</li>
      <li>Aguarde instruções para acesso à plataforma</li>
    </ol>
    
    <h3 style="color: #cfa34a;">Benefícios como Pioneiro:</h3>
    <ul>
      <li>🎯 Acesso antecipado à plataforma</li>
      <li>💳 Créditos trial para testes</li>
      <li>⭐ Reconhecimento como early adopter</li>
      <li>🗣️ Voz ativa no desenvolvimento</li>
    </ul>
    
    <div style="background: rgba(255,122,45,0.1); padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0;"><strong>⚠️ IMPORTANTE:</strong> Este é um programa Beta fechado. Não compartilhe informações da plataforma sem autorização.</p>
    </div>
    
    <p>Qualquer dúvida, responda este email ou entre em contato via WhatsApp.</p>
    
    <p style="margin-top: 30px;">
      <strong>LOOMPER</strong><br>
      contato@loomper.com.br<br>
      WhatsApp: +55 11 96585-8142
    </p>
    
    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;">
    
    <p style="font-size: 12px; color: #a1b0c5; text-align: center;">
      © 2025 LOOMPER — Grupo Ajud.AI • São Bernardo do Campo, SP, Brasil
    </p>
  </div>
</body>
</html>
    `.trim();

    // Integração com Make.com ou serviço de email
    if (process.env.MAKE_WEBHOOK_URL) {
      await fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          user_email,
          user_name,
          user_type,
          email_content: ndaEmailContent,
          action: 'send_nda'
        })
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'NDA enviado por email'
      })
    };

  } catch (error) {
    console.error('Erro ao enviar NDA:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar NDA' })
    };
  }
};