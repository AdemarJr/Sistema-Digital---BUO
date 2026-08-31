import { BUO, Objeto } from "../types/buo";
import { CODIGOS_OCORRENCIA } from "../data/codes";
import { splitDateParts, formatDateBR } from "../utils/date";

interface Props {
  buo: BUO;
  logos?: { brasao: string; pmam: string };
}

function hasText(value?: string | null): boolean {
  return Boolean(value?.trim());
}

function Check({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className={`buo-check${checked ? " is-on" : ""}`}>
      <span className="buo-check__box">{checked ? "✓" : ""}</span>
      <span className="buo-check__label">{label}</span>
    </span>
  );
}

/** Só renderiza o campo quando houver valor preenchido. */
function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  if (!hasText(value)) return null;
  return (
    <div className={`buo-field${wide ? " buo-field--wide" : ""}`}>
      <span className="buo-field__label">{label}</span>
      <span className="buo-field__value">{value!.trim()}</span>
    </div>
  );
}

function DigitGroup({ label, value }: { label: string; value: string }) {
  if (!hasText(value)) return null;
  return (
    <div className="buo-digit-group">
      <span className="buo-digit-group__label">{label}</span>
      <span className="buo-digit-group__value">{value}</span>
    </div>
  );
}

function joinParts(parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" / ");
}

function armamentoDesc(o: Objeto): string {
  return joinParts([
    o.tipo,
    o.marca,
    o.modelo,
    o.calibre && `cal: ${o.calibre}`,
    o.municoes && `mun: ${o.municoes}`,
    o.numeroSerie && `série: ${o.numeroSerie}`,
    o.tipoApreensao,
    o.situacao && `sit: ${o.situacao}`,
    o.observacoes,
  ]);
}

function entorpDesc(o: Objeto): string {
  return joinParts([
    o.tipo,
    o.substancia,
    o.tipoApreensao,
    o.embalagem && `emb: ${o.embalagem}`,
    o.descricao,
    o.situacao && `sit: ${o.situacao}`,
    o.observacoes,
  ]);
}

function veiculoDesc(o: Objeto): string {
  return joinParts([
    o.tipo,
    o.marca,
    o.modelo,
    o.placa,
    o.cor,
    o.chassi && `chassi: ${o.chassi}`,
    o.tipoApreensao,
    o.descricao,
    o.situacao && `sit: ${o.situacao}`,
    o.observacoes,
  ]);
}

function geralDesc(o: Objeto): string {
  return joinParts([
    o.tipo,
    o.descricao,
    o.numeroIdentificacao && `ID: ${o.numeroIdentificacao}`,
    o.unidade && `unid: ${o.unidade}`,
    o.tipoApreensao,
    o.situacao && `sit: ${o.situacao}`,
    o.observacoes,
  ]);
}

function qtyLabel(o?: Objeto): string {
  if (!o) return "";
  if (!hasText(o.quantidade) && !hasText(o.unidade)) return "";
  return [o.quantidade, o.unidade].filter(Boolean).join(" ");
}

