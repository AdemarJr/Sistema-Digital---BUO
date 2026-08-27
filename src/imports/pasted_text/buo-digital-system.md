# SISTEMA DIGITAL — BOLETIM ÚNICO DE OCORRÊNCIA (BUO)

## 1. OBJETIVO DO SISTEMA

Desenvolver um sistema web para digitalizar o processo de preenchimento do **BOLETIM ÚNICO DE OCORRÊNCIA — BUO**, atualmente realizado de forma manual.

O sistema deverá permitir que o usuário responsável pelo registro:

1. Crie um novo BUO;
2. Preencha todos os dados da ocorrência através de formulário digital;
3. Cadastre uma ou várias pessoas envolvidas;
4. Cadastre vítimas, autores e testemunhas;
5. Cadastre objetos/apreensões;
6. Cadastre armamentos, entorpecentes, veículos e outros objetos;
7. Selecione o tipo/código da ocorrência;
8. Cadastre o relato completo da ocorrência;
9. Cadastre os integrantes da guarnição;
10. Cadastre informações do policial responsável;
11. Registre informações do recibo da Delegacia de Polícia;
12. Salve o BUO no banco de dados;
13. Permita editar o BUO posteriormente;
14. Permita visualizar o BUO antes da emissão;
15. Gere automaticamente um PDF final contendo TODOS os dados cadastrados;
16. O PDF deverá manter o máximo possível da estrutura visual do BUO original.

O sistema deve funcionar como uma aplicação profissional de gestão de ocorrências, substituindo o preenchimento manual do formulário.

---

# 2. REFERÊNCIA DO FORMULÁRIO ORIGINAL

O sistema deverá utilizar como referência estrutural o documento:

**BOLETIM ÚNICO DE OCORRÊNCIA - BUO**

Cabeçalho identificado no documento:

* PMAM
* COMANDO DE POLICIAMENTO METROPOLITANO
* 1º BPM – FORÇA TÁTICA (99.0)

O formulário original possui campos para identificação da ocorrência, pessoas, objetos, relato, códigos de ocorrência, guarnição e recibo da Delegacia de Polícia.

IMPORTANTE:

Não remover informações existentes no formulário original.

O sistema deverá transformar cada campo relevante do documento em um campo digital estruturado.

---

# 3. ESTRUTURA DO CADASTRO

Criar o cadastro dividido em etapas para facilitar o preenchimento.

Utilizar um wizard/stepper:

### ETAPA 1 — IDENTIFICAÇÃO DA OCORRÊNCIA

Campos:

* Número do BUO
* Data
* Dia
* Mês
* Ano
* Hora
* Tipo de ocorrência
* Código da ocorrência
* Local da ocorrência
* Zona
* Pelotão
* Equipe
* VTR/MT
* Nº Registro CIOPS
* Situação

Criar também seleção para:

* TCO
* FLAGRANTE
* APRESENTAÇÃO DE PESSOAS
* VEÍCULO RECUPERADO
* AUXÍLIO PRESTADO
* OUTROS

Essas opções devem funcionar como checkbox/toggle.

---

# 4. PESSOAS ENVOLVIDAS

Criar uma estrutura dinâmica.

O usuário deve poder clicar:

**+ Adicionar pessoa**

Cada pessoa deverá possuir:

* Nome completo
* Idade
* RG
* Endereço
* Situação

A situação deverá permitir selecionar:

* VÍTIMA
* AUTOR
* TESTEMUNHA

Também criar:

* Destino
* Observações relacionadas à pessoa

O sistema deverá permitir cadastrar quantas pessoas forem necessárias.

Não limitar o sistema às quatro pessoas visualmente existentes no formulário original.

No PDF final, quando houver mais pessoas que o espaço disponível no modelo original, criar páginas adicionais automaticamente.

---

# 5. DESTINO DAS PESSOAS

Para cada pessoa cadastrada permitir informar:

* Destino
* Situação
* Observações

Exemplo:

Pessoa 1:

* Nome
* Idade
* RG
* Endereço
* Situação: AUTOR
* Destino: Delegacia de Polícia

