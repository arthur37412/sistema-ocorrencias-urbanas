package br.com.sistemaOcorrenciasUrbanas.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.sistemaOcorrenciasUrbanas.model.entity.Registro;
import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;
import br.com.sistemaOcorrenciasUrbanas.repository.RegistroRepository;
import jakarta.transaction.Transactional;

@Transactional
@Service
public class RegistroService {

	@Autowired
	private RegistroRepository registroRepository;
	

	public List<Registro> findAll(){
		return registroRepository.findAll();
	}
	
	//Buscar por titulo
	public List<Registro> buscarPorTitulo(String titulo) {
	    return registroRepository.findByTitulo(titulo);
	}
		
		//buscar por id 
		public Registro buscarPorIdRegistro(int idRegistro) {
			return registroRepository.findByIdRegistro(idRegistro);
		}
		
		//Create e update
		public Registro saveRegistro(Registro registro) {
			return registroRepository.save(registro);
		}
		
		//Delete
		public void deleteRegistro(int idRegistro) {
			registroRepository.deleteById(idRegistro);
		}
		
		public List<Registro> buscarPorCriador(Integer idCriador) {
		    return registroRepository.findByIdCriador(idCriador);
		}

		public List<Registro> buscarPorResponsavel(Integer idResponsavel) {
		    return registroRepository.findByIdResponsavel(idResponsavel);
		}
		
		public List<Registro> listarRegistrosVisiveisNoMapa() {
		       List<Registro> registros = registroRepository.findAll();
		       LocalDate limite = LocalDate.now().minusDays(7);
		       return registros.stream().filter(registro -> {boolean finalizado ="Concluído".equals(registro.getStatus()) || "Resolvido".equals(registro.getStatus());
		       if (finalizado &&registro.getDataConclusao() != null &&registro.getDataConclusao().isBefore(limite)) { 
		           return false;
		           }
		       return true;}).toList();
		}
		
		
	
}
