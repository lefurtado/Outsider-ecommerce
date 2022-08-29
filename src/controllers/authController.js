// ========================================================
// Controller responsável por gerenciar a sessão do usuário
// (Ex: login, logout)
// ========================================================

const bcrypt = require('bcrypt');

const Users = require('../models/Users');

const authController = {
    login: (req, res) => {
        // Pega os dados do usuário do corpo da requisição
        const { email, password } = req.body;

        // Chama a model para buscar um usuário pelo email
        const user = Users.findByEmail(email);

        // Verifica se o usuário existe
        if (!user) {
            // Se não existir, renderiza a página de login com erro
            return res.render('login', { error: 'Email ou senha inválidos' });
        }

        // Verifica se a senha informada é a mesma que a senha criptografada no db
        const senhaValida = bcrypt.compareSync(password, user.password);

        // Verifica se a senha é válida
        if (!senhaValida) {
            // Se a senha for inválida, renderiza a página de login com erro
            return res.render('login', { error: 'Email ou senha inválidos' });
        }

        // Se o email e a senha forem válidos, cria uma sessão para o usuário
        // Salvando o email e o id do usuário na sessão
        req.session.user = { email: user.email, id: user.id };

        // Redireciona para a página restrita
        return res.redirect('/users/account');
    },

    renderLogin: (req, res) => {
        // Verifica se o usuário está logado
        // Ou seja, se existe uma sessão para o usuário
        if (req.session.user != undefined) {
            // Se estiver logado, redireciona para a página restrita
            return res.redirect('/users/account');
        }

        // Renderiza a página de login
        return res.render('login', { error: null });
    },

    renderAreaRestrita: (req, res) => {
        // Busca o usuário na sessão
        const user = req.session.user;
        // Renderiza a página restrita passando os dados do usuário logado
        return res.render('account', { user });
    }
}

module.exports = authController;