Pessoa 2:

* Nome
* Idade
* RG
* Endereço
* Situação: VÍTIMA
* Destino: Hospital

---

# 6. OBJETOS / APREENSÕES

Criar uma seção específica:

## OBJETOS

Permitir cadastrar vários objetos.

Campos:

* Tipo
* Descrição
* Quantidade
* Unidade
* Observação
* Situação
* Número de identificação, quando aplicável

Criar categorias:

### ARMAMENTOS

Campos:

* Tipo
* Calibre
* Quantidade de munições
* Marca
* Modelo
* Número de série
* Situação
* Observações

### ENTORPECENTES

Campos:

* Tipo
* Substância
* Quantidade
* Unidade de medida
* Embalagem
* Observações

### VEÍCULOS / OUTROS

Campos:

* Tipo
* Marca
* Modelo
* Placa
* Cor
* Chassi
* Situação
* Observações

O documento original possui a seção de objetos relacionada a:

* ARMAMENTOS
* ENTORPECENTES
* VEÍCULOS/OUTROS

e campos relacionados a tipo/calibre/munições e tipo de apreensão.

Preservar essa lógica no sistema.

---

# 7. TIPO DE APREENSÃO

Criar campo:

**TIPO DE APREENSÃO**

Possibilitar relacionar a apreensão com:

* Armamento
* Entorpecente
* Veículo
* Outros

Cada item deverá ser associado à ocorrência.

---

# 8. RELATO DA OCORRÊNCIA

Criar um campo grande de texto:

## RELATO DA OCORRÊNCIA

Esse campo deverá permitir o registro completo da narrativa.

Características:

* Editor de texto simples
* Quebra de parágrafo
* Contador de caracteres
* Auto-save
* Possibilidade de edição
* Texto preservado exatamente como digitado

O relato deverá aparecer no PDF final em uma área própria.

Caso o relato seja muito extenso, gerar páginas adicionais automaticamente.

---

# 9. CÓDIGOS DAS OCORRÊNCIAS

Criar uma lista pesquisável de códigos/tipos de ocorrência baseada no formulário original.

A lista deverá conter, entre outros, os seguintes registros:

* ABORTO
* ESTUPRO
* AUXÍLIO AO PÚBLICO
* AGRESSÃO
* LENOCÍNIO
* CONDUÇÃO DE DEMENTE
* AMEAÇA DE MORTE
* RAPTO
* ENCONTRO DE PESSOA PERDIDA
* AFOGAMENTO
* SEDUÇÃO
* CONDUÇÃO DE DETENTO
* CÁRCERE PRIVADO
* TENTATIVA DE ESTUPRO
* OUTROS AUXÍLIOS
* HOMICÍDIO
* ARREMESSO DE PROJÉTIL
* OUTRAS OCORRÊNCIAS
* MAUS TRATOS
* USO/POSSE DE DROGA
* VIA ALAGADA
* RIXAS
* DESACATO
* ABANDONO DE INCAPAZ
* SEQUESTRO
* DESOBEDIÊNCIA
* ATRITO VERBAL
* TENTATIVA DE HOMICÍDIO
* SUBORNO
* ANIMAL MORTO EM VIA PÚBLICA
* TENTATIVA DE SUICÍDIO
* RESISTÊNCIA
* ACIDENTE AÉREO
* INVASÃO DE DOMICÍLIO
* DISPARO DE ARMA DE FOGO
* ACIDENTE FLUVIAL OU LACUSTRE
* ASSALTO
* DIREÇÃO PERIGOSA
* ULTRAJE PÚBLICO AO PUDOR
* APROPRIAÇÃO INDÉBITA
* EMBRIAGUEZ AO VOLANTE
* COMÉRCIO/FORNECIMENTO DE DROGA/TRÁFICO
* ARROMBAMENTO
* JOGO DE AZAR
* COISA ALHEIA ACHADA
* ESTELIONATO
* MENDICÂNCIA
* EXTORSÃO
* FURTO SIMPLES
* PORTE ILEGAL DE ARMA DE FOGO
* APREENSÃO DE VEÍCULO
* FURTO DE VEÍCULO
* VADIAGEM
* ATROPELAMENTO DE PESSOA
* FALSIFICAÇÃO/USO DE DINHEIRO FALSO
* ABANDONO DE LAR
* LESÃO CORPORAL
* ROUBO
* DESAPARECIMENTO DE PESSOA
* NEGAR SALDAR DESPESAS
* TENTATIVA DE FURTO
* ENCONTRO DE CADÁVER
* SUICÍDIO
* RECEPTAÇÃO DE PRODUTO ROUBADO
* ENCONTRO DE VEÍCULO FURTADO
* DANO
* PERDA DE DOCUMENTO
* ATENTADO AO PUDOR
* CORRUPÇÃO DE MENOR
* ATO OBSCENO
* APOIO À AUTORIDADE

