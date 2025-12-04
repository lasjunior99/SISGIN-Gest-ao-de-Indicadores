import React, { useState, useEffect } from 'react';
import { AppData, Meta, MetaMensal, MetaFaixas } from '../../types';
import { Button, Input, Select, Card, Message, Badge } from '../ui/UIComponents';
import { generateId } from '../../App';

interface MetasTabProps {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export const MetasTab: React.FC<MetasTabProps> = ({ data, updateData, notify }) => {
  const [selectedGestorId, setSelectedGestorId] = useState('');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState('');
  
  const [metaData, setMetaData] = useState<Partial<Meta>>({
      metas: {} as MetaMensal,
      faixas: {} as MetaFaixas
  });

  const selectedIndicator = data.indicators.find(i => i.id === selectedIndicatorId);
  const existingMeta = data.metas.find(m => m.indicadorId === selectedIndicatorId);

  useEffect(() => {
    if (selectedIndicatorId) {
        if (existingMeta) {
            setMetaData({...existingMeta});
        } else {
            setMetaData({
                indicadorId: selectedIndicatorId,
                metas: {} as MetaMensal,
                faixas: {} as MetaFaixas,
                ano: new Date().getFullYear(),
                ref1: '', ref2: '', ref3: ''
            });
        }
    } else {
        setMetaData({ metas: {} as any, faixas: {} as any });
    }
  }, [selectedIndicatorId, existingMeta]);

  const handleGestorChange = (val: string) => {
    setSelectedGestorId(val);
    setSelectedIndicatorId('');
  };

  const handleMetaChange = (field: keyof MetaMensal, val: string) => {
      setMetaData(prev => ({ ...prev, metas: { ...prev.metas, [field]: val } as MetaMensal }));
  };

  const handleFaixaChange = (field: keyof MetaFaixas, val: string) => {
      setMetaData(prev => ({ ...prev, faixas: { ...prev.faixas, [field]: val } as MetaFaixas }));
  };

  const handleSave = (targetStatus: 'draft' | 'final') => {
      if (!selectedIndicator) return;

      // Basic Validation for final
      if (targetStatus === 'final') {
          if (!metaData.ano || !metaData.tipoCalculo) {
              notify('Ano e Tipo de Cálculo são obrigatórios.', 'error');
              return;
          }
          // Validate Ranges Logic
          const f = metaData.faixas || {} as MetaFaixas;
          if (!f.azulDe || !f.azulAte || !f.verdeDe || !f.verdeAte || !f.amareloDe || !f.amareloAte || !f.vermelhoAbaixoDe) {
              notify('Preencha todas as faixas de gestão à vista.', 'error');
              return;
          }
      }

      const newMeta: Meta = {
          id: existingMeta?.id || generateId(),
          indicadorId: selectedIndicator.id,
          ano: Number(metaData.ano),
          tipoCalculo: metaData.tipoCalculo || '',
          metas: metaData.metas as MetaMensal,
          faixas: metaData.faixas as MetaFaixas,
          ref1: metaData.ref1 || '',
          ref2: metaData.ref2 || '',
          ref3: metaData.ref3 || '',
          status: targetStatus,
          updatedAt: new Date().toISOString()
      };

      const otherMetas = data.metas.filter(m => m.indicadorId !== selectedIndicator.id);
      updateData({ metas: [...otherMetas, newMeta] });
      notify(`Metas salvas como ${targetStatus === 'final' ? 'Definitivo' : 'Rascunho'}.`);
  };

