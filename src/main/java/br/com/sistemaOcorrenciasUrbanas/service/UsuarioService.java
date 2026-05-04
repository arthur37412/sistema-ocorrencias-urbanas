package br.com.sistemaOcorrenciasUrbanas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;
import br.com.sistemaOcorrenciasUrbanas.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Transactional
@Service
public class UsuarioService {
	
	@Autowired
	private UsuarioRepository usuarioRepository;
	
	public List<Usuario> findAll(){
		return usuarioRepository.findAll();
	}
	
	//buscar por id 
	public Usuario buscarPorId(int idUsuario) {
		return usuarioRepository.findById(idUsuario).get();
	}
	
	//Buscar por nome
	public Usuario buscarPorNome(String nomeUsuario) {
		return usuarioRepository.findByNomeUsuario(nomeUsuario);
	}
	
	//Create e update
	public Usuario saveUsuario(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}
	
	//Delete
	public void deleteUsuario(int idUsuario) {
		usuarioRepository.deleteById(idUsuario);
	}
	
	
	/*public Usuario fazerLogin(String emailUsuario, String senhaUsuario) {
		Usuario usuario = usuarioRepository.findByEmailUsuario(emailUsuario);
		if(usuario == null)
			return null;
		if(!usuario.getSenha().equals(senhaUsuario))
			return null;
		
		return usuario;
	}*/
	
	

}