Esses registros devem ficar em uma tabela própria no banco de dados para permitir futuras alterações sem necessidade de alterar o código da aplicação.

Permitir:

* Busca
* Filtro
* Seleção múltipla quando necessário
* Código interno
* Descrição
* Ativo/inativo

---

# 10. GUARNIÇÃO

Criar seção:

## GUARNIÇÃO

Permitir adicionar vários integrantes.

Cada integrante deverá possuir:

* Nome
* Função

O sistema deve permitir:

**+ Adicionar integrante**

Não limitar a quantidade.

No documento original existem vários campos para:

NOME:
FUNÇÃO:

Portanto, reproduzir essa lógica de maneira dinâmica.

---

# 11. POLICIAL RESPONSÁVEL

Criar seção para identificação funcional.

Campos:

* Nome
* Nº Identificação Funcional
* Função
* Observações
* Assinatura, se houver suporte para assinatura digital

---

# 12. RECIBO — DELEGACIA DE POLÍCIA

Criar seção:

## RECIBO — DELEGACIA DE POLÍCIA

Campos:

* Nome
* Função
* Assinatura
* Data
* Hora
* Observação

Criar opção para anexar assinatura digitalizada, caso seja necessário.

---

# 13. OBSERVAÇÕES GERAIS

Criar campo:

**OBSERVAÇÕES**

Campo de texto livre para informações adicionais.

Esse conteúdo também deverá aparecer no PDF.

---

# 14. BANCO DE DADOS

Criar estrutura relacional.

Sugestão:

### ocorrencias

* id
* numero_buo
* data_ocorrencia
* hora_ocorrencia
* tipo_ocorrencia
* codigo_ocorrencia
* local_ocorrencia
* zona
* pelotao
* equipe
* vtr_mt
* registro_ciops
* situacao
* tco
* flagrante
* apresentacao_pessoas
* veiculo_recuperado
* auxilio_prestado
* outros
* relato
* observacoes
* usuario_id
* created_at
* updated_at

### pessoas_ocorrencia

* id
* ocorrencia_id
* nome
* idade
* rg
* endereco
* situacao
* destino
* observacoes
* created_at

### objetos_ocorrencia

* id
* ocorrencia_id
* categoria
* tipo
* descricao
* quantidade
* unidade
* marca
* modelo
* calibre
* municoes
* numero_serie
* placa
* chassi
* cor
* situacao
* observacoes

### guarnicao

* id
* ocorrencia_id
* nome
* funcao

### codigos_ocorrencia

* id
* codigo
* descricao
* ativo

### recibo_delegacia

* id
* ocorrencia_id
* nome
* funcao
* assinatura
* data
* hora
* observacao

---

# 15. INTERFACE DO SISTEMA

Criar uma interface moderna, profissional e responsiva.

O sistema deverá funcionar em:

* Desktop
* Notebook
* Tablet

Priorizar uso em tablet, pois o preenchimento poderá ocorrer durante operações.

Utilizar:

* Cards
* Stepper
* Inputs grandes
* Botões claros
* Auto-save
* Validação dos campos
* Feedback visual
* Modal para adicionar registros
* Tabelas para listar pessoas e objetos

