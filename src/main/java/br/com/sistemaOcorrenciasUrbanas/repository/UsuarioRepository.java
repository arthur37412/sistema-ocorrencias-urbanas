package br.com.sistemaOcorrenciasUrbanas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	
	//Buscar por nome
		public Usuario findByNomeUsuario(String nomeUsuario);
		
	//buscar por email para login
		public Usuario findByEmailUsuario(String emailUsuario);

}
