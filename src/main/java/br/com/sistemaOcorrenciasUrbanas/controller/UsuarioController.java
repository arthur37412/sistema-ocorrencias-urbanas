package br.com.sistemaOcorrenciasUrbanas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;
import br.com.sistemaOcorrenciasUrbanas.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioService usuarioService;
	
	@GetMapping
	public List<Usuario> listarTodos(){
		return usuarioService.findAll();
	}
	
	//buscar por id 
	@GetMapping("/id/{idUsuario}")
	public Usuario buscarPorId(@PathVariable int idUsuario) {
		Usuario usuario = usuarioService.buscarPorId(idUsuario);
		return usuario;
	}
	
	//Buscar por nome
	@GetMapping("/nome/{nomeUsuario}")
	public Usuario buscarPorNome(@PathVariable String nomeUsuario) {
		Usuario usuario = usuarioService.buscarPorNome(nomeUsuario);
		return usuario;
	}
	
	//Create
	@PostMapping
	public Usuario insert(@RequestBody Usuario usuario) {
		return usuarioService.saveUsuario(usuario);
	}
	
	//Update
	@PutMapping("/update/{idUsuario}")
	public Usuario update(@RequestBody Usuario usuario, @PathVariable int idUsuario) {
		Usuario usuarioUpdate = usuarioService.buscarPorId(idUsuario);
		usuarioUpdate.setNomeUsuario(usuario.getNomeUsuario());
		usuarioUpdate.setEmailUsuario(usuario.getEmailUsuario());
		usuarioUpdate.setSenhaUsuario(usuario.getSenhaUsuario());
		return usuarioService.saveUsuario(usuarioUpdate);
	}
	
	//Delete
	@DeleteMapping("/delete/{idUsuario}")
		public String delete(@PathVariable int idUsuario) {
		usuarioService.deleteUsuario(idUsuario);
		return "Usuário deletado!";
	}
	
	/*@PostMapping("/login")
	public Usuario fazerLogin(@RequestBody LoginDTO login) {
		return usuarioService.fazerLogin(login.getEmail(), login.getSenha());
	}*/
	
}
