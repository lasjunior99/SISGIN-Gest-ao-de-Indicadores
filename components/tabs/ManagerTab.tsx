import React, { useState, useEffect } from 'react';
import { AppData, Indicator } from '../../types';
import { Button, Input, Select, Textarea, Card, Message, Badge } from '../ui/UIComponents';

interface ManagerTabProps {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

export const ManagerTab: React.FC<ManagerTabProps> = ({ data, updateData, notify }) => {
  // Selection Mode State
  const [selectionMode, setSelectionMode] = useState<'gestor' | 'objetivo' | 'indicador'>('gestor');
  
  // Selections
  const [selectedGestorId, setSelectedGestorId] = useState('');
  const [selectedObjectiveId, setSelectedObjectiveId] = useState('');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Indicator>>({});
  
  const selectedIndicator = data.indicators.find(i => i.id === selectedIndicatorId);

  useEffect(() => {
    if (selectedIndicator) {
      setFormData({
        descricao: selectedIndicator.descricao,
        formula: selectedIndicator.formula,
        unidade: selectedIndicator.unidade,
        fonte: selectedIndicator.fonte,
        periodicidade: selectedIndicator.periodicidade,
        polaridade: selectedIndicator.polaridade
      });
    } else {
        setFormData({});
    }
  }, [selectedIndicatorId, data.indicators]);

  // Filtering Logic
  let filteredIndicators: Indicator[] = [];
  if (selectionMode === 'gestor' && selectedGestorId) {
      filteredIndicators = data.indicators.filter(i => i.gestorId === selectedGestorId);
  } else if (selectionMode === 'objetivo' && selectedObjectiveId) {
      filteredIndicators = data.indicators.filter(i => i.objetivoId === selectedObjectiveId);
  } else if (selectionMode === 'indicador') {
      filteredIndicators = data.indicators; // Show all in dropdown to select
  }

  const handleSave = (targetStatus: 'draft' | 'final') => {
    if (!selectedIndicator) return;
    if (targetStatus === 'final') {
        if (!formData.descricao || !formData.formula || !formData.unidade || !formData.fonte || !formData.periodicidade || !formData.polaridade) {
            notify('Para salvar definitivo, preencha todos os campos.', 'error');
            return;
        }
    }

    const updatedIndicator: Indicator = {
        ...selectedIndicator,
        ...formData as any,
        status: targetStatus,
        updatedAt: new Date().toISOString()
    };

    const newIndicators = data.indicators.map(i => i.id === selectedIndicator.id ? updatedIndicator : i);
    
    // Batch save logic for 'final'
    if (targetStatus === 'final') {
        let count = 0;
        const batchIndicators = newIndicators.map(i => {
             if (i.gestorId === selectedIndicator.gestorId && i.status === 'draft') {
                 const current = i.id === selectedIndicator.id ? updatedIndicator : i;
                 if (current.descricao && current.formula && current.unidade && current.fonte && current.periodicidade && current.polaridade) {
                     count++;
                     return { ...current, status: 'final' as const };
                 }
             }
             return i;
        });
        updateData({ indicators: batchIndicators });
        notify(`${count} indicador(es) finalizado(s) com sucesso.`);
    } else {
        updateData({ indicators: newIndicators });
        notify('Rascunho salvo.');
    }
  };

  const isReadOnly = selectedIndicator?.status === 'final';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Message type="info">
        <strong>Fichas de Indicadores:</strong> Selecione a forma de busca e escolha o indicador para preencher seus detalhes técnicos.
      </Message>
      
      <Card title="Seleção">
          <div className="flex gap-4 mb-4 border-b pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" checked={selectionMode === 'gestor'} onChange={() => { setSelectionMode('gestor'); setSelectedObjectiveId(''); setSelectedIndicatorId(''); }} />
                  Por Gestor
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" checked={selectionMode === 'objetivo'} onChange={() => { setSelectionMode('objetivo'); setSelectedGestorId(''); setSelectedIndicatorId(''); }} />
                  Por Objetivo
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" checked={selectionMode === 'indicador'} onChange={() => { setSelectionMode('indicador'); setSelectedGestorId(''); setSelectedObjectiveId(''); }} />
                  Por Indicador
              </label>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
              {selectionMode === 'gestor' && (
                   <div className="flex-1">
                       <Select 
                            label="Selecione o Gestor"
                            options={[{value: '', label: 'Selecione...'}, ...data.managers.map(m => ({value: m.id, label: m.nome}))]}
                            value={selectedGestorId}
                            onChange={e => { setSelectedGestorId(e.target.value); setSelectedIndicatorId(''); }}
                        />
                   </div>
              )}
              {selectionMode === 'objetivo' && (
                   <div className="flex-1">
                       <Select 
                            label="Selecione o Objetivo"
                            options={[{value: '', label: 'Selecione...'}, ...data.objectives.map(o => ({value: o.id, label: o.nome}))]}
                            value={selectedObjectiveId}
                            onChange={e => { setSelectedObjectiveId(e.target.value); setSelectedIndicatorId(''); }}
                        />
                   </div>
              )}
              {selectionMode === 'indicador' && (
                  <div className="flex-1">
                      <Select 
                            label="Selecione o Indicador"
                            options={[{value: '', label: 'Selecione...'}, ...data.indicators.map(i => ({value: i.id, label: i.indicador}))]}
                            value={selectedIndicatorId}
                            onChange={e => setSelectedIndicatorId(e.target.value)}
                        />
                  </div>
              )}

              {/* Secondary list for Gestor/Objective modes */}
              {(selectionMode !== 'indicador') && (
                  <div className="flex-1">
                       <Select 
                            label="Selecione o Indicador"
                            disabled={!selectedGestorId && !selectedObjectiveId}
                            options={[{value: '', label: 'Selecione...'}, ...filteredIndicators.map(i => ({value: i.id, label: i.indicador}))]}
                            value={selectedIndicatorId}
                            onChange={e => setSelectedIndicatorId(e.target.value)}
                        />
                  </div>
              )}
          </div>
      </Card>

      {selectedIndicator && (
          <Card title={`Detalhe do Indicador: ${selectedIndicator.indicador}`}>
             <div className="space-y-4">
                {isReadOnly && <Message type="warning">Este indicador está finalizado (Modo Leitura). Contate o Admin para editar.</Message>}
                
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Perspectiva" disabled value={data.perspectives.find(p => p.id === selectedIndicator.perspectivaId)?.nome || ''} />
                    <Input label="Objetivo" disabled value={data.objectives.find(o => o.id === selectedIndicator.objetivoId)?.nome || ''} />
                </div>
                
                <Textarea 
                    label="Descrição Operacional" 
                    placeholder="Descreva o que o indicador mede..." 
                    disabled={isReadOnly}
                    value={formData.descricao || ''}
                    onChange={e => setFormData({...formData, descricao: e.target.value})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Textarea 
                        label="Fórmula" 
                        placeholder="Ex: (A / B) * 100" 
                        disabled={isReadOnly}
                        value={formData.formula || ''}
                        onChange={e => setFormData({...formData, formula: e.target.value})}
                    />
                    <Select 
                        label="Unidade de Medida"
                        disabled={isReadOnly}
                        options={[
                            {value: '', label: 'Selecione...'},
                            {value: 'Número', label: 'Número'},
                            {value: 'R$', label: 'R$'},
                            {value: '%', label: '%'},
                            {value: 'ton', label: 'ton'},
                            {value: 'kg', label: 'kg'},
                            {value: 'Dias', label: 'Dias'},
                            {value: 'Score', label: 'Score'},
                            {value: 'Outro', label: 'Outro'},
                        ]}
                        value={formData.unidade || ''}
                        onChange={e => setFormData({...formData, unidade: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input 
                        label="Fonte de Dados" 
                        disabled={isReadOnly}
                        value={formData.fonte || ''}
                        onChange={e => setFormData({...formData, fonte: e.target.value})}
                    />
                    <Select 
                        label="Periodicidade"
                        disabled={isReadOnly}
                        options={[
                            {value: '', label: 'Selecione...'},
                            {value: 'Mensal', label: 'Mensal'},
                            {value: 'Bimestral', label: 'Bimestral'},
                            {value: 'Trimestral', label: 'Trimestral'},
                            {value: 'Semestral', label: 'Semestral'},
                            {value: 'Anual', label: 'Anual'},
                        ]}
                        value={formData.periodicidade || ''}
                        onChange={e => setFormData({...formData, periodicidade: e.target.value})}
                    />
                        <Select 
                        label="Polaridade"
                        disabled={isReadOnly}
                        options={[
                            {value: '', label: 'Selecione...'},
                            {value: 'Maior melhor', label: 'Quanto maior, melhor'},
                            {value: 'Menor melhor', label: 'Quanto menor, melhor'},
                            {value: 'Estável', label: 'Estável'},
                        ]}
                        value={formData.polaridade || ''}
                        onChange={e => setFormData({...formData, polaridade: e.target.value})}
                    />
                </div>
                
                <div className="pt-4 flex gap-3 border-t">
                    <Button variant="secondary" onClick={() => handleSave('draft')} disabled={isReadOnly}>Salvar Rascunho</Button>
                    <Button variant="success" onClick={() => handleSave('final')} disabled={isReadOnly}>Salvar Definitivo</Button>
                </div>
            </div>
          </Card>
      )}

      {/* QUADRO DE INDICADORES SALVOS */}
      {(filteredIndicators.length > 0 && selectionMode !== 'indicador') && (
          <div className="mt-8">
              <h3 className="font-bold text-gray-700 mb-2">Quadro de Indicadores da Seleção</h3>
              <div className="overflow-x-auto bg-white rounded shadow border">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100">
                          <tr>
                              <th className="p-3">Indicador</th>
                              <th className="p-3">Objetivo</th>
                              <th className="p-3">Status</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredIndicators.map(i => (
                              <tr key={i.id} className="border-b hover:bg-gray-50">
                                  <td className="p-3 font-medium">{i.indicador}</td>
                                  <td className="p-3 text-gray-600">{data.objectives.find(o => o.id === i.objetivoId)?.nome}</td>
                                  <td className="p-3"><Badge status={i.status} /></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

    </div>
  );
};