---

# 16. DASHBOARD

Criar dashboard inicial.

Mostrar:

### Indicadores

* BUOs registrados hoje
* BUOs registrados no mês
* Ocorrências em andamento
* BUOs finalizados
* BUOs pendentes
* Total de pessoas cadastradas
* Total de apreensões

Criar tabela:

**Últimos BUOs cadastrados**

Colunas:

* Nº BUO
* Data
* Hora
* Tipo
* Local
* Equipe
* Situação
* Status
* Ações

Ações:

* Visualizar
* Editar
* Gerar PDF
* Imprimir
* Duplicar
* Arquivar

---

# 17. STATUS DO BUO

Criar workflow:

### RASCUNHO

Cadastro ainda não finalizado.

### EM PREENCHIMENTO

Usuário está preenchendo.

### FINALIZADO

Todos os dados foram conferidos.

### PDF GERADO

Documento final foi gerado.

### ARQUIVADO

Registro encerrado.

Não apagar registros finalizados.

---

# 18. VALIDAÇÕES

Criar validações antes da finalização.

Exigir pelo menos:

* Data
* Hora
* Tipo de ocorrência
* Local
* Código da ocorrência
* Relato
* Responsável

Quando faltar informação, mostrar:

"Existem campos obrigatórios que precisam ser preenchidos."

Informar exatamente quais campos estão pendentes.

---

# 19. PRÉ-VISUALIZAÇÃO

Antes de gerar o PDF, apresentar:

## CONFERÊNCIA DO BUO

Mostrar todas as informações cadastradas.

Organizar exatamente na ordem:

1. Identificação da ocorrência
2. Pessoas
3. Objetos
4. Apreensões
5. Relato
6. Códigos
7. Guarnição
8. Responsável
9. Observações
10. Recibo da Delegacia

Adicionar botões:

**EDITAR**

**CONFIRMAR E GERAR PDF**

---

# 20. GERAÇÃO DO PDF

Essa é uma das partes mais importantes do sistema.

Ao clicar:

**GERAR PDF DO BUO**

o backend deverá gerar um documento PDF profissional.

O PDF deve conter:

* Cabeçalho PMAM
* COMANDO DE POLICIAMENTO METROPOLITANO
* 1º BPM – FORÇA TÁTICA (99.0)
* BOLETIM ÚNICO DE OCORRÊNCIA - BUO
* Todas as informações cadastradas
* Pessoas envolvidas
* Objetos
* Apreensões
* Relato
* Códigos
* Guarnição
* Responsável
* Observações
* Recibo da Delegacia

---

# 21. MODELO DO PDF

Criar o PDF com layout baseado no documento original.

O sistema deverá utilizar um template HTML/CSS convertido para PDF ou uma biblioteca apropriada de geração de PDF.

Requisitos:

* A4
* Margens profissionais
* Cabeçalho
* Rodapé
* Numeração das páginas
* Quebra automática de página
* Tabelas
* Campos destacados
* Tipografia legível
* Preservar o padrão visual do BUO

Quando os dados ultrapassarem uma página, criar automaticamente:

Página 1
Página 2
Página 3
etc.

Nunca cortar texto.

---

# 22. CABEÇALHO DO PDF

Criar cabeçalho:

PMAM

COMANDO DE POLICIAMENTO METROPOLITANO

1º BPM – FORÇA TÁTICA (99.0)

BOLETIM ÚNICO DE OCORRÊNCIA - BUO

Adicionar identificação do BUO e número da página.

---

# 23. RODAPÉ

Adicionar:

BUO Nº XXXXX

Página X de Y

Data de geração

Usuário responsável pela geração

---

# 24. ARQUIVAMENTO DO PDF

Após gerar o PDF:

* Salvar o arquivo no servidor/storage;
* Associar o PDF ao registro;
* Registrar data de geração;
* Registrar usuário que gerou;
* Permitir gerar novamente;
* Não sobrescrever versões anteriores sem controle.

Criar histórico de PDFs gerados.

Tabela:

### buo_documentos

