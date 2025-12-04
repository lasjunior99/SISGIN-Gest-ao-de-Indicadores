import React from 'react';
import { Card } from '../ui/UIComponents';

export const GuidelinesTab: React.FC = () => (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto text-gray-800">
        <Card title="Ajuda do Sistema de Fichas de Indicadores de Desempenho">
            <p className="mb-4">Este sistema foi desenvolvido para apoiar o cadastro estruturado dos indicadores de desempenho, o relacionamento com objetivos estratégicos, o registro de metas anuais e a geração de relatórios para acompanhamento da execução da estratégia.</p>
            
            <h4 className="font-bold text-lg text-corporate mt-6 mb-2">Visão geral das abas</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>FICHAS DE INDICADORES</strong> - Para e edição dos detalhes técnicos dos indicadores sob responsabilidade de cada gestor.</li>
                <li><strong>METAS</strong> - Cadastro de metas anuais por indicador, definição de faixas de gestão à vista e valores de referência.</li>
                <li><strong>RESULTADOS</strong> - Relatórios consolidados dos indicadores cadastrados, com opções de filtro e exportação.</li>
                <li><strong>ORIENTAÇÕES</strong> - Conceitos e instruções sobre cada campo da ficha de indicadores.</li>
                <li><strong>ADMIN</strong> - Administração geral do sistema (gestores, perspectivas, objetivos, indicadores e controle de edição).</li>
            </ul>

            <h4 className="font-bold text-lg text-corporate mt-6 mb-2">1. Aba “FICHAS DE INDICADORES”</h4>
            <p className="mb-2">Nesta aba, cada gestor seleciona seu nome na lista e visualiza os indicadores sob sua responsabilidade.</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>Selecione o seu nome no campo “Nome do Gestor Responsável” ou Objetivo Estratégico”.</li>
                <li>Na tabela de indicadores, clique no indicador desejado.</li>
                <li>Preencha os campos: Descrição operacional, Fórmula, Unidade de medida, Fonte de dados, Periodicidade, Polaridade.</li>
                <li>Use “Salvar rascunho” para salvamento parcial (edição livre pelo gestor).</li>
                <li>Use “Salvar definitivo” para travar todos os indicadores completos em rascunho do gestor (somente o ADMIN poderá liberar para nova edição).</li>
            </ol>

             <h4 className="font-bold text-lg text-corporate mt-6 mb-2">2. Aba “ADMIN”</h4>
            <p className="mb-2">Somente pessoas com a senha do ADMIN podem cadastrar e manter a estrutura do sistema.</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>Informe a senha no campo “Senha do ADMIN” e clique em “Entrar”.</li>
                <li>Cadastre: Gestores responsáveis, Perspectivas, Objetivos estratégicos, Indicadores.</li>
                <li>Na tabela de indicadores, o ADMIN pode: Editar o nome, Excluir, Liberar edição.</li>
                <li>Ao concluir a configuração inicial, usar o botão “Sair” para encerrar a sessão.</li>
            </ol>

            <h4 className="font-bold text-lg text-corporate mt-6 mb-2">3. Aba “METAS” – Cadastro de Metas</h4>
            <p className="mb-2">Nesta aba, os gestores registram as metas do indicador para um ano de monitoramento.</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li>Selecione o seu nome em “Nome do Gestor Responsável”.</li>
                <li>Localize o indicador desejado na tabela e selecione.</li>
                <li>Preencha: Ano de monitoramento, Metas mensais, Tipo de cálculo.</li>
                <li>Faixas de gestão à vista (% de atingimento da meta): As faixas devem ser crescente e sem sobreposição.</li>
                <li>Valores de referência (últimos 3 anos).</li>
                <li>Use “Salvar rascunho” ou “SALVAR DEFINITIVO” (bloqueia edição).</li>
            </ol>

            <h4 className="font-bold text-lg text-corporate mt-6 mb-2">4. Aba “RESULTADOS”</h4>
            <p className="mb-2">Apresenta um relatório consolidado com todos os indicadores e metas cadastrados.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Filtros por Perspectiva e Objetivo Estratégico.</li>
                <li>Botão “Imprimir / Exportar PDF” – utilize a opção “Salvar como PDF” do navegador.</li>
                <li>Botão “Exportar Excel” – gera arquivo CSV compatível com Excel.</li>
            </ul>

            <h4 className="font-bold text-lg text-corporate mt-6 mb-2">5. Aba “ORIENTAÇÕES” (Conceitos)</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Perspectiva:</strong> Derivada do modelo BSC.</li>
                <li><strong>Objetivo Estratégico:</strong> Intenção de resultado de médio/longo prazo.</li>
                <li><strong>Indicador:</strong> Nome da métrica (Ex: Taxa de Conversão %).</li>
                <li><strong>Descrição Operacional:</strong> Detalhe técnico de o que é medido.</li>
                <li><strong>Fórmula:</strong> Cálculo matemático.</li>
                <li><strong>Periodicidade:</strong> Frequência de apuração.</li>
                <li><strong>Polaridade:</strong> Interpretação (Maior melhor, Menor melhor, ou Estável).</li>
            </ul>
        </Card>
    </div>
);
