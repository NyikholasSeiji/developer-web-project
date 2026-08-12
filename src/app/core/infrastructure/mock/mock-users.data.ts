interface MockUserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
}

/**
 * "Banco de dados" em memória, só dura a sessão do navegador (recarregou,
 * some). Serve pra testar login/registro sem precisar de backend ainda.
 * Usuário de teste: demo@forme.com / 123456
 */
export const MOCK_USERS: MockUserRecord[] = [
  { id: 'u01', name: 'Usuária Demo', email: 'demo@forme.com', password: '123456' },
];
