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
                "email": `gigipilon@qa.com.br`,
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
                "email": `funo@qa.com.br`,
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

  it('Deve deletar um usuário previamente cadastrado', () => {
    let usuario = `Usuario EBAC ${Math.floor(Math.random() * 100000000)}`
    cy.request({
      method: 'POST',
      url: 'usuarios',
      body: {
        "nome": usuario,
        "email": `del${Math.floor(Math.random() * 100000)}@qa.com.br`,
        "password": "teste",
        "administrador": "true"
      }
    }).then(response => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
      }).then(response =>{
        expect(response.body.message).to.equal('Registro excluído com sucesso')
        expect(response.status).to.equal(200)
      })
    })
  });
});