export default function BUOPDFTemplate({ buo, logos }: Props) {
  const brasaoSrc = logos?.brasao ?? `${import.meta.env.BASE_URL}logos/brasao.png`;
  const pmamSrc = logos?.pmam ?? `${import.meta.env.BASE_URL}logos/pmam-ft.png`;
  const { dia, mes, ano } = splitDateParts(buo.data);

  const pessoas = buo.pessoas;
  const guarnicaoMembers = buo.guarnicao.filter(
    (g) => hasText(g.nome) || hasText(g.ci) || hasText(g.funcao),
  );

  const armasRaw = buo.objetos.filter((o) => o.categoria === "ARMAMENTO");
  const drogasRaw = buo.objetos.filter((o) => o.categoria === "ENTORPECENTE");
  const veiculosRaw = buo.objetos.filter(
    (o) => o.categoria === "VEICULO" || o.categoria === "GERAL",
  );

  const rowCount =
    buo.objetos.length === 0
      ? 0
      : Math.max(armasRaw.length, drogasRaw.length, veiculosRaw.length);

  const selectedCodes = buo.codigosOcorrencia
    .map((cod) => CODIGOS_OCORRENCIA.find((c) => c.codigo === cod))
    .filter(Boolean);

  const reciboNome = buo.recibo.nome || buo.policial.nome;
  const reciboFuncao = buo.recibo.funcao || buo.policial.funcao;
  const reciboId = buo.recibo.identificacaoFuncional || buo.policial.identificacaoFuncional;
  const hasAssinatura =
    Boolean(buo.recibo.assinaturaImagem?.startsWith("data:image")) ||
    hasText(buo.recibo.assinaturaUrl) ||
    hasText(buo.recibo.assinatura);

  const naturezas = [
    buo.tco && "TCO",
    buo.flagrante && "FLAGRANTE",
    buo.apresentacaoPessoas && "APRES. DE PESSOAS",
    buo.veiculoRecuperado && "VEÍCULO RECUPERADO",
    buo.auxilioPrestado && "AUX. PRESTADO",
    buo.outros && "OUTROS",
  ].filter(Boolean) as string[];

  const codigoOcorrencia =
    buo.codigoOcorrencia?.trim() ||
    selectedCodes
      .map((c) => (c ? `${c.codigo}` : ""))
      .filter(Boolean)
      .join(", ") ||
    buo.codigosOcorrencia.join(", ");

  const codigoOcorrenciaDetalhe =
    selectedCodes.length > 0
      ? selectedCodes
          .map((c) => (c ? `${c.codigo} — ${c.descricao}` : ""))
          .filter(Boolean)
          .join(" · ")
      : codigoOcorrencia;

  return (
    <div className="buo-pdf" id={`buo-pdf-${buo.id}`}>
      {/* ═══════════════ PÁGINA 1 ═══════════════ */}
      <div className="buo-page">
        <header className="buo-header">
          <img className="buo-logo" src={brasaoSrc} alt="" crossOrigin="anonymous" />
          <div className="buo-header__center">
            <div className="buo-header__pmam">PMAM</div>
            <div className="buo-header__cmd">COMANDO DE POLICIAMENTO METROPOLITANO</div>
            <div className="buo-header__unit">1º BPM – FORÇA TÁTICA (99.0)</div>
            <div className="buo-header__title">BOLETIM ÚNICO DE OCORRÊNCIA — BUO</div>
            {hasText(buo.numeroBuo) && (
              <div className="buo-header__numero">Nº BUO: {buo.numeroBuo}</div>
            )}
          </div>
          <div className="buo-header__right">
            <img className="buo-logo buo-logo--pmam" src={pmamSrc} alt="" crossOrigin="anonymous" />
            <div className="buo-visto">VISTO P2</div>
          </div>
        </header>

        <div className="buo-meta buo-meta--3">
          <Field label="PELOTÃO" value={buo.pelotao} />
          <Field label="EQUIPE" value={buo.equipe} />
          <Field label="VTR/MT" value={buo.vtrMt} />
        </div>

        <div className="buo-meta buo-meta--3">
          <Field label="DATA" value={formatDateBR(buo.data)} />
          <Field label="HORA" value={buo.hora} />
          <Field label="TIPO" value={buo.tipoOcorrencia} />
        </div>

        {(hasText(dia) || hasText(mes) || hasText(ano) || hasText(buo.hora)) && (
          <div className="buo-datetime">
            <DigitGroup label="DIA" value={dia} />
            <DigitGroup label="MÊS" value={mes} />
            <DigitGroup label="ANO" value={ano} />
            <DigitGroup label="HORA" value={buo.hora} />
          </div>
        )}

        <section className="buo-box">
          <div className="buo-box__title">NATUREZA / CLASSIFICAÇÃO</div>
          <div className="buo-box__body">
            {naturezas.length > 0 && (
              <>
                <div className="buo-checks">
                  <Check checked={buo.tco} label="TCO" />
                  <Check checked={buo.flagrante} label="FLAGRANTE" />
                  <Check checked={buo.apresentacaoPessoas} label="APRES. DE PESSOAS" />
                  <Check checked={buo.veiculoRecuperado} label="VEÍCULO RECUPERADO" />
                  <Check checked={buo.auxilioPrestado} label="AUX. PRESTADO" />
                  <Check checked={buo.outros} label="OUTROS" />
                </div>
                <p className="buo-naturezas-selected">Marcados: {naturezas.join(" · ")}</p>
              </>
            )}
            <div className="buo-meta buo-meta--2" style={{ marginTop: naturezas.length ? 6 : 0 }}>
              <Field label="CÓDIGO DA OCORRÊNCIA" value={codigoOcorrenciaDetalhe || codigoOcorrencia} />
              <Field label="Nº REGISTRO CIOPS" value={buo.registroCiops} />
            </div>
            <div className="buo-meta buo-meta--2" style={{ marginTop: 4 }}>
              <Field label="Nº BUO" value={buo.numeroBuo} />
            </div>
            <div className="buo-meta buo-meta--2" style={{ marginTop: 4 }}>
              <Field label="CIDADE / MUNICÍPIO" value={buo.municipio} />
              <Field label="BAIRRO" value={buo.bairro} />
            </div>
            <div className="buo-meta buo-meta--local" style={{ marginTop: 4 }}>
              <Field label="LOCAL DA OCORRÊNCIA" value={buo.localOcorrencia} wide />
              <Field label="ZONA" value={buo.zona} />
            </div>
          </div>
        </section>

        <section className="buo-box">
          <div className="buo-box__title">PESSOAS ENVOLVIDAS</div>
          <div className="buo-box__body buo-pessoas">
            {pessoas.length === 0 ? (
              <p className="buo-empty">Nenhuma pessoa cadastrada.</p>
            ) : (
              pessoas.map((p, i) => (
                <div key={p.id || i} className="buo-pessoa">
                  <div className="buo-pessoa__n">{i + 1}</div>
                  <div className="buo-pessoa__grid">
                    <Field label="NOME" value={p.nome} wide />
                    <Field label="IDADE" value={p.idade} />
                    <Field label="RG" value={p.rg} />
                    <Field label="ENDEREÇO" value={p.endereco} wide />
                    <Field label="DESTINO" value={p.destino} wide />
                    {p.situacao && (
                      <div className="buo-field buo-field--wide">
                        <span className="buo-field__label">SITUAÇÃO</span>
                        <div className="buo-checks buo-checks--inline">
                          <Check checked={p.situacao === "VITIMA"} label="VÍTIMA" />
                          <Check checked={p.situacao === "AUTOR"} label="AUTOR" />
                          <Check checked={p.situacao === "TESTEMUNHA"} label="TESTEMUNHA" />
                        </div>
                      </div>
                    )}
                    <Field label="OBSERVAÇÕES" value={p.observacoes} wide />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="buo-box">
          <div className="buo-box__title">OBJETOS / APREENSÕES</div>
          <div className="buo-box__body">
            {buo.objetos.length === 0 ? (
              <p className="buo-empty">Nenhum objeto cadastrado.</p>
            ) : (
              <table className="buo-table">
                <thead>
                  <tr>
                    {armasRaw.length > 0 && <th colSpan={2}>ARMAMENTOS</th>}
                    {drogasRaw.length > 0 && <th colSpan={2}>ENTORPECENTES</th>}
                    {veiculosRaw.length > 0 && <th colSpan={2}>VEÍCULOS/OUTROS</th>}
                  </tr>
                  <tr>
                    {armasRaw.length > 0 && (
                      <>
                        <th className="buo-qtd">QTD</th>
                        <th>DESCRIÇÃO</th>
                      </>
                    )}
                    {drogasRaw.length > 0 && (
                      <>
                        <th className="buo-qtd">QTD</th>
                        <th>DESCRIÇÃO</th>
                      </>
                    )}
                    {veiculosRaw.length > 0 && (
                      <>
                        <th className="buo-qtd">QTD</th>
                        <th>DESCRIÇÃO</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rowCount }).map((_, i) => {
                    const a = armasRaw[i];
                    const d = drogasRaw[i];
                    const v = veiculosRaw[i];
                    return (
                      <tr key={i}>
                        {armasRaw.length > 0 && (
                          <>
                            <td className="buo-qtd">{qtyLabel(a)}</td>
                            <td>{a ? armamentoDesc(a) : ""}</td>
                          </>
                        )}
                        {drogasRaw.length > 0 && (
                          <>
                            <td className="buo-qtd">{qtyLabel(d)}</td>
                            <td>{d ? entorpDesc(d) : ""}</td>
                          </>
                        )}
                        {veiculosRaw.length > 0 && (
                          <>
                            <td className="buo-qtd">{qtyLabel(v)}</td>
                            <td>
                              {v
                                ? v.categoria === "VEICULO"
                                  ? veiculoDesc(v)
                                  : geralDesc(v)
                                : ""}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="buo-box buo-box--recibo">
          <div className="buo-box__title">RECIBO — DELEGACIA DE POLÍCIA</div>
          <div className="buo-box__body">
            <div className="buo-meta buo-meta--2">
              <Field label="NOME" value={reciboNome} />
              <Field label="Nº ID. FUNCIONAL" value={reciboId} />
            </div>
            <div className="buo-meta buo-meta--3" style={{ marginTop: 4 }}>
              <Field label="FUNÇÃO" value={reciboFuncao} />
              <Field label="DATA" value={buo.recibo.data ? formatDateBR(buo.recibo.data) : ""} />
              <Field label="HORA" value={buo.recibo.hora} />
            </div>
            {hasAssinatura && (
              <div className="buo-assinatura" style={{ marginTop: 6 }}>
                <span className="buo-field__label">ASSINATURA / IDENTIFICAÇÃO (GOV.BR)</span>
                <div className="buo-assinatura__box">
                  {buo.recibo.assinaturaImagem?.startsWith("data:image") && (
                    <img
                      src={buo.recibo.assinaturaImagem}
                      alt="Assinatura"
                      className="buo-assinatura__img"
                      crossOrigin="anonymous"
                    />
                  )}
                  {hasText(buo.recibo.assinaturaUrl) && (
                    <div className="buo-assinatura__url">{buo.recibo.assinaturaUrl}</div>
                  )}
                  {hasText(buo.recibo.assinatura) && (
                    <div className="buo-assinatura__text">{buo.recibo.assinatura}</div>
                  )}
                </div>
              </div>
            )}
            <div style={{ marginTop: 4 }}>
              <Field label="OBSERVAÇÕES DO RECIBO" value={buo.recibo.observacao} wide />
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════ PÁGINA 2 ═══════════════ */}
      <div className="buo-page">
        {hasText(buo.relato) && (
          <section className="buo-box buo-relato-box">
            <div className="buo-box__title">RELATO DA OCORRÊNCIA</div>
            <div className="buo-relato">{buo.relato}</div>
          </section>
        )}

        {selectedCodes.length > 0 && (
          <section className="buo-box">
            <div className="buo-box__title">CÓDIGOS DAS OCORRÊNCIAS</div>
            <div className="buo-box__body">
              <div className="buo-codigos-selecionados">
                {selectedCodes.map(
                  (c) =>
                    c && (
                      <div key={c.codigo} className="buo-codigo-chip">
                        <strong>{c.codigo}</strong>
                        <span>{c.descricao}</span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </section>
        )}

        {guarnicaoMembers.length > 0 && (
          <section className="buo-box">
            <div className="buo-box__title">GUARNIÇÃO</div>
            <div className="buo-box__body">
              <table className="buo-table buo-table--guarnicao">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}>Nº</th>
                    <th>NOME</th>
                    <th style={{ width: 110 }}>C.I.</th>
                    <th style={{ width: 140 }}>FUNÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {guarnicaoMembers.map((g, i) => (
                    <tr key={g.id || i}>
                      <td>{i + 1}</td>
                      <td>{g.nome || ""}</td>
                      <td>{g.ci || ""}</td>
                      <td>{g.funcao || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {hasText(buo.observacoes) && (
          <section className="buo-box">
            <div className="buo-box__title">OBSERVAÇÕES GERAIS</div>
            <div className="buo-box__body">
              <p className="buo-relato" style={{ minHeight: "auto", whiteSpace: "pre-wrap" }}>
                {buo.observacoes}
              </p>
            </div>
          </section>
        )}

        <footer className="buo-footer">
          {[formatDateBR(buo.data), buo.hora].filter(Boolean).join(" ")} · PMAM — 1º BPM Força Tática
          (99.0) · Documento gerado digitalmente
        </footer>
      </div>
    </div>
  );
}
