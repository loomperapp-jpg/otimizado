exports.handler = async (event, context) => {
  // Apenas POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { user_id, invite_phone, user_name, user_whatsapp } = JSON.parse(event.body);

    // Validações
    if (!user_id || !invite_phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados inválidos' })
      };
    }

    // TODO: Integração com Make.com ou serviço de email
    // Por enquanto, apenas retorna sucesso
    
    // Formato da mensagem
    const inviteMessage = `
Olá! 👋

${user_name || 'Um amigo'} (${user_whatsapp}) convidou você para participar do Beta fechado do LOOMPER!

🚀 LOOMPER é a plataforma que conecta motoristas cegonha, chapas/ajudantes e transportadoras.

Cadastre-se agora com o código de convite: ${user_id}

Link: ${process.env.URL || 'https://loomper.com.br'}?ref=${user_id}

--
LOOMPER — Do Brasil para o Mundo 🇧🇷
    `.trim();

    // Aqui você pode integrar com:
    // - Make.com (webhook)
    // - Twilio (WhatsApp Business API)
    // - SendGrid (email)
    
    // Exemplo webhook Make.com:
    if (process.env.MAKE_WEBHOOK_URL) {
      await fetch(process.env.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          invite_phone,
          user_name,
          user_whatsapp,
          message: inviteMessage,
          action: 'send_invite'
        })
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Convite enviado com sucesso'
      })
    };

  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao processar convite' })
    };
  }
};
