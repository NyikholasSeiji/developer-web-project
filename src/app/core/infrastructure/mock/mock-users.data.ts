interface MockUserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
}

/**
 * "Banco de dados" em memória, usado como fallback do AuthRepository quando
 * o backend está indisponível. Só dura a sessão do navegador (recarregou,
 * some). Usuário de teste: demo@forme.com / 123456
 */
export const MOCK_USERS: MockUserRecord[] = [
  {
    id: 'u01',
    name: 'Usuária Demo',
    email: 'demo@forme.com',
    password: '123456',
    cpf: '111.111.111-11',
    phone: '(11) 91111-1111',
  },
];
