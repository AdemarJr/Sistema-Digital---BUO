import { BUO, Objeto, IntegranteGuarnicao } from "../types/buo";
import { CODIGOS_OCORRENCIA } from "../data/codes";
import { splitDateParts, formatDateBR } from "../utils/date";

interface Props {
  buo: BUO;
  logos?: { brasao: string; pmam: string };
}

function Check({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className={`buo-check${checked ? " is-on" : ""}`}>
      <span className="buo-check__box">{checked ? "✓" : ""}</span>
      <span className="buo-check__label">{label}</span>
    </span>
  );
}

function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  return (
    <div className={`buo-field${wide ? " buo-field--wide" : ""}`}>
      <span className="buo-field__label">{label}</span>
      <span className="buo-field__value">{value?.trim() ? value : "—"}</span>
    </div>
  );
}

function DigitGroup({ label, value }: { label: string; value: string }) {
  return (
    <div className="buo-digit-group">
      <span className="buo-digit-group__label">{label}</span>
      <span className="buo-digit-group__value">{value || "—"}</span>
    </div>
  );
}

function padArray<T>(arr: T[], size: number, factory: () => T): T[] {
  const out = [...arr];
  while (out.length < size) out.push(factory());
  return out.slice(0, size);
}

function armamentoDesc(o: Objeto): string {
  return [o.tipo, o.calibre, o.municoes && `mun: ${o.municoes}`, o.marca, o.modelo]
    .filter(Boolean)
    .join(" / ");
}

function entorpDesc(o: Objeto): string {
  return [o.tipo, o.substancia, o.tipoApreensao, o.descricao].filter(Boolean).join(" / ");
}

function veiculoDesc(o: Objeto): string {
  return [o.tipo, o.marca, o.modelo, o.placa, o.cor, o.descricao].filter(Boolean).join(" / ");
}

function emptyIntegrante(): IntegranteGuarnicao {
  return { id: `empty-${Math.random()}`, nome: "", ci: "", funcao: "" };
}

