// api/middleware.js
module.exports = (req, res, next) => {
  // Rotas que não exigem autenticação
  const publicRoutes = ['/users'];

  // Verifica se a requisição é para uma rota pública
  if (publicRoutes.some(route => req.path.startsWith(route))) {
    // Se for uma requisição GET para /users (login), permite continuar
    if (req.method === 'GET' && req.path.startsWith('/users')) {
      return next();
    }
    // Se for uma requisição POST para /users (registro), permite continuar
    if (req.method === 'POST' && req.path === '/users') {
      return next();
    }
  }

  // Para todas as outras rotas, verifica a presença do cabeçalho de autorização
  if (req.headers.authorization) {
    // A requisição tem um cabeçalho de autorização, então permite continuar.
    // Em uma API real, você validaria o token JWT aqui.
    next();
  } else {
    // Nenhum cabeçalho de autorização encontrado, retorna erro 401
    res.status(401).json({ error: 'Acesso não autorizado. Token não fornecido.' });
  }
};
