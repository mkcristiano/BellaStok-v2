export interface Cliente {
  CodCliente: string; // ID vindo do CSV (Coluna 0)
  NomeCliente: string;
  CNPJ_CPF?: string;
  Endereco?: string;
  Bairro?: string;
  Cidade?: string;
  CEP?: string;
  Fone?: string;
  Ult_Compra?: string;
  Email?: string;
}

export interface ItemListaProduto {
  id?: string; // Unique ID for each lot
  Codigo_de_Barras: string; // Coluna 0
  Nome_do_Produto: string;  // Coluna 1
  MARCA: string;            // Coluna 2
  Quantidade: number;       // Coluna 3
  Preco_Produto: number;    // Coluna 4
  Desconto_Porc?: number;   // Coluna 5 (Desconto%)
  TOTALdesc_Porc?: number;  // Coluna 6 (TOTAL %)
  CATEGORIA: string;        // Coluna 7
  img?: string;             // Coluna 8
  Usuario?: string;         // Coluna 9
  Data_Validade?: string;   // Coluna 10 (NOVO: Validade do Lote)
}

export interface ItemPedido {
  ID_ITEM: string;
  CodPedido: string;
  NomeCliente: string;
  Codigo_de_Barras: string;
  Nome_do_Produto: string;
  Descricao?: string; 
  Preco_Uni: number;
  Quantidade: number;
  Desconto_Porc?: number;
  img?: string;
  Data_atual: string;
  Data_Validade?: string; // NOVO: Critério de Agrupamento
}

// --- NOVA TABELA DE REGISTRO DE LIBERAÇÃO ---
export interface ItemConferido {
    Codigo_de_Barras: string;
    Quantidade_Solicitada: number;
    Quantidade_Conferida: number;
    Status_Item: 'OK' | 'DIVERGENTE' | 'EXCEDENTE';
}

export interface RegistroLiberacao {
  idLiberaPedido: string; // ID Único da Liberação
  CodPedido: string;      // Vínculo
  Data_Liberacao: string; // Timestamp
  Usuario_Responsavel: string; // Almox que liberou
  Representante?: string; // QUEM CRIOU O PEDIDO (Vendas/Compras)
  Itens_Conferidos: ItemConferido[]; // Snapshot da conferência
  Status_Final: 'LIBERADO_TOTAL' | 'LIBERADO_PARCIAL';
  Observacoes?: string;
}

export interface PedidoCompleto {
  CodPedido: string;
  DadosCliente: Cliente;
  Itens: ItemPedido[];
  Data_atual: string;      // Data de Criação
  Data_Finalizacao?: string; // Data de Conclusão (para cálculo de tempo)
  Status: 'PENDENTE' | 'LIBERADO' | 'PARCIAL';
  Usuario: string;
  Descricao_Geral?: string;
}

export interface UserAccount {
    name: string;
    email: string;
    password?: string; 
    role: 'Admin' | 'Almoxarifado' | 'Vendas' | 'Compras'; 
    hasSetPassword?: boolean;
}

export enum AppView {
  HOME = 'HOME',
  CREATE_ORDER = 'CREATE_ORDER',
  VALIDATE_ORDER = 'VALIDATE_ORDER',
  CUSTOMERS = 'CUSTOMERS',
  PRODUCTS = 'PRODUCTS',
  INVENTORY = 'INVENTORY',
  ORDERS_LIST = 'ORDERS_LIST',
  DATA_SYNC = 'DATA_SYNC',
  ORDER_RELEASES = 'ORDER_RELEASES' 
}