export default function BUOPDFTemplate({ buo, logos }: Props) {
  const brasaoSrc = logos?.brasao ?? `${import.meta.env.BASE_URL}logos/brasao.png`;
  const pmamSrc = logos?.pmam ?? `${import.meta.env.BASE_URL}logos/pmam-ft.png`;
  const { dia, mes, ano } = splitDateParts(buo.data);

  const pessoas = buo.pessoas;
  const guarnicao = padArray(
    buo.guarnicao.map((g) => ({ ...g, ci: g.ci ?? "" })),
    Math.max(buo.guarnicao.length, 4),
    emptyIntegrante,
  ).slice(0, 8);

  const armasRaw = buo.objetos.filter((o) => o.categoria === "ARMAMENTO");
  const drogasRaw = buo.objetos.filter((o) => o.categoria === "ENTORPECENTE");
  const veiculosRaw = buo.objetos.filter(
    (o) => o.categoria === "VEICULO" || o.categoria === "GERAL",
  );

  const rowCount = Math.max(armasRaw.length, drogasRaw.length, veiculosRaw.length, 3);

  const selectedCodes = buo.codigosOcorrencia
    .map((cod) => CODIGOS_OCORRENCIA.find((c) => c.codigo === cod))
    .filter(Boolean);

  const reciboNome = buo.recibo.nome || buo.policial.nome;
  const reciboFuncao = buo.recibo.funcao || buo.policial.funcao;
  const reciboId = buo.policial.identificacaoFuncional;
  const reciboObs = buo.recibo.observacao || buo.observacoes || buo.policial.observacoes;

  const naturezas = [
    buo.tco && "TCO",
    buo.flagrante && "FLAGRANTE",
    buo.apresentacaoPessoas && "APRES. DE PESSOAS",
    buo.veiculoRecuperado && "VEÍCULO RECUPERADO",
    buo.auxilioPrestado && "AUX. PRESTADO",
    buo.outros && "OUTROS",
  ].filter(Boolean) as string[];

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

        <div className="buo-meta buo-meta--4">
          <Field label="DATA" value={formatDateBR(buo.data)} />
          <Field label="HORA" value={buo.hora} />
          <Field label="TIPO" value={buo.tipoOcorrencia} />
          <Field label="SITUAÇÃO" value={buo.situacao} />
        </div>

        <div className="buo-datetime">
          <DigitGroup label="DIA" value={dia} />
          <DigitGroup label="MÊS" value={mes} />
          <DigitGroup label="ANO" value={ano} />
          <DigitGroup label="HORA" value={buo.hora} />
        </div>

        <section className="buo-box">
          <div className="buo-box__title">NATUREZA / CLASSIFICAÇÃO</div>
          <div className="buo-box__body">
            <div className="buo-checks">
              <Check checked={buo.tco} label="TCO" />
              <Check checked={buo.flagrante} label="FLAGRANTE" />
              <Check checked={buo.apresentacaoPessoas} label="APRES. DE PESSOAS" />
              <Check checked={buo.veiculoRecuperado} label="VEÍCULO RECUPERADO" />
              <Check checked={buo.auxilioPrestado} label="AUX. PRESTADO" />
              <Check checked={buo.outros} label="OUTROS" />
            </div>
            {naturezas.length > 0 && (
              <p className="buo-naturezas-selected">Marcados: {naturezas.join(" · ")}</p>
            )}
            <div className="buo-meta buo-meta--2" style={{ marginTop: 6 }}>
              <Field
                label="CÓDIGO DA OCORRÊNCIA"
                value={buo.codigoOcorrencia || buo.codigosOcorrencia.join(", ")}
              />
              <Field label="Nº REGISTRO CIOPS" value={buo.registroCiops} />
            </div>
            <div className="buo-meta buo-meta--local" style={{ marginTop: 4 }}>
              <Field label="LOCAL DA OCORRÊNCIA" value={buo.localOcorrencia} wide />
              <Field label="ÁREA DE ATUAÇÃO" value={buo.zona} />
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
                    <div className="buo-field buo-field--wide">
                      <span className="buo-field__label">SITUAÇÃO</span>
                      <div className="buo-checks buo-checks--inline">
                        <Check checked={p.situacao === "VITIMA"} label="VÍTIMA" />
                        <Check checked={p.situacao === "AUTOR"} label="AUTOR" />
                        <Check checked={p.situacao === "TESTEMUNHA"} label="TESTEMUNHA" />
                      </div>
                    </div>
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
                    <th colSpan={2}>ARMAMENTOS</th>
                    <th colSpan={2}>ENTORPECENTES</th>
                    <th colSpan={2}>VEÍCULOS/OUTROS</th>
                  </tr>
                  <tr>
                    <th className="buo-qtd">QTD</th>
                    <th>TIPO / CALIBRE / MUNIÇÕES</th>
                    <th className="buo-qtd">QTD</th>
                    <th>TIPO</th>
                    <th className="buo-qtd">QTD</th>
                    <th>TIPO</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: rowCount }).map((_, i) => {
                    const a = armasRaw[i];
                    const d = drogasRaw[i];
                    const v = veiculosRaw[i];
                    return (
                      <tr key={i}>
                        <td className="buo-qtd">{a?.quantidade ?? ""}</td>
                        <td>{a ? armamentoDesc(a) : ""}</td>
                        <td className="buo-qtd">
                          {d ? `${d.quantidade}${d.unidade ? ` ${d.unidade}` : ""}` : ""}
                        </td>
                        <td>{d ? entorpDesc(d) : ""}</td>
                        <td className="buo-qtd">{v?.quantidade ?? ""}</td>
                        <td>
                          {v
                            ? v.categoria === "VEICULO"
                              ? veiculoDesc(v)
                              : [v.tipo, v.descricao].filter(Boolean).join(" — ")
                            : ""}
                        </td>
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
            <div className="buo-meta buo-meta--2" style={{ marginTop: 4 }}>
              <Field label="FUNÇÃO" value={reciboFuncao} />
              <Field label="ASSINATURA" value={buo.recibo.assinatura} />
            </div>
            <div style={{ marginTop: 4 }}>
              <Field label="OBSERVAÇÕES" value={reciboObs} wide />
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════ PÁGINA 2 ═══════════════ */}
      <div className="buo-page">
        <section className="buo-box buo-relato-box">
          <div className="buo-box__title">RELATO DA OCORRÊNCIA</div>
          <div className="buo-relato">
            {buo.relato?.trim() ? (
              buo.relato
            ) : (
              <span className="buo-empty">Relato não preenchido.</span>
            )}
          </div>
        </section>

        <section className="buo-box">
          <div className="buo-box__title">CÓDIGOS DAS OCORRÊNCIAS</div>
          <div className="buo-box__body">
            {selectedCodes.length === 0 ? (
              <p className="buo-empty">Nenhum código selecionado.</p>
            ) : (
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
            )}
          </div>
        </section>

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
                {guarnicao.map((g, i) => (
                  <tr key={g.id || i}>
                    <td>{i + 1}</td>
                    <td>{g.nome || "—"}</td>
                    <td>{g.ci || "—"}</td>
                    <td>{g.funcao || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {buo.guarnicao.length === 0 && (
              <p className="buo-empty" style={{ marginTop: 6 }}>
                Guarnição não preenchida.
              </p>
            )}
          </div>
        </section>

        <footer className="buo-footer">
          {formatDateBR(buo.data)} {buo.hora} · PMAM — 1º BPM Força Tática (99.0) · Documento gerado
          digitalmente
        </footer>
      </div>
    </div>
  );
}