* id
* ocorrencia_id
* arquivo
* versao
* data_geracao
* usuario_id
* hash
* created_at

---

# 25. SEGURANÇA

Como o sistema trabalha com informações de ocorrências e pessoas, implementar:

* Login
* Controle de sessão
* Controle de permissões
* Criptografia de senhas
* HTTPS
* Logs de acesso
* Logs de alteração
* Backup
* Controle de usuários
* Controle de permissões por função

Perfis sugeridos:

### ADMINISTRADOR

Acesso completo.

### OPERADOR

Criar e editar BUO.

### CONSULTA

Somente visualizar e gerar PDF.

### SUPERVISOR

Visualizar, validar, finalizar e gerar PDF.

---

# 26. AUDITORIA

Toda alteração relevante deverá ser registrada.

Registrar:

* Usuário
* Data
* Hora
* Ação
* Registro alterado
* Valor anterior
* Novo valor

Exemplo:

"Usuário X alterou o local da ocorrência."

---

# 27. PESQUISA DE BUOs

Criar tela:

## CONSULTAR BUOs

Filtros:

* Número BUO
* Data inicial
* Data final
* Tipo de ocorrência
* Código da ocorrência
* Local
* Equipe
* VTR/MT
* Nº CIOPS
* Situação
* Status

Permitir exportação e geração do PDF.

---

# 28. DUPLICAR BUO

Criar função:

**DUPLICAR BUO**

Ao duplicar:

* Criar novo ID
* Novo número BUO
* Nova data
* Nova hora
* Manter estrutura reutilizável

Solicitar confirmação antes de duplicar.

---

# 29. AUTO-SAVE

O formulário deverá salvar automaticamente o progresso.

Exibir:

"Salvo automaticamente às 12:35"

Se o navegador fechar, o usuário poderá continuar o cadastro posteriormente.

---

# 30. EXPERIÊNCIA DE USO

O preenchimento deverá ser extremamente simples.

Fluxo:

NOVO BUO

↓

IDENTIFICAÇÃO

↓

PESSOAS

↓

OBJETOS

↓

OCORRÊNCIA

↓

RELATO

↓

GUARNIÇÃO

↓

RECIBO

↓

CONFERÊNCIA

↓

FINALIZAR

↓

GERAR PDF

↓

VISUALIZAR / BAIXAR / IMPRIMIR

---

# 31. RESPONSIVIDADE

No celular/tablet:

* Campos ocupando largura disponível;
* Botões grandes;
* Stepper adaptável;
* Listas transformadas em cards;
* Modal ocupando quase toda a tela.

No desktop:

* Layout em duas colunas quando apropriado;
* Sidebar;
* Dashboard;
* Tabelas completas.

---

# 32. ARQUITETURA RECOMENDADA

Separar:

Frontend
Backend
Banco de dados
Storage
Serviço de geração de PDF

Criar APIs REST ou arquitetura equivalente.

Exemplo:

POST /api/buo

GET /api/buo/:id

PUT /api/buo/:id

DELETE /api/buo/:id

POST /api/buo/:id/finalizar

POST /api/buo/:id/pdf

GET /api/buo/:id/pdf

GET /api/buo

GET /api/codigos-ocorrencia

POST /api/pessoas

POST /api/objetos

POST /api/guarnicao

---

# 33. REQUISITO IMPORTANTE SOBRE O PDF

O sistema NÃO deve simplesmente imprimir a tela do navegador.

Criar um gerador de documento específico.

O PDF deve ser independente da interface.

O resultado final deverá parecer um documento oficial preenchido digitalmente.

Priorizar:

* Precisão
* Legibilidade
* Organização
* Integridade das informações
* Paginação correta

---

# 34. CONTROLE DE INTEGRIDADE

Ao finalizar o BUO:

1. Bloquear alterações comuns;
2. Registrar data/hora da finalização;
3. Registrar usuário responsável;
4. Gerar hash do conteúdo;
5. Gerar PDF;
6. Armazenar versão do documento.

Se for necessário alterar posteriormente, criar uma nova versão.

