package br.com.sistemaOcorrenciasUrbanas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;



import br.com.sistemaOcorrenciasUrbanas.model.entity.Registro;


public interface RegistroRepository extends JpaRepository<Registro, Integer> {
	
	//buscar por titulo, mas é uma lista pois podem haver registros com o mesmo titulo
	 List<Registro> findByTitulo(String titulo);

	 //buscar por id
	 Registro findByIdRegistro(int idRegistro);
	 
	 List<Registro> findByIdCriador(Integer idCriador);

	 List<Registro> findByIdResponsavel(Integer idResponsavel);
}
