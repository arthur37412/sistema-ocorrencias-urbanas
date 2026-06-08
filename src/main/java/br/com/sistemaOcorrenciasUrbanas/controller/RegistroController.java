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

import br.com.sistemaOcorrenciasUrbanas.model.entity.Registro;
import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;
import br.com.sistemaOcorrenciasUrbanas.service.RegistroService;

@RestController
@RequestMapping("/api/registro")
public class RegistroController {
	
	@Autowired
    private RegistroService registroService;	
	
	@GetMapping
	public List<Registro> listarTodos(){
		return registroService.findAll();
	}
	
	//buscar por id 
	@GetMapping("/id/{idRegistro}")
	public Registro buscarPorId(@PathVariable int idRegistro) {
		Registro registro = registroService.buscarPorIdRegistro(idRegistro);
		return registro;
	}
	
	//Buscar por nome
	@GetMapping("/nome/{titulo}")
	public List<Registro> buscarPorNome(@PathVariable String titulo) {
		List<Registro> registro = registroService.buscarPorTitulo(titulo);
		return registro;
	}
	
	//Create
	@PostMapping
	public Registro insert(@RequestBody Registro registro) {
		return registroService.saveRegistro(registro);
	}
	
	//Delete
		@DeleteMapping("/delete/{idRegistro}")
			public String delete(@PathVariable int idRegistro) {
			registroService.deleteRegistro(idRegistro);
			return "Usuário deletado!";
		}
		
		// Update
		@PutMapping("/update/{idRegistro}")
		public Registro update(@RequestBody Registro registro, @PathVariable int idRegistro) {
		    Registro registroUpdate = registroService.buscarPorIdRegistro(idRegistro);
		    registroUpdate.setTitulo(registro.getTitulo());
		    registroUpdate.setDescricao(registro.getDescricao());
		    registroUpdate.setTipoRegistro(registro.getTipoRegistro());
		    registroUpdate.setIdCriador(registro.getIdCriador());
		    registroUpdate.setDataRegistro(registro.getDataRegistro());
		    registroUpdate.setIdResponsavel(registro.getIdResponsavel());
		    registroUpdate.setDataInicio(registro.getDataInicio());
		    registroUpdate.setPrevisao(registro.getPrevisao());
		    registroUpdate.setStatus(registro.getStatus());
		    registroUpdate.setTrafegoV(registro.getTrafegoV());
		    registroUpdate.setTrafegoP(registro.getTrafegoP());
		    registroUpdate.setFuncionamento(registro.getFuncionamento());
		    registroUpdate.setRuidoExcessivo(registro.isRuidoExcessivo());
		    registroUpdate.setPoeiraExcessiva(registro.isPoeiraExcessiva());
		    registroUpdate.setEntulho(registro.isEntulho());
		    registroUpdate.setLatitude(registro.getLatitude());
		    registroUpdate.setLongitude(registro.getLongitude());
		    registroUpdate.setTipoLocal(registro.getTipoLocal());
		    registroUpdate.setNomeResponsavel(registro.getNomeResponsavel());
		    return registroService.saveRegistro(registroUpdate);
		}
	

}
