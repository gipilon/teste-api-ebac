/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contracts'
describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        }) 
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
    cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": usuario,
                "email": `gigipilonnasc@qa.com.br`,
                "password": "teste",
                "administrador": "true"
            }
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })     
  });

  it('Deve validar um usuário com email inválido', () => {
    let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
    cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": usuario,
                "email": `funoea@qa.com.br`,
                "password": "teste",
                "administrador": "true"
            }, failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
        })  
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.request('usuarios').then(response => {
            let id = response.body.usuarios[0]._id 
            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                body: 
                {
                  "nome": "Usuario Editado",
                  "email": `fuzio${Math.floor(Math.random() * 100000)}@qa.com.br`,
                  "password": "teste",
                  "administrador": "true"
                  }
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        }) 
  });

  it('Deve cadastrar e deletar um usuário com sucesso', () => {
    cy.cadastrarUsuario('Usuário Teste', 'senha123').then((response) => {
      const userId = response.body._id;

      cy.request({
        method: 'DELETE',
        url: `/usuarios/${userId}`,
        failOnStatusCode: false
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
      })
    })
  });
});
