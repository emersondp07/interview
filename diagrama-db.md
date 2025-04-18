[Empresa]

- id
- nome
- cnpj
- email
- telefone

[Usuario]

- id
- nome
- email
- senha_hash
- tipo ('admin' | 'atendente')
- empresa_id → Empresa(id)

[Beneficiario]

- id
- nome
- cpf
- data_nascimento
- telefone
- endereco
- empresa_id → Empresa(id)

[Entrevista]

- id
- beneficiario_id → Beneficiario(id)
- usuario_id → Usuario(id)
- data_entrevista
- status ('pendente', 'concluída', 'cancelada')

[Pergunta]

- id
- texto
- tipo_resposta ('texto', 'sim_nao', 'multipla_escolha', etc.)
- obrigatoria (boolean)
- empresa_id (null = pergunta padrão)

[Resposta]

- id
- entrevista_id → Entrevista(id)
- pergunta_id → Pergunta(id)
- resposta_texto

[Plano]

- id
- nome (ex: Básico, Pro, Enterprise)
- preco_mensal
- limite_entrevistas_mensais
- descricao

[Assinatura]

- id
- empresa_id → Empresa(id)
- plano_id → Plano(id)
- inicio_vigencia
- fim_vigencia
- status ('ativa', 'cancelada', 'pendente')

[Fatura]

- id
- assinatura_id → Assinatura(id)
- mes_referencia (ex: 2025-04)
- valor
- data_emissao
- data_vencimento
- data_pagamento (nullable)
- status ('pendente', 'paga', 'vencida')

[Pagamento]

- id
- fatura_id → Fatura(id)
- metodo_pagamento ('boleto', 'cartao', 'pix')
- valor_pago
- data_pagamento
- comprovante_url (opcional)
