import React, { useState } from 'react';
import { AppData, Perspective, Objective, Manager, Indicator } from '../../types';
import { Button, Input, Select, Card, Message, Badge, PasswordInput, Textarea } from '../ui/UIComponents';
import { generateId } from '../../App';

declare const XLSX: any;

interface AdminTabProps {
  data: AppData;
  updateData: (newData: Partial<AppData>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

type MainMode = 'individual' | 'batch';
type SubTab = 'perspectivas' | 'objetivos' | 'indicadores' | 'gestores' | 'controle';

export const AdminTab: React.FC<AdminTabProps> = ({ data, updateData, isAuthenticated, setIsAuthenticated, notify }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [mainMode, setMainMode] = useState<MainMode>('individual');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('gestores');
  
  // Local state for forms
  const [newManagerName, setNewManagerName] = useState('');
  const [newPerspName, setNewPerspName] = useState('');
  
  const [newObjName, setNewObjName] = useState('');
  const [newObjPerspId, setNewObjPerspId] = useState('');
  const [newObjGestorId, setNewObjGestorId] = useState('');
  
  const [newIndObjId, setNewIndObjId] = useState('');
  const [newIndName, setNewIndName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = () => {
    if (passwordInput === data.adminPassword) {
      setIsAuthenticated(true);
      setPasswordInput('');
      notify('Login efetuado com sucesso.');
    } else {
      notify('Senha incorreta.', 'error');
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      notify('Sessão administrativa encerrada.');
  }

  // --- Handlers Individual ---
  const handleAddManager = () => {
    if (!newManagerName.trim()) return;
    const newManager: Manager = { id: generateId(), nome: newManagerName };
    updateData({ managers: [...data.managers, newManager] });
    setNewManagerName('');
    notify('Gestor adicionado.');
  };

  const handleRemoveManager = (id: string) => {
    if (data.objectives.some(o => o.gestorId === id) || data.indicators.some(i => i.gestorId === id)) {
      return notify('Não é possível remover: existem vínculos.', 'error');
    }
    updateData({ managers: data.managers.filter(m => m.id !== id) });
    notify('Gestor removido.');
  };

  const handleAddPerspective = () => {
    if (!newPerspName.trim()) return;
    const newPersp: Perspective = { id: generateId(), nome: newPerspName };
    updateData({ perspectives: [...data.perspectives, newPersp] });
    setNewPerspName('');
    notify('Perspectiva adicionada.');
  };

  const handleRemovePerspective = (id: string) => {
    if (data.objectives.some(o => o.perspectivaId === id) || data.indicators.some(i => i.perspectivaId === id)) {
      return notify('Não é possível remover: existem vínculos.', 'error');
    }
    updateData({ perspectives: data.perspectives.filter(p => p.id !== id) });
    notify('Perspectiva removida.');
  };

  const handleAddObjective = () => {
    if (!newObjName.trim() || !newObjPerspId || !newObjGestorId) return notify('Preencha todos os campos.', 'error');
    const newObj: Objective = {
      id: generateId(),
      perspectivaId: newObjPerspId,
      gestorId: newObjGestorId,
      nome: newObjName
    };
    updateData({ objectives: [...data.objectives, newObj] });
    setNewObjName('');
    notify('Objetivo adicionado.');
  };

  const handleRemoveObjective = (id: string) => {
    if (data.indicators.some(i => i.objetivoId === id)) return notify('Não é possível remover: existem indicadores vinculados.', 'error');
    updateData({ objectives: data.objectives.filter(o => o.id !== id) });
    notify('Objetivo removido.');
  };

  const handleAddIndicator = () => {
    if (!newIndName.trim() || !newIndObjId) return notify('Preencha todos os campos.', 'error');
    const obj = data.objectives.find(o => o.id === newIndObjId);
    if (!obj) return;
    
    const newInd: Indicator = {
      id: generateId(),
      objetivoId: obj.id,
      perspectivaId: obj.perspectivaId,
      gestorId: obj.gestorId,
      indicador: newIndName,
      descricao: '',
      formula: '',
      unidade: '',
      fonte: '',
      periodicidade: '',
      polaridade: '',
      status: 'draft',
      updatedAt: new Date().toISOString()
    };
    updateData({ indicators: [...data.indicators, newInd] });
    setNewIndName('');
    notify('Indicador adicionado.');
  };

  const handleDeleteIndicator = (id: string) => {
    if (confirm('Tem certeza? Isso excluirá também as metas associadas.')) {
      updateData({
        indicators: data.indicators.filter(i => i.id !== id),
        metas: data.metas.filter(m => m.indicadorId !== id)
      });
      notify('Indicador excluído.');
    }
  };

  const handleUnlockIndicator = (id: string) => {
    const updated = data.indicators.map(i => i.id === id ? { ...i, status: 'draft' as const } : i);
    updateData({ indicators: updated });
    notify('Edição liberada.');
  };

  // --- Excel Import Handler ---
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        const bstr = evt.target?.result;
        if (!bstr) return;

        try {
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
            // Expecting columns: "Perspectiva", "Objetivo", "Indicador", "Gestor"
            const json: any[] = XLSX.utils.sheet_to_json(ws);

            if (!json || json.length === 0) {
                return notify('Planilha vazia ou formato inválido.', 'error');
            }

            const newPerspectives = [...data.perspectives];
            const newManagers = [...data.managers];
            const newObjectives = [...data.objectives];
            const newIndicators = [...data.indicators];

            let addedCount = 0;

            json.forEach((row) => {
                // Normalize keys (case insensitive check usually needed, but assume standard for now)
                const perspName = (row['Perspectiva'] || '').trim();
                const objName = (row['Objetivo'] || row['Objetivo Estratégico'] || '').trim();
                const indName = (row['Indicador'] || row['Indicador de desempenho'] || '').trim();
                const gestorName = (row['Gestor'] || row['Gestor Responsável'] || '').trim();

                if (!perspName || !objName || !indName || !gestorName) return;

                // 1. Perspective
                let persp = newPerspectives.find(p => p.nome.toLowerCase() === perspName.toLowerCase());
                if (!persp) {
                    persp = { id: generateId(), nome: perspName };
                    newPerspectives.push(persp);
                }

                // 2. Manager
                let manager = newManagers.find(m => m.nome.toLowerCase() === gestorName.toLowerCase());
                if (!manager) {
                    manager = { id: generateId(), nome: gestorName };
                    newManagers.push(manager);
                }

                // 3. Objective (Needs check by Name AND Perspective to allow same objective name in diff persp? Usually unique by name is safer)
                let obj = newObjectives.find(o => o.nome.toLowerCase() === objName.toLowerCase() && o.perspectivaId === persp!.id);
                if (!obj) {
                    obj = {
                        id: generateId(),
                        nome: objName,
                        perspectivaId: persp.id,
                        gestorId: manager.id
                    };
                    newObjectives.push(obj);
                }

                // 4. Indicator
                const indExists = newIndicators.some(i => i.indicador.toLowerCase() === indName.toLowerCase() && i.objetivoId === obj!.id);
                if (!indExists) {
                    newIndicators.push({
                        id: generateId(),
                        objetivoId: obj.id,
                        perspectivaId: persp.id,
                        gestorId: manager.id,
                        indicador: indName,
                        descricao: '', formula: '', unidade: '', fonte: '', periodicidade: '', polaridade: '',
                        status: 'draft',
                        updatedAt: new Date().toISOString()
                    });
                    addedCount++;
                }
            });

            updateData({
                perspectives: newPerspectives,
                managers: newManagers,
                objectives: newObjectives,
                indicators: newIndicators
            });

            notify(`${addedCount} novos indicadores importados com estrutura completa.`);
            // Reset input
            e.target.value = '';

        } catch (error) {
            console.error(error);
            notify('Erro ao processar planilha. Verifique o formato.', 'error');
        }
    };
    reader.readAsBinaryString(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 animate-in fade-in">
        <Message type="info">Área restrita para configuração estrutural do sistema.</Message>
        <Card title="Acesso Administrativo">
          <div className="flex gap-2 items-end">
            <PasswordInput 
              label="Senha do Admin" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin}>Entrar</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Administração do Sistema</h2>
        <Button variant="secondary" onClick={handleLogout} size="sm">Sair da Área Admin</Button>
      </div>
      
      {/* Top Tabs: Mode Selection */}
      <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${mainMode === 'individual' ? 'border-corporate text-corporate' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setMainMode('individual')}
          >
            Cadastramento Individual
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${mainMode === 'batch' ? 'border-corporate text-corporate' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setMainMode('batch')}
          >
            Importação em Lote (Excel)
          </button>
      </div>

      {mainMode === 'batch' && (
          <Card title="Importação de Estrutura via Excel">
              <Message type="info">
                  A planilha deve conter as colunas exatas: <strong>Perspectiva</strong>, <strong>Objetivo</strong>, <strong>Indicador</strong>, <strong>Gestor</strong>.
                  <br/>O sistema criará automaticamente as dependências que não existirem.
              </Message>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <label className="cursor-pointer">
                      <span className="bg-corporate text-white px-4 py-2 rounded shadow hover:bg-corporate-light">Selecionar Arquivo Excel (.xls, .xlsx)</span>
                      <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelUpload} />
                  </label>
                  <p className="mt-2 text-sm text-gray-500">ou arraste e solte o arquivo aqui</p>
              </div>
          </Card>
      )}

      {mainMode === 'individual' && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
            {/* Sub Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    {id: 'gestores', label: 'Gestores'},
                    {id: 'perspectivas', label: 'Perspectivas'},
                    {id: 'objetivos', label: 'Objetivos'},
                    {id: 'indicadores', label: 'Indicadores'},
                    {id: 'controle', label: 'Senha/Controle'},
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as SubTab)}
                        className={`px-4 py-2 rounded-full font-medium text-xs transition-colors border ${activeSubTab === tab.id ? 'bg-corporate text-white border-corporate' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            {/* --- GESTORES --- */}
            {activeSubTab === 'gestores' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded">
                        <Input label="Nome Completo do Gestor" value={newManagerName} onChange={e => setNewManagerName(e.target.value)} placeholder="Ex: Maria Souza" className="bg-white" />
                        <Button onClick={handleAddManager}>Adicionar</Button>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Gestores Cadastrados</h3>
                        <div className="max-h-60 overflow-y-auto border rounded">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 sticky top-0"><tr><th className="p-2">Nome</th><th className="p-2 text-right">Ação</th></tr></thead>
                                <tbody>
                                    {data.managers.map(m => (
                                        <tr key={m.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="p-2">{m.nome}</td>
                                            <td className="p-2 text-right"><Button size="sm" variant="danger" onClick={() => handleRemoveManager(m.id)}>Excluir</Button></td>
                                        </tr>
                                    ))}
                                    {data.managers.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-gray-400">Nenhum gestor cadastrado.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PERSPECTIVAS --- */}
            {activeSubTab === 'perspectivas' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded">
                        <Input label="Nome da Perspectiva" value={newPerspName} onChange={e => setNewPerspName(e.target.value)} placeholder="Ex: Financeira" className="bg-white" />
                        <Button onClick={handleAddPerspective}>Adicionar</Button>
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded">
                            <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 sticky top-0"><tr><th className="p-2">Nome</th><th className="p-2 text-right">Ação</th></tr></thead>
                            <tbody>
                                {data.perspectives.map(p => (
                                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-2">{p.nome}</td>
                                        <td className="p-2 text-right"><Button size="sm" variant="danger" onClick={() => handleRemovePerspective(p.id)}>Excluir</Button></td>
                                    </tr>
                                ))}
                                {data.perspectives.length === 0 && <tr><td colSpan={2} className="p-4 text-center text-gray-400">Nenhuma perspectiva cadastrada.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- OBJETIVOS --- */}
            {activeSubTab === 'objetivos' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Novo Objetivo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <Select 
                                label="Perspectiva" 
                                options={[{value: '', label: 'Selecione...'}, ...data.perspectives.map(p => ({value: p.id, label: p.nome}))]}
                                value={newObjPerspId}
                                onChange={e => setNewObjPerspId(e.target.value)}
                            />
                            <Select 
                                label="Gestor Responsável" 
                                options={[{value: '', label: 'Selecione...'}, ...data.managers.map(m => ({value: m.id, label: m.nome}))]}
                                value={newObjGestorId}
                                onChange={e => setNewObjGestorId(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 items-end">
                            <Input label="Descrição do Objetivo Estratégico" value={newObjName} onChange={e => setNewObjName(e.target.value)} placeholder="Ex: Aumentar Faturamento" className="bg-white" />
                            <Button onClick={handleAddObjective}>Salvar</Button>
                        </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-100 sticky top-0 font-bold">
                                <tr>
                                    <th className="p-2">Perspectiva</th>
                                    <th className="p-2">Objetivo</th>
                                    <th className="p-2">Gestor</th>
                                    <th className="p-2 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.objectives.map(o => (
                                    <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-2">{data.perspectives.find(p => p.id === o.perspectivaId)?.nome}</td>
                                        <td className="p-2 font-medium">{o.nome}</td>
                                        <td className="p-2">{data.managers.find(m => m.id === o.gestorId)?.nome}</td>
                                        <td className="p-2 text-right"><Button size="sm" variant="danger" onClick={() => handleRemoveObjective(o.id)}>X</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- INDICADORES --- */}
            {activeSubTab === 'indicadores' && (
                <div className="space-y-6 animate-in fade-in">
                    <div className="bg-gray-50 p-4 rounded">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Novo Indicador</h3>
                        <div className="flex gap-3 mb-3">
                            <div className="flex-1">
                                <Select 
                                    label="Vinculado ao Objetivo (Perspectiva / Gestor)" 
                                    options={[{value: '', label: 'Selecione...'}, ...data.objectives.map(o => {
                                        const p = data.perspectives.find(p => p.id === o.perspectivaId)?.nome;
                                        const g = data.managers.find(m => m.id === o.gestorId)?.nome;
                                        return { value: o.id, label: `${o.nome} (${p} / ${g})` };
                                    })]}
                                    value={newIndObjId}
                                    onChange={e => setNewIndObjId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 items-end">
                            <Input label="Nome do Indicador" value={newIndName} onChange={e => setNewIndName(e.target.value)} className="bg-white" />
                            <Button onClick={handleAddIndicator}>Salvar</Button>
                        </div>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto border rounded">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-2 border">Ind.</th>
                                    <th className="p-2 border">Obj.</th>
                                    <th className="p-2 border">Gestor</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.indicators.map(i => (
                                    <tr key={i.id} className="hover:bg-gray-50">
                                        <td className="p-2 border font-medium">{i.indicador}</td>
                                        <td className="p-2 border text-xs">{data.objectives.find(o => o.id === i.objetivoId)?.nome}</td>
                                        <td className="p-2 border text-xs">{data.managers.find(m => m.id === i.gestorId)?.nome}</td>
                                        <td className="p-2 border"><Badge status={i.status} /></td>
                                        <td className="p-2 border text-center flex gap-1 justify-center">
                                            <Button size="sm" variant="danger" onClick={() => handleDeleteIndicator(i.id)}>Excluir</Button>
                                            {i.status === 'final' && <Button size="sm" variant="warning" onClick={() => handleUnlockIndicator(i.id)}>Liberar</Button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- CONTROLE --- */}
            {activeSubTab === 'controle' && (
                <div className="max-w-lg animate-in fade-in">
                    <h3 className="font-bold text-gray-700 mb-4">Alteração de Senha do Admin</h3>
                    <div className="flex gap-2 items-end">
                        <PasswordInput label="Nova Senha" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                        <Button variant="secondary" onClick={() => {
                            if (!newPassword) return notify('Digite uma senha.', 'error');
                            updateData({ adminPassword: newPassword });
                            setNewPassword('');
                            notify('Senha alterada.');
                        }}>Alterar</Button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};