  const isReadOnly = existingMeta?.status === 'final';
  const indicatorsForGestor = data.indicators.filter(i => i.gestorId === selectedGestorId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
         <Message type="info"><strong>Metas:</strong> Registre as metas anuais, mensais e faixas de acompanhamento para cada indicador.</Message>

         <Card title="Gestão de Metas">
            <Select 
                label="Gestor Responsável"
                options={[{value: '', label: 'Selecione...'}, ...data.managers.map(m => ({value: m.id, label: m.nome}))]}
                value={selectedGestorId}
                onChange={e => handleGestorChange(e.target.value)}
            />
         </Card>

         {selectedGestorId && (
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="lg:col-span-1">
                     <Card title="Indicadores">
                         <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                            {indicatorsForGestor.map(i => {
                                const hasMeta = data.metas.find(m => m.indicadorId === i.id);
                                return (
                                    <button
                                        key={i.id}
                                        onClick={() => setSelectedIndicatorId(i.id)}
                                        className={`text-left p-3 rounded border transition-colors ${selectedIndicatorId === i.id ? 'bg-corporate-light text-white border-corporate' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                    >
                                        <div className="font-bold text-sm">{i.indicador}</div>
                                        <div className="text-xs opacity-80 mt-1 flex justify-between">
                                            <span>{data.metas.find(m => m.indicadorId === i.id) ? 'Com Meta' : 'Sem Meta'}</span>
                                            {hasMeta && <Badge status={hasMeta.status} />}
                                        </div>
                                    </button>
                                );
                            })}
                         </div>
                     </Card>
                 </div>

                 <div className="lg:col-span-3">
                     <Card title="Definição de Metas e Faixas">
                         {!selectedIndicator ? (
                             <Message type="info">Selecione um indicador.</Message>
                         ) : (
                             <div className="space-y-6">
                                 {isReadOnly && <Message type="warning">Metas travadas (Definitivo). Contate o Admin para alterar.</Message>}
                                 
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <Input label="Ano" type="number" value={metaData.ano || ''} onChange={e => setMetaData({...metaData, ano: parseInt(e.target.value)})} disabled={isReadOnly} />
                                     <div className="md:col-span-2">
                                        <Select 
                                            label="Tipo de Cálculo"
                                            disabled={isReadOnly}
                                            options={[
                                                {value: '', label: 'Selecione...'},
                                                {value: 'mensal', label: 'Mensal (isolado)'},
                                                {value: 'acum_soma', label: 'Acumulado (Soma)'},
                                                {value: 'acum_media', label: 'Acumulado (Média)'},
                                            ]}
                                            value={metaData.tipoCalculo || ''}
                                            onChange={e => setMetaData({...metaData, tipoCalculo: e.target.value})}
                                        />
                                     </div>
                                 </div>

                                 <div className="bg-gray-50 p-4 rounded border">
                                     <h4 className="font-bold mb-3 text-corporate">Metas Mensais ({selectedIndicator.unidade})</h4>
                                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                         {months.map(m => (
                                             <Input 
                                                key={m} 
                                                label={m.toUpperCase()} 
                                                value={(metaData.metas as any)?.[m] || ''} 
                                                onChange={e => handleMetaChange(m as keyof MetaMensal, e.target.value)}
                                                disabled={isReadOnly}
                                             />
                                         ))}
                                     </div>
                                 </div>

                                 <div className="bg-gray-50 p-4 rounded border">
                                     <h4 className="font-bold mb-3 text-corporate">Faixas de Gestão à Vista</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                             <div className="flex gap-2">
                                                 <Input label="Azul De" value={metaData.faixas?.azulDe || ''} onChange={e => handleFaixaChange('azulDe', e.target.value)} disabled={isReadOnly} />
                                                 <Input label="Azul Até" value={metaData.faixas?.azulAte || ''} onChange={e => handleFaixaChange('azulAte', e.target.value)} disabled={isReadOnly} />
                                             </div>
                                             <div className="flex gap-2">
                                                 <Input label="Verde De" value={metaData.faixas?.verdeDe || ''} onChange={e => handleFaixaChange('verdeDe', e.target.value)} disabled={isReadOnly} />
                                                 <Input label="Verde Até" value={metaData.faixas?.verdeAte || ''} onChange={e => handleFaixaChange('verdeAte', e.target.value)} disabled={isReadOnly} />
                                             </div>
                                         </div>
                                         <div className="space-y-2">
                                            <div className="flex gap-2">
                                                 <Input label="Amarelo De" value={metaData.faixas?.amareloDe || ''} onChange={e => handleFaixaChange('amareloDe', e.target.value)} disabled={isReadOnly} />
                                                 <Input label="Amarelo Até" value={metaData.faixas?.amareloAte || ''} onChange={e => handleFaixaChange('amareloAte', e.target.value)} disabled={isReadOnly} />
                                             </div>
                                             <Input label="Vermelho Abaixo De" value={metaData.faixas?.vermelhoAbaixoDe || ''} onChange={e => handleFaixaChange('vermelhoAbaixoDe', e.target.value)} disabled={isReadOnly} />
                                         </div>
                                     </div>
                                 </div>

                                 <div className="bg-gray-50 p-4 rounded border">
                                     <h4 className="font-bold mb-3 text-corporate">Histórico (Opcional)</h4>
                                     <div className="grid grid-cols-3 gap-4">
                                         <Input label={`Ref ${metaData.ano ? metaData.ano - 1 : 'Ano-1'}`} value={metaData.ref1 || ''} onChange={e => setMetaData({...metaData, ref1: e.target.value})} disabled={isReadOnly} />
                                         <Input label={`Ref ${metaData.ano ? metaData.ano - 2 : 'Ano-2'}`} value={metaData.ref2 || ''} onChange={e => setMetaData({...metaData, ref2: e.target.value})} disabled={isReadOnly} />
                                         <Input label={`Ref ${metaData.ano ? metaData.ano - 3 : 'Ano-3'}`} value={metaData.ref3 || ''} onChange={e => setMetaData({...metaData, ref3: e.target.value})} disabled={isReadOnly} />
                                     </div>
                                 </div>

                                 <div className="flex gap-3 justify-end border-t pt-4">
                                     <Button variant="secondary" onClick={() => handleSave('draft')} disabled={isReadOnly}>Salvar Rascunho</Button>
                                     <Button variant="success" onClick={() => handleSave('final')} disabled={isReadOnly}>Salvar Definitivo</Button>
                                 </div>
                             </div>
                         )}
                     </Card>
                 </div>
             </div>
         )}
    </div>
  );
};