Nunca apagar silenciosamente a versão anterior.

---

# 35. HASH DO DOCUMENTO

Após gerar o PDF, calcular SHA-256.

Exemplo:

BUO-000123

Hash:

SHA-256: XXXXXXXX...

Salvar o hash no banco.

Isso permitirá verificar se o PDF foi alterado posteriormente.

---

# 36. IMPRESSÃO

Criar botão:

**IMPRIMIR BUO**

A impressão deverá utilizar o mesmo layout do PDF.

---

# 37. DOWNLOAD

Criar:

**GERAR PDF**

**VISUALIZAR PDF**

**IMPRIMIR**

**ARQUIVAR**

---

# 38. IMPORTANTE — NÃO PERDER INFORMAÇÕES

Todas as informações existentes no formulário original devem ser contempladas.

O sistema deve ser construído a partir do documento BUO fornecido como referência.

Não simplificar o formulário eliminando campos.

Quando houver dúvida sobre um campo do PDF, preservar o campo e permitir preenchimento manual.

---

# 39. ESTRUTURA VISUAL DO CADASTRO

Criar um layout semelhante a:

---

BOLETIM ÚNICO DE OCORRÊNCIA

[ NOVO BUO ]

### IDENTIFICAÇÃO

Número BUO
Data
Hora
Tipo
Código
Local
Zona

Pelotão
Equipe
VTR/MT
CIOPS

[ TCO ] [ FLAGRANTE ] [ APRESENTAÇÃO ]

---

### PESSOAS ENVOLVIDAS

[ + ADICIONAR PESSOA ]

| Nome | Idade | RG | Situação | Destino | Ações |

---

### OBJETOS / APREENSÕES

[ + ADICIONAR OBJETO ]

| Categoria | Tipo | Descrição | Quantidade | Ações |

---

### RELATO DA OCORRÊNCIA

[ Área de texto ]

---

### GUARNIÇÃO

[ + ADICIONAR INTEGRANTE ]

| Nome | Função | Ações |

---

### RECIBO — DELEGACIA

Nome
Função
Data
Hora
Assinatura

---

[ SALVAR RASCUNHO ]

[ CONFERIR BUO ]

[ FINALIZAR ]

---

# 40. RESULTADO ESPERADO

O produto final deverá ser um sistema web profissional capaz de substituir o preenchimento manual do BUO.

O usuário não deve precisar editar o PDF manualmente.

Todo o processo deve ocorrer no sistema:

CADASTRAR

→ CONFERIR

→ FINALIZAR

→ GERAR PDF

→ ARQUIVAR

O PDF gerado deverá conter todas as informações cadastradas e manter a identidade e estrutura do documento BUO original.

---

# 41. REGRA FUNDAMENTAL DO DESENVOLVIMENTO

Antes de implementar:

1. Analisar cuidadosamente o PDF original;
2. Mapear todos os campos;
3. Criar uma matriz:

CAMPO DO PDF → CAMPO DO SISTEMA → CAMPO DO BANCO → CAMPO DO PDF FINAL

4. Garantir que nenhum campo seja perdido;
5. Implementar primeiro o cadastro;
6. Depois implementar a visualização;
7. Depois implementar o PDF;
8. Finalmente implementar auditoria, versões e segurança.

Não iniciar pela interface visual sem antes criar o mapeamento completo dos campos.

---

# 42. ENTREGA

Entregar o sistema com:

* Dashboard
* Cadastro de BUO
* Cadastro de pessoas
* Cadastro de objetos
* Cadastro de apreensões
* Cadastro de códigos
* Cadastro de guarnição
* Relato
* Recibo
* Consulta
* Edição
* Finalização
* Histórico
* Auditoria
* Geração de PDF
* Impressão
* Armazenamento
* Controle de usuários
* Controle de permissões
* Responsividade

O resultado deve ter aparência de um sistema corporativo/profissional, e não de um formulário simples.

Priorizar UX, velocidade de preenchimento, segurança, rastreabilidade e fidelidade ao documento BUO original.
