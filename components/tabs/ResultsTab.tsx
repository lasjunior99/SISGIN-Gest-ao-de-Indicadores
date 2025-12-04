import React, { useState } from 'react';
import { AppData } from '../../types';
import { Select, Button, Card, Badge, Checkbox, Message } from '../ui/UIComponents';

interface ResultsTabProps {
  data: AppData;
  notify: (msg: string) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({ data, notify }) => {
  const [filterPersp, setFilterPersp] = useState('');
  const [filterObj, setFilterObj] = useState('');
  const [viewMode, setViewMode] = useState<'indicators' | 'metas'>('indicators');

  // Column Visibility State
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
      perspectiva: true, objetivo: true, indicador: true, descricao: true,
      formula: true, unidade: true, fonte: true, periodicidade: true,
      polaridade: true, gestor: true, status: true
  });

  const toggleCol = (key: string) => setVisibleCols(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredIndicators = data.indicators.filter(i => {
    if (filterPersp && i.perspectivaId !== filterPersp) return false;
    if (filterObj && i.objetivoId !== filterObj) return false;
    return true;
  });

  const exportCSV = () => {
    const header = Object.keys(visibleCols).filter(k => visibleCols[k]);
    
    let rows: string[] = [];

    if (viewMode === 'indicators') {
        rows = filteredIndicators.map(i => {
            const p = data.perspectives.find(p => p.id === i.perspectivaId)?.nome || '';
            const o = data.objectives.find(o => o.id === i.objetivoId)?.nome || '';
            const g = data.managers.find(m => m.id === i.gestorId)?.nome || '';
            
            const map: any = {
                perspectiva: p, objetivo: o, indicador: i.indicador, descricao: i.descricao,
                formula: i.formula, unidade: i.unidade, fonte: i.fonte,
                periodicidade: i.periodicidade, polaridade: i.polaridade,
                gestor: g, status: i.status
            };
            
            return header.map(h => `"${(map[h] || '').toString().replace(/"/g, '""')}"`).join(';');
        });
    } else {
        // Metas Report
        const filteredMetas = data.metas.filter(m => filteredIndicators.some(i => i.id === m.indicadorId));
        const metaHeader = ['Perspectiva', 'Objetivo', 'Indicador', 'Ano', 'Metas (Jan-Dez)', 'Status'];
        rows = filteredMetas.map(m => {
            const i = data.indicators.find(ind => ind.id === m.indicadorId);
            const p = data.perspectives.find(p => p.id === i?.perspectivaId)?.nome || '';
            const o = data.objectives.find(o => o.id === i?.objetivoId)?.nome || '';
            const vals = Object.values(m.metas).join('|');
            return `"${p}";"${o}";"${i?.indicador}";"${m.ano}";"${vals}";"${m.status}"`;
        });
        if (rows.length > 0) rows.unshift(metaHeader.join(';')); // Override header for Metas
    }

    const csvContent = '\uFEFF' + (viewMode === 'indicators' ? [header.join(';'), ...rows].join('\r\n') : rows.join('\r\n'));
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${viewMode}_sisgin.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify('Download iniciado.');
  };

  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Message type="info"><strong>Resultados:</strong> Utilize os filtros e selecione as colunas para personalizar sua visualização.</Message>

      <div className="flex gap-4 mb-4 border-b pb-2">
          <Button variant={viewMode === 'indicators' ? 'primary' : 'secondary'} onClick={() => setViewMode('indicators')}>Fichas de Indicadores</Button>
          <Button variant={viewMode === 'metas' ? 'primary' : 'secondary'} onClick={() => setViewMode('metas')}>Relatório de Metas</Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <div className="flex-1 w-full">
                <Select 
                    label="Filtrar por Perspectiva"
                    options={[{value: '', label: 'Todas'}, ...data.perspectives.map(p => ({value: p.id, label: p.nome}))]}
                    value={filterPersp}
                    onChange={e => setFilterPersp(e.target.value)}
                />
            </div>
            <div className="flex-1 w-full">
                <Select 
                    label="Filtrar por Objetivo"
                    options={[{value: '', label: 'Todos'}, ...data.objectives.map(o => ({value: o.id, label: o.nome}))]}
                    value={filterObj}
                    onChange={e => setFilterObj(e.target.value)}
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={handlePrint} variant="secondary">Imprimir / PDF</Button>
                <Button onClick={exportCSV}>Exportar Excel</Button>
            </div>
        </div>

        {viewMode === 'indicators' && (
            <div className="mb-4 bg-gray-50 p-3 rounded border">
                <p className="text-xs font-bold mb-2 uppercase text-gray-500">Colunas Visíveis</p>
                <div className="flex flex-wrap gap-3">
                    {Object.keys(visibleCols).map(key => (
                        <Checkbox key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} checked={visibleCols[key]} onChange={() => toggleCol(key)} />
                    ))}
                </div>
            </div>
        )}

        <div className="overflow-x-auto print:block">
            {viewMode === 'indicators' ? (
                <table className="w-full text-xs text-left border collapse print:text-[10px]">
                    <thead className="bg-corporate text-white">
                        <tr>
                            {visibleCols.perspectiva && <th className="p-2 border">Perspectiva</th>}
                            {visibleCols.objetivo && <th className="p-2 border">Objetivo</th>}
                            {visibleCols.indicador && <th className="p-2 border">Indicador</th>}
                            {visibleCols.descricao && <th className="p-2 border">Desc.</th>}
                            {visibleCols.formula && <th className="p-2 border">Fórmula</th>}
                            {visibleCols.unidade && <th className="p-2 border">Unid.</th>}
                            {visibleCols.fonte && <th className="p-2 border">Fonte</th>}
                            {visibleCols.periodicidade && <th className="p-2 border">Freq.</th>}
                            {visibleCols.polaridade && <th className="p-2 border">Pol.</th>}
                            {visibleCols.gestor && <th className="p-2 border">Gestor</th>}
                            {visibleCols.status && <th className="p-2 border">Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIndicators.map((i, idx) => (
                            <tr key={i.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {visibleCols.perspectiva && <td className="p-2 border">{data.perspectives.find(p => p.id === i.perspectivaId)?.nome}</td>}
                                {visibleCols.objetivo && <td className="p-2 border">{data.objectives.find(o => o.id === i.objetivoId)?.nome}</td>}
                                {visibleCols.indicador && <td className="p-2 border font-bold">{i.indicador}</td>}
                                {visibleCols.descricao && <td className="p-2 border truncate max-w-[150px]" title={i.descricao}>{i.descricao}</td>}
                                {visibleCols.formula && <td className="p-2 border truncate max-w-[100px]" title={i.formula}>{i.formula}</td>}
                                {visibleCols.unidade && <td className="p-2 border">{i.unidade}</td>}
                                {visibleCols.fonte && <td className="p-2 border">{i.fonte}</td>}
                                {visibleCols.periodicidade && <td className="p-2 border">{i.periodicidade}</td>}
                                {visibleCols.polaridade && <td className="p-2 border">{i.polaridade}</td>}
                                {visibleCols.gestor && <td className="p-2 border">{data.managers.find(m => m.id === i.gestorId)?.nome}</td>}
                                {visibleCols.status && <td className="p-2 border"><Badge status={i.status} /></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="w-full text-xs text-left border collapse print:text-[10px]">
                     <thead className="bg-corporate text-white">
                        <tr>
                            <th className="p-2 border">Indicador</th>
                            <th className="p-2 border">Ano</th>
                            <th className="p-2 border">Jan</th>
                            <th className="p-2 border">Fev</th>
                            <th className="p-2 border">Mar</th>
                            <th className="p-2 border">Abr</th>
                            <th className="p-2 border">Mai</th>
                            <th className="p-2 border">Jun</th>
                            <th className="p-2 border">Jul</th>
                            <th className="p-2 border">Ago</th>
                            <th className="p-2 border">Set</th>
                            <th className="p-2 border">Out</th>
                            <th className="p-2 border">Nov</th>
                            <th className="p-2 border">Dez</th>
                            <th className="p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                         {filteredIndicators.map(i => {
                             const m = data.metas.find(meta => meta.indicadorId === i.id);
                             if (!m) return null;
                             return (
                                <tr key={m.id} className="border-b">
                                     <td className="p-2 border font-bold">{i.indicador}</td>
                                     <td className="p-2 border">{m.ano}</td>
                                     <td className="p-2 border">{m.metas.jan}</td>
                                     <td className="p-2 border">{m.metas.fev}</td>
                                     <td className="p-2 border">{m.metas.mar}</td>
                                     <td className="p-2 border">{m.metas.abr}</td>
                                     <td className="p-2 border">{m.metas.mai}</td>
                                     <td className="p-2 border">{m.metas.jun}</td>
                                     <td className="p-2 border">{m.metas.jul}</td>
                                     <td className="p-2 border">{m.metas.ago}</td>
                                     <td className="p-2 border">{m.metas.set}</td>
                                     <td className="p-2 border">{m.metas.out}</td>
                                     <td className="p-2 border">{m.metas.nov}</td>
                                     <td className="p-2 border">{m.metas.dez}</td>
                                     <td className="p-2 border"><Badge status={m.status} /></td>
                                </tr>
                             )
                         })}
                    </tbody>
                </table>
            )}
        </div>
      </Card>
    </div>
  );
};
