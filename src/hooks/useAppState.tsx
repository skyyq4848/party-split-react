import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from '../core/state.js';

interface AppStateContextType {
  state: ReturnType<typeof AppState.prototype.getState>;
  appState: AppState;
  addPerson: (name: string) => boolean;
  deletePerson: (idx: number) => boolean;
  addPeople: (names: string[]) => number;
  addGroup: (name: string, members: string[]) => boolean;
  deleteGroup: (idx: number) => boolean;
  updateGroup: (idx: number, updates: any) => boolean;
  addPartyItem: (item: any) => void;
  deletePartyItem: (idx: number) => boolean;
  updatePartyItem: (idx: number, updates: any) => boolean;
  addPersonalItem: (item: any) => void;
  deletePersonalItem: (idx: number) => boolean;
  updatePersonalItem: (idx: number, updates: any) => boolean;
  addAdvanceItem: (item: any) => void;
  deleteAdvanceItem: (idx: number) => boolean;
  updateAdvanceItem: (idx: number, updates: any) => boolean;
  setPrimaryPayer: (payer: string) => void;
  setConsolidateAdvance: (value: boolean) => void;
  setParseMode: (mode: 'auto' | 'manual') => boolean;
  replaceAllItems: (party: any[], personal: any[], advance: any[]) => void;
  reset: () => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [appState] = useState(() => new AppState());
  const [state, setState] = useState(appState.getState());

  useEffect(() => {
    const unsubscribe = appState.subscribe((newState) => {
      setState({ ...newState });
    });

    return unsubscribe;
  }, [appState]);

  const value: AppStateContextType = {
    state,
    appState,
    addPerson: (name: string) => appState.addPerson(name),
    deletePerson: (idx: number) => appState.deletePerson(idx),
    addPeople: (names: string[]) => appState.addPeople(names),
    addGroup: (name: string, members: string[]) => appState.addGroup(name, members),
    deleteGroup: (idx: number) => appState.deleteGroup(idx),
    updateGroup: (idx: number, updates: any) => appState.updateGroup(idx, updates),
    addPartyItem: (item: any) => appState.addPartyItem(item),
    deletePartyItem: (idx: number) => appState.deletePartyItem(idx),
    updatePartyItem: (idx: number, updates: any) => appState.updatePartyItem(idx, updates),
    addPersonalItem: (item: any) => appState.addPersonalItem(item),
    deletePersonalItem: (idx: number) => appState.deletePersonalItem(idx),
    updatePersonalItem: (idx: number, updates: any) => appState.updatePersonalItem(idx, updates),
    addAdvanceItem: (item: any) => appState.addAdvanceItem(item),
    deleteAdvanceItem: (idx: number) => appState.deleteAdvanceItem(idx),
    updateAdvanceItem: (idx: number, updates: any) => appState.updateAdvanceItem(idx, updates),
    setPrimaryPayer: (payer: string) => appState.setPrimaryPayer(payer),
    setConsolidateAdvance: (value: boolean) => appState.setConsolidateAdvance(value),
    setParseMode: (mode: 'auto' | 'manual') => appState.setParseMode(mode),
    replaceAllItems: (party: any[], personal: any[], advance: any[]) =>
      appState.replaceAllItems(party, personal, advance),
    reset: () => appState.reset(),